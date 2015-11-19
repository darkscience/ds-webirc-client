import { createChannel } from '../channels';

const handlers = {
  activate(channels, action, state) {
    const newActive = channels
      .get('joined')
      .filter(c => c.name == action.channel)
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
      return channels.updateIn('joined',
        j => j.filter(c => c.name != action.channel));
    }
    else {
      // TODO: Create a message.
    }
  },

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
