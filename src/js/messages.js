import Immutable from 'immutable';
import moment from 'moment';

/**
 * @param type One of: channel, pm, notice, local
 */
export function createMessage(type, from, to, text) {
  return Immutable.Map({ time: moment(), type, from, to, text });
}
