import Immutable from 'immutable';
import { createChannel } from '../channels';
import { sock } from '../wiring';
import reduceChannels from './channels';
import reduceUsers from './users';
import reduceNetworks from './networks';
import { createMessage } from '../messages';

let defaultState = {
  nick: "DefaultNick",
  channels: {
    active: null,
    joined: []
  },
  messages: []
};
defaultState.channels.active = createChannel('network', 'Network');
defaultState.channels.joined.push(defaultState.channels.active);
defaultState = Immutable.fromJS(defaultState);

export default function appReducer(state, action) {
  if (!state) {
    state = defaultState;
  }

  let globalAction = false;

  const actionClass = action.type.split(':', 1)[0];
  switch (actionClass) {
    case 'channel':
      state = state.set('channels',
        reduceChannels(state.get('channels'), action, state));
      break;
    case 'network':
      state = state.set('network',
        reduceNetwork(state.get('network'), action, state));
      break;
    case 'users':
      state = state.set('users',
        reduceUsers(state.get('users'), action, state));
      break;
    default:
      globalAction = true;
  }

  // XXX: Store the nick in the users state so we don't have to do this.
  if (action.type == 'users:nickChanged') {
    state = state.set('nick', action.newNick);
  }

  // TODO: Move message handlers to a separate reducer. (Should all be 'messages' too)
  if (globalAction) switch (action.type) {
    case 'messages:received':
      state = state.updateIn(['messages'], m => m.push(action.message));
      break;
    case 'message:update':
      state = state.set('message', action.value);
      break;
    case 'message:send': {
      // TODO: Read the message from the action.
      let msg = state.get('message');
      if (msg) {
        let chan = state.getIn(['channels', 'active']);
        sock.emit('say', chan.get('name'), state.get('message'));
        state = state
          .set('message', '')
          .updateIn(['messages'], m => m.push(createMessage("channel",
            state.get('nick'), chan.get('name'), msg)));
      }
      break;
    }
    // TODO: Move this to some UI thing. Possibly just leave it with Chat.
    case 'message:clear':
      state = state.set('message', '');
      break;
  }

  return state;
}
