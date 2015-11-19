/**
 * Wires up the web socket events to actions.
 */
import store from './store';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import ChannelActions from './actions/channels';
import UserActions from './actions/users';
import MessageActions from './actions/messages';

const Channels = bindActionCreators(ChannelActions, store.dispatch);
const Users = bindActionCreators(UserActions, store.dispatch);
const Messages = bindActionCreators(MessageActions, store.dispatch);

export const sock = io.connect('//localhost:9000');

sock.on('message', (type, ...args) => {
  const handlers = {
    join(channel, nick) { Channels.joined(channel, nick); },
    part(channel, nick) { Channels.parted(channel, nick); },
    nick(oldNick, newNick, channels) { Users.nickChanged(oldNick, newNick); },
    message(from, to, text) { Messages.received('channel', from, to, text); }
  };

  if (handlers[type]) {
    handlers[type](...args);
  }
});
