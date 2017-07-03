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
import Project from './projects.model';
import {
  respondWithResult, upsertEntity, createEntity,
  destroyEntity, handleEntityNotFound, handleError, patchEntity,
} from '../utils/utils';

// Gets a list of Project
export const index = (req, res) =>
  Project.find()
    .sort({ _id: -1 })
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));

// Gets a single Project from the DB from id or from slug...
export const show = (req, res) => Project
  .findById(req.params.id).exec()
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(() => {
    Project.findOne({slug: req.params.id}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  });

// Creates a new Project in the DB
export const create = (req, res) => createEntity(req, res, Project);

// Upserts the given Project in the DB at the specified ID
export const upsert = (req, res) => upsertEntity(req, res, Project);

// Updates an existing Project in the DB
export const patch = (req, res) => patchEntity(req, res, Project);

// Deletes a Project from the DB
export const destroy = (req, res) => destroyEntity(req, res, Project);

