/**
 * Thing model events
 */

'use strict';

import {EventEmitter} from 'events';
import PageInfos from './pageInfos.model';
var PageInfosEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PageInfosEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  PageInfos.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PageInfosEvents.emit(`${event}:${doc._id}`, doc);
    PageInfosEvents.emit(event, doc);
  };
}

export default PageInfosEvents;
