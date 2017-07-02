/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/posts              ->  index
 * POST    /api/posts              ->  create
 * GET     /api/posts/:id          ->  show
 * PUT     /api/posts/:id          ->  upsert
 * PATCH   /api/posts/:id          ->  patch
 * DELETE  /api/posts/:id          ->  destroy
 */

'use strict';
import Posts from './posts.model';
import { respondWithResult, patchUpdates, removeEntity, handleEntityNotFound, handleError } from '../utils/utils';

// Gets a list of Posts
export const index = (req, res) => Posts
    .find()
    .sort([['date', 'descending']])
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));

// Gets a single Posts from the DB from id or from slug...
export const show = (req, res) => Posts
  .findById(req.params.id).exec()
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(() => {
    Posts.findOne({slug: req.params.id}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  });

// Creates a new Posts in the DB
export const create = (req, res) => Posts
  .create(req.body)
  .then(respondWithResult(res, 201))
  .catch(err => {
    console.log(err);
    handleError(res);
  }
);

// Upserts the given Posts in the DB at the specified ID
export const upsert = (req, res) => {
  if (req.body._id) {
    delete req.body._id;
  }
  return Posts.findOneAndUpdate(
    { _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }
  )
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
};

// Updates an existing Posts in the DB
export const patch = (req, res) => {
  if (req.body._id) {
    delete req.body._id;
  }
  return Posts.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
};

// Deletes a Posts from the DB
export const destroy = (req, res) => {
  return Posts.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
