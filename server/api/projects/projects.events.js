/**
 * Thing model events
 */

'use strict';

import {EventEmitter} from 'events';
import Projects from './projects.model';
var ProjectsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProjectsEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Projects.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ProjectsEvents.emit(`${event}:${doc._id}`, doc);
    ProjectsEvents.emit(event, doc);
  };
}

export default ProjectsEvents;
