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
//  console.log(`MSG[${type}]: `, ...args);
  const handlers = {
    join(channel, nick) { Channels.joined(channel, nick); },
    part(channel, nick) { Channels.parted(channel, nick); },
    nick(oldNick, newNick, channels) { Users.nickChanged(oldNick, newNick); },
    message(from, to, text) { Messages.received('channel', from, to, text); },
    pm(from, to, text) { Messages.received('pm', from, to, text); },
    notice(from, to, text) {
      // If there is no sender it's a message from the network. We classify
      // those differently internally.
      Messages.received((from && 'notice') || 'network', from, to, text);
    },
    motd(motd) { Messages.received('network', null, null, motd) },
    names(channel, users) {
      Channels.names(channel, users);
    }
  };

  if (handlers[type]) {
    handlers[type](...args);
  }
});
