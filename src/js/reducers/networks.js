const handlers = {
  connected(network, action, state) {

  },

  default(network, action, state) {
    console.warn(`Unrecognised network action ${action.type}`);
    return network;
  }
};

export default function reduceNetworks(network, action, state) {
  if (!(/^network:/).test(action.type)) {
    return network;
  }
  const handler = handlers[action.type.substring(8)] || handlers.default;
  return handler(network, action, state) || network;
};
