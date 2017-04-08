/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/projectDetails              ->  index
 * POST    /api/projectDetails              ->  create
 * GET     /api/projectDetails/:id          ->  show
 * PUT     /api/projectDetails/:id          ->  upsert
 * PATCH   /api/projectDetails/:id          ->  patch
 * DELETE  /api/projectDetails/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import projectDetails from './projectDetails.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Posts
export function index(req, res) {
  return projectDetails.find()
    .sort([['date', 'descending']])
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Posts from the DB from id or from slug...
export function show(req, res) {
  return projectDetails.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(() => {
      projectDetails.findOne({slug: req.params.id}).exec()
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
    });
}

// Creates a new Posts in the DB
export function create(req, res) {
  return projectDetails.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(err => {
      console.log(err);
      handleError(res);
    }
  );
}

// Upserts the given Posts in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return projectDetails.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { upsert: true, setDefaultsOnInsert: true, runValidators: true })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Posts in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return projectDetails.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Deletes a Posts from the DB
export function destroy(req, res) {
  return projectDetails.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
