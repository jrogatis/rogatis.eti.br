'use strict';

import mongoose from 'mongoose';

var ProjectsSchema = new mongoose.Schema({
  title: { type: 'String', required: true },
  type: {type: 'String', required: true },
  desc: { type: 'String', required: true },
  imgUrl: { type: 'String', required: true },
  siteUrl: { type: 'String', required: true },
  displayFront: { type: Boolean, required: true }
});

export default mongoose.model('Projects', ProjectsSchema);
