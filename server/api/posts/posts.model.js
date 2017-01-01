'use strict';

import mongoose from 'mongoose';

var PostsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  postImage: { type: String, required: true },
  snipet: { type: String, required: true },
  slug: { type: String, required: true },
  active: { type: Boolean, required: true, default: false },
  date: { type: Date, required: true, default: Date.now },
  author: {type: String, required: true },
  coments: [{
    from: { type: String, required: false },
    message: { type: String, required: false },
    date: { type: Date, required: false }
  }]
});

export default mongoose.model('Posts', PostsSchema);
