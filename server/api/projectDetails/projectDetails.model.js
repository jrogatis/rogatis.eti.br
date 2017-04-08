'use strict';

import mongoose from 'mongoose';

var ProjectDetailsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  postImage: { type: String, required: true },
  snipet: { type: String, required: true },
  slug: { type: String, required: true },
  active: { type: Boolean, required: true, default: false },
  date: { type: Date, required: true, default: Date.now },
});

export default mongoose.model('ProjectDetails', ProjectDetailsSchema);
