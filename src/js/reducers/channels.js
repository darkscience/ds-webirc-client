import { createChannel } from '../channels';
import { sock } from '../wiring';

const handlers = {
  activate(channels, action, state) {
    const newActive = channels
      .get('joined')
      .filter(c => c.get('name') == action.channel)
      .first();
    return newActive ? channels.set('active', newActive) : channels;
  },

  joined(channels, action, state) {
    if (action.nick == state.get('nick')) {
      const chan = createChannel('normal', action.channel);
      return channels
        .updateIn(['joined'], j => j.push(chan))
        .set('active', chan);
    }
    else {
      // TODO: Create a message.
    }
  },

  parted(channels, action, state) {
    if (action.nick == state.get('nick')) {
      return channels.updateIn(['joined'],
        j => j.filter(c => c.get('name') != action.channel));
    }
    else {
      // TODO: Create a message.
    }
  },

  join(channels, action, state) {
    sock.emit('join', action.channel);
  },

  part(channels, action, state) {
    sock.emit('part', action.channel);
  },

/* XXX: Currently breaks things. I suspect we need to get rid of the copy in channels['active']
  names(channels, action, state) {
    return channels.update('joined', j => j.map(chan => {
      if (chan.get('name') == action.channel) {
        chan = chan.set('names', action.names);
      }
      return chan;
    }));
  },
*/

  default(channels, action, state) {
    console.warn(`Unrecognised channel action ${action.type}`);
    return channels;
  }
};

export default function reduceChannels(channels, action, state) {
  if (!(/^channel:/).test(action.type)) {
    return channels;
  }
  const handler = handlers[action.type.substring(8)] || handlers.default;
  return handler(channels, action, state) || channels;
};
