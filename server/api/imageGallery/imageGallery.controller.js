/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/imageGallery              ->  index
 * POST    /api/imageGallery              ->  create
 * GET     /api/imageGallery/:id          ->  show
 * DELETE  /api/imageGallery/:id          ->  destroy
 */

'use strict';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import moment from 'moment';

AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: 'us-east-1'
});
const s3 = new AWS.S3();
let params = {
  Bucket: 'rogatis'
};
const s3Url = 'https://s3.amazonaws.com/rogatis';

exports.signing = (req, res) => {
  const request = req.body;
  const fileName = request.filename;
  const path = fileName;

  const readType = 'public-read';

  const expiration = moment().add(5, 'm')
    .toDate(); //15 minutes

  const s3Policy = {
    expiration,
    conditions: [{
      bucket: 'rogatis'
    },
    ['starts-with', '$key', path],
      {
        acl: readType
      },
      {
        success_action_status: '201'
      },
    ['starts-with', '$Content-Type', request.type],
    ['content-length-range', 2048, 10485760], //min and max
    ]
  };

  const stringPolicy = JSON.stringify(s3Policy);
  const base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

  // sign policy
  const signature = crypto.createHmac('sha1', process.env.aws_secret_access_key)
    .update(new Buffer(base64Policy, 'utf-8'))
    .digest('base64');

  const credentials = {
    url: s3Url,
    fields: {
      key: path,
      AWSAccessKeyId: process.env.aws_access_key_id,
      acl: readType,
      policy: base64Policy,
      signature,
      'Content-Type': request.type,
      success_action_status: 201
    }
  };
  res.jsonp(credentials);
};

const handleError = (res, statusCode) => {
  statusCode = statusCode || 500;
  return err => res.status(statusCode).send(err);
};

// Gets a list of images
export const index = (req, res) => s3
  .listObjects(params)
  .promise()
  .then(data => {
    let images = [];
    data.Contents.map(image => images.push(image.Key));
    return res.status(200).json(images);
  })
  .catch(err => {
    console.log(err);
    return handleError(res);
  });

// Deletes a image from the s3
export const destroy = (req, res) => {
  let paramsToDelete = {
    Bucket: 'rogatis',
    Key: req.params.id
  };
  s3.deleteObject(paramsToDelete).promise()
    .then(result => {
      console.log(result);
      return res.status(200);
    })
    .catch(err => {
      console.log(err);
      return handleError(res);
    });
};
