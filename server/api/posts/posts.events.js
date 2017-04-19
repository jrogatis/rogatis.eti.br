/**
 * Thing model events
 */

'use strict';

import {EventEmitter} from 'events';
import Posts from './posts.model';
const PostsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PostsEvents.setMaxListeners(0);

// Model events
const events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(let e in events) {
  let event = events[e];
  Posts.schema.post(e, emitEvent(event));
}

const emitEvent = event => doc => {
  PostsEvents.emit(`${event}:${doc._id}`, doc);
  PostsEvents.emit(event, doc);
};


export default PostsEvents;
