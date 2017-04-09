'use strict';

import mongoose from 'mongoose';

const PageInfosSchema = new mongoose.Schema({
  pageName: String,
  pageDesc: String,
  pageImgUrl: String,
  pageUrl: String,
  pageShortUrl: String
});

export default mongoose.model('PageInfos', PageInfosSchema);
