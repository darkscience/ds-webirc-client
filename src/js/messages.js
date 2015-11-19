import Immutable from 'immutable';
import moment from 'moment';

let messageCounter = 0;

/**
 * @param type One of: channel, pm, notice, local
 */
export function createMessage(type, from, to, text) {
  return Immutable.Map({
    id: messageCounter++,
    time: moment(),
    type,
    from,
    to,
    text
  });
}
