'use strict';

import mongoose from 'mongoose';

const ProjectsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {type: String, required: true },
  desc: { type: String, required: true },
  imgUrl: { type: String, required: true },
  siteUrl: { type: String, required: true },
  displayFront: { type: Boolean, required: false, default: false },
  hasDesc: { type: Boolean, required: false, default: false },
  slug: { type: String, required: true }
});

export default mongoose.model('Projects', ProjectsSchema);
