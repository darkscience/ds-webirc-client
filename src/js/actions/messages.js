import { createMessage } from '../messages';

const MessageActions = {
  received(type, from, to, text) {
    return {
      type: 'messages:received',
      message: createMessage(type, from, to, text)
    }
  }
};

export default MessageActions;
