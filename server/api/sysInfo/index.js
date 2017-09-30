'use strict';

import { Router } from 'express';
import * as controller from './sysInfo.controller';

const router = new Router();

router.get('/ver', controller.ver);

module.exports = router;
