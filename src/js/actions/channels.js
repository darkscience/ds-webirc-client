const Channels = {
  activate(channel) {
    return { type: 'channel:activate', channel };
  },

  join(channel) {
    return { type: 'channel:join', channel };
  },

  joined(channel, nick) {
    return { type: 'channel:joined', channel, nick };
  },

  part(channel) {
    return { type: 'channel:part', channel };
  },

  parted(channel, nick) {
    return { type: 'channel:parted', channel, nick };
  }
};

export default Channels;
