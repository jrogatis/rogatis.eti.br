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
import {
  createEntity,
  respondWithResult, showEntitySlug,
  handleError, patchEntity, destroyEntity, upsertEntity
} from '../utils/utils';

// Gets a list of Posts
export const index = (req, res) => Posts
  .find()
  .sort([['date', 'descending']])
  .exec()
  .then(respondWithResult(res))
  .catch(handleError(res));

// Gets a single Posts from the DB from id or from slug...
export const show = (req, res) => showEntitySlug(req, res, Posts);
// Creates a new Posts in the DB
export const create = (req, res) => createEntity(req, res, Posts);

// Upserts the given Posts in the DB at the specified ID
export const upsert = (res, req) => upsertEntity(req, res, Posts);

// Updates an existing Posts in the DB
export const patch = (req, res) => patchEntity(req, res, Posts);

// Deletes a Posts from the DB
export const destroy = (req, res) => destroyEntity(req, res, Posts);

