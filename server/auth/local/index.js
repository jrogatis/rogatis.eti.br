'use strict';

import express from 'express';
import passport from 'passport';
import { signToken } from '../auth.service';

const router = express.Router();

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log('aqui', err);
    const error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) {
      return res.status(404).json({
        message: 'Something went wrong, please try again.'
      });
    }

    const token = signToken(user._id, user.role);
    res.json({
      token
    });
  })(req, res, next);
});

export default router;
