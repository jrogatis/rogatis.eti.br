/**
 * Using Rails-like standard naming convention for endpoints.

 * POST    /api/ContactForm              ->  create

 */

'use strict';
import jsonpatch from 'fast-json-patch';
import ContactForm from './contactForm.model';
import express from 'express';
import mailer from 'express-mailer';

var app = express();

mailer.extend(app, {
  from: 'jrogatis@gmail.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_SECRET
  }
});

app.set('views', __dirname + '/');
app.set('view engine', 'pug');


function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function handleSendEmail(res, msg) {
  app.mailer.send({
    template: 'email',
     bcc:'jrogatis@metaconexao.com.br'
  },
  {
    to: msg.email,
    subject: 'Your contact with Jean', // REQUIRED.
    otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
  }, function (err) {
    if (err) {
      // handle error
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.send('Email Sent');
  });
}

// Creates a new ContactForm in the DB
export function create(req, res) {
  return ContactForm.create(req.body)
    .then(handleSendEmail(res, req.body))

}
