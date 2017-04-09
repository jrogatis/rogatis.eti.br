'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

const validationError = (res, statusCode) => {
  statusCode = statusCode || 422;
  return err => res.status(statusCode).json(err);
};

const handleError = (res, statusCode) => {
  statusCode = statusCode || 500;
  return err => res.status(statusCode).send(err);
};


const handleEntityNotFound = res => {
  return entity => {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
};

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => res.status(200).json(users))
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then(user => {
      const token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user Info
 */
export function showInfo(req, res) {
  const userId = req.params.id;
  return User.findById(userId).exec()
    .then(handleEntityNotFound(res))
    .then(user => {
      res.json(user);
    });
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  console.log('no show');
  const userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(() => res.status(204).end())
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  const userId = req.user._id;
  const oldPass = String(req.body.oldPassword);
  const newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => res.status(204).end())
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

export function changeSettings(req, res) {
  const userId = req.user._id;
  const userNewSettings = req.body;
  return User.findById(userId).exec()
    .then(user => {
      user.fullName = userNewSettings.newUser.fullName;
      user.city = userNewSettings.newUser.city;
      user.state = userNewSettings.newUser.state;
      return user.save()
        .then(() => res.status(204).end())
        .catch(error => console.log(error));
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  const userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
