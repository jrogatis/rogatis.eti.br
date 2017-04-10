/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/projects              ->  index
 * POST    /api/projects              ->  create
 * GET     /api/projects/:id          ->  show
 * PUT     /api/projects/:id          ->  upsert
 * PATCH   /api/projects/:id          ->  patch
 * DELETE  /api/projects/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Project from './projects.model';

const respondWithResult = (res, statusCode) => {
  statusCode = statusCode || 200;
  return entity => {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
};

const patchUpdates = patches =>
  entity => {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }
    return entity.save();
  };

const removeEntity = res =>
  entity => {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };

const handleEntityNotFound = res =>
  entity => {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };


const handleError = (res, statusCode) => {
  statusCode = statusCode || 500;
  return err => {
    console.log(err);
    res.status(statusCode).send(err);
  };
};

// Gets a list of Project
export const index = (req, res) =>
  Project.find()
    .sort({ _id: -1 })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));

// Gets a single Project from the DB from id or from slug...
export function show(req, res) {
  return Project.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(() => {
      Project.findOne({slug: req.params.id}).exec()
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
    });
}


// Creates a new Project in the DB
export const create = (req, res) =>
  Project.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));


// Upserts the given Project in the DB at the specified ID
export const upsert = (req, res) => {
  if(req.body._id) {
    delete req.body._id;
  }
  return Project.findOneAndUpdate(
    { _id: req.params.id }, req.body,
    { upsert: true, setDefaultsOnInsert: true, runValidators: true }
  )
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
};

// Updates an existing Project in the DB
export const patch = (req, res) => {
  if(req.body._id) {
    delete req.body._id;
  }
  return Project.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

// Deletes a Project from the DB
export const destroy = (req, res) =>
  Project.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));

