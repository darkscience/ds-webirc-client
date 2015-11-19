import { sock } from '../wiring';

const handlers = {
  changeNick(action, store) {
    console.log("sending nick change request");
    sock.emit('nick', action.newNick);
  },

  default(action) {
    console.warn(`Unrecognised user action ${action.type}`);
  }
};

export default function reduceUsers(users, action, store) {
  if (!(/^users:/).test(action.type)) {
    return users;
  }

  const handler = handlers[action.type.substring(6)] || handlers.default;
  return handler(action, store) || users;
}
