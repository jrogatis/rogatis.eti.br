/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/imageGallery              ->  index
 * POST    /api/imageGallery              ->  create
 * GET     /api/imageGallery/:id          ->  show
 * PUT     /api/imageGallery/:id          ->  upsert
 * PATCH   /api/imageGallery/:id          ->  patch
 * DELETE  /api/imageGallery/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Posts from './posts.model';
import AWS from 'aws-sdk';

AWS.config.update({accessKeyId: 'mykey', secretAccessKey: 'mysecret', region: 'global'});
var s3 = new AWS.S3();

var params = { 
 Bucket: 'mystore.in',
 Delimiter: '/',
 Prefix: 's/5469b2f5b4292d22522e84e0/ms.files/'
}

s3.listObjects(params, function (err, data) {
 if(err)throw err;
 console.log(data);
});


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

// Gets a list of Postss
export function index(req, res) {
  return Posts.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Posts from the DB
export function show(req, res) {
  return Posts.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Posts in the DB
export function create(req, res) {
  return Posts.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Posts in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Posts.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Posts in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Posts.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Posts from the DB
export function destroy(req, res) {
  return Posts.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
