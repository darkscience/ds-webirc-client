const NetworkActions = {
  connect(nick) {
    return {
      type: 'network:connect',
      nick: nick
    }
  }
};
