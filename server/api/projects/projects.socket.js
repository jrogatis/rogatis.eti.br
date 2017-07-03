/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import ProjectsEvents from './projects.events';

// Model events to emit
const events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for (let i = 0, eventsLength = events.length; i < eventsLength; i++) {
    const event = events[i];
    const listener = createListener(`projects:${event}`, socket);

    ProjectsEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}


const createListener = (event, socket) => doc => socket.emit(event, doc);
const removeListener = (event, listener) => () => ProjectsEvents.removeListener(event, listener);
