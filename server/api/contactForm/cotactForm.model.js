'use strict';

import mongoose from 'mongoose';

var contactFormSchema = new mongoose.Schema({
  fistName: String,
  lastName: String,
  email: String,
  message: String,
  date: Date
});

export default mongoose.model('contactForm', contactFormSchema);
