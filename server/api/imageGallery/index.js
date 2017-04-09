'use strict';

const express = require('express');
const controller = require('./imageGallery.controller');

const router = express.Router();

router.get('/', controller.index);
router.post('/signing', controller.signing);
router.delete('/:id', controller.destroy);

module.exports = router;
