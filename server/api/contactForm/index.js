'use strict';

const express = require('express');
const controller = require('./contactForm.controller');

const router = express.Router();
router.post('/', controller.create);

module.exports = router;
