/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/pageInfos              ->  index
 * POST    /api/pageInfos              ->  create
 * GET      /api/pageInfos/pageUrl/:id  ->  showByUrl
 * GET     /api/pageInfos/:id          ->  show
 * PUT     /api/pageInfos/:id          ->  upsert
 * PATCH   /api/pageInfos/:id          ->  patch
 * DELETE  /api/pageInfos/:id          ->  destroy
 */

'use strict';

import PageInfos from './pageInfos.model';

import {
  respondWithResult, removeEntity,
  handleEntityNotFound, handleError, patchEntity, showEntity,
} from '../utils/utils';

// Gets a list of pagesInfos
export function index(req, res) {
  return PageInfos.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single pagesInfo from the DB
export function showByUrl(req, res) {
  return PageInfos.findOne({pageUrl: req.params.id}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Gets a single pagesInfo from the DB
export const show = (req, res) => showEntity(req, res, PageInfos);

// Creates a new pagesInfo in the DB
export function create(req, res) {
  console.log(req.body);
  return PageInfos.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given pageInfos in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return PageInfos.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing pageInfos in the DB
export const patch = (req, res) => patchEntity(req, res, PageInfos);

// Deletes a pageInfos from the DB
export const destroy = (req, res) => PageInfos.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
