'use strict';

import mongoose from 'mongoose';

var ProjectsSchema = new mongoose.Schema({
  title: String,
  desc: String,
  imgUrl: String,
  siteUrl: String,
  displayFront: Boolean
});

export default mongoose.model('Projects', ProjectsSchema);
