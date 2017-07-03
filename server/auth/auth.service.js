'use strict';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/user/user.model';

const validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export const isAuthenticated = () => compose()
  // Validate jwt
  .use((req, res, next) => {
    // allow access_token to be passed through query parameter as well
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = `Bearer ${req.query.access_token}`;
    }
    // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
    if (req.query && typeof req.headers.authorization === 'undefined') {
      req.headers.authorization = `Bearer ${req.cookies.token}`;
    }
    validateJwt(req, res, next);
  })
  // Attach user to request
  .use((req, res, next) => {
    User.findById(req.user._id).exec()
      .then(user => {
        if (!user) {
          return res.status(401)
            .end();
        }
        req.user = user;
        next();
      })
      .catch(err => next(err));
  });

const meetsRequirements = (req, res, next, roleRequired) => {
  if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
    return next();
  } else {
    return res.status(403).send('Forbidden');
  }
};

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export const hasRole = roleRequired => {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => meetsRequirements(req, res, next, roleRequired));
};

/**
 * Returns a jwt token signed by the app secret
 */
export const signToken = (id, role) => jwt.sign({ _id: id, role }, config.secrets.session, {
  expiresIn: 60 * 60 * 5
});


/**
 * Set token cookie directly for oAuth strategies
 */
export const setTokenCookie = (req, res) => {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  const token = signToken(req.user._id, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
};
