/**
 * Thing model events
 */

'use strict';

import {EventEmitter} from 'events';
import ContactForm from './contactForm.model';
const ContactFormEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ContactForm.setMaxListeners(0);

// Model events
const events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(let e in events) {
  let event = events[e];
  ContactForm.schema.post(e, emitEvent(event));
}

const emitEvent = event => doc => {
  ContactFormEvents.emit(`${event}:${doc._id}`, doc);
  ContactFormEvents.emit(event, doc);
};

export default ContactFormEvents;
