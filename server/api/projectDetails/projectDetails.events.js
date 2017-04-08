/**
 * Thing model events
 */

'use strict';

import {EventEmitter} from 'events';
import ProjectDetails from './projectDetails.model';
var ProjectDetailsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProjectDetailsEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = ProjectDetailsEvents[e];
  ProjectDetails.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ProjectDetailsEvents.emit(`${event}:${doc._id}`, doc);
    ProjectDetailsEvents.emit(event, doc);
  };
}

export default ProjectDetailsEvents;
