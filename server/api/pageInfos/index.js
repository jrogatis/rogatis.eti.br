'use strict';

const express = require('express');
const controller = require('./pageInfos.controller');

const router = express.Router();

router.get('/', controller.index);
router.get('/pageUrl/:id', controller.showByUrl);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
