'use strict';

import mongoose from 'mongoose';

var PostsSchema = new mongoose.Schema({
  title: String,
  text: String,
  postImage: String,
  snipet: String,
  slug: String,
  active: Boolean,
  coments: [{
    from: String,
    message: String,
    date: Date
  }]
});

export default mongoose.model('Posts', PostsSchema);
