import React from 'react';
import { connect } from 'react-redux';
import Users from '../actions/users';

class ChatBase extends React.Component {
  constructor() {
    super();
  }

  renderUsers() {
    let content = <div className="panel-body">
      <p className="help-block">There's nobody here! (Not even you!)</p>
    </div>;

    if (this.props.users.size > 0) {
      content = <div className="list-group">
        {this.props.users.map(user =>
          <div className="list-group-item" key={user.nick}>
            {user.nick}
          </div>)}
      </div>;
    }

    return <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Users</h3>
      </div>
      {content}
    </div>;
  }

  renderMessagePane() {
    return <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">{this.props.channel.get('topic')}</h3>
      </div>
      <div className="panel-body">
        <ul className="list-unstyled">{this.props.messages.map(message =>
          <li key={message.id}>[{message.from}] {message.text}</li>
        )}</ul>
      </div>
      <div className="panel-footer">
        <div className="input-group">
          <div className="input-group-addon">{this.props.nick}</div>
          <input ref="message" type="text" className="form-control"
            onKeyDown={this.onMessageKeyDown.bind(this)}
            onChange={this.props.updateMessage}
            value={this.props.message} />
        </div>
      </div>
    </div>;
  }

  onMessageKeyDown(e) {
    if (e.keyCode == 13) { // enter
      // Slash command
      if ((/^\/[^/]/).test(this.props.message)) {
        this.handleSlashCommand(this.props.message);
      }
      else if (this.props.sendMessage) {
        this.props.sendMessage();
      }
    }
  }

  handleSlashCommand(message) {
    if (message.length < 2 || message[0] != '/') {
      console.warn(`handleSlashCommand called with '${message}'...`);
    }

    let args = message.split(/\s+/);
    const cmd = args[0].substring(1);
    args = args.slice(1);

    const handlers = {
      nick: this.props.changeNick
    };

    handlers[cmd] && handlers[cmd].apply(null, args);
    this.props.clearMessage();
  }

  render() {
    return <div>
      <div className="col-sm-10">
        {this.renderMessagePane()}
      </div>
      <div className="col-sm-2">
        {this.renderUsers()}
      </div>
    </div>;
  }
}

const actionCreators = {
  // TODO: Move message action creation to actions/messages.js.
  updateMessage(e) {
    return {
      type: 'message:update',
      value: e.target.value
    };
  },

  sendMessage() {
    return { type: 'message:send' };
  },

  clearMessage() {
    return { type: 'message:clear' };
  },

  changeNick(nick) {
    return Users.changeNick(nick);
  }
};

const Chat = connect(state => {
  const channel = state.getIn(['channels', 'active']);
  let res =  {
    channel,
    nick: state.get('nick'),
    message: state.get('message'),
    messages: state.get('messages')
      .filter(m => m.get('to') == channel.get('name'))
      .toJS(),
    users: channel.get('users')
  };
  console.table(res.messages);
  return res;
}, actionCreators)(ChatBase);

export default Chat;
