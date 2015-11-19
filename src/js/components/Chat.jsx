import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import TimeAgo from 'react-components/timeago';
import UserActions from '../actions/users';
import ChannelActions from '../actions/channels';

class ChatBase extends React.Component {
  constructor() {
    super();
  }

  componentDidUpdate() {
    // TODO: Enable/disable autoscroll depending on whether the user has
    // manually adjusted the scrollbar (i.e., we've scrolled up before being
    // scrolled all the way back down the the bottom).
    this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
  }

  renderUsers() {
    let content = <div className="panel-body">
      <p className="help-block">There's nobody here! (Not even you!)</p>
    </div>;

    if (this.props.names.size > 0) {
      content = <div className="list-group">
        {this.props.names.map(name =>
          <div className="list-group-item" key={name}>{name}</div>)}
      </div>;
    }

    return <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Users</h3>
      </div>
      {content}
    </div>;
  }

  renderMessageGutter(msg) {
    const time = msg.time.format("HH:mm:ss");
    const nick = msg.type == 'notice' ? `-${msg.from}-` : msg.from;
//          <TimeAgo time={msg.time} />
    return <div className="message-gutter">
      <div className="message">
        <span className="nick">{nick}</span>
        <time datetime={msg.time.toISOString()} className="timestamp">
          {time}
        </time>
      </div>
    </div>;
  }

  renderMessages() {
    return <div className="messages">
      {this.props.messages.map(m => {
        const cls = classnames({
          'message-container': true,
          'message-type-notice': m.type == 'notice',
        });
        return <div className={cls}>
          {this.renderMessageGutter(m)}
          <p className="message">{m.text}</p>
        </div>;
      })}
    </div>;
  }

  renderMessagePane() {
    return <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">{this.props.channel.get('topic')}</h3>
      </div>
      <div ref="messages" className="panel-body messages-container">
        {this.renderMessages()}
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
      nick: this.props.changeNick,
      join: this.props.joinChannel,
      part: this.props.partChannel
    };

    handlers[cmd] && handlers[cmd].apply(null, args);
    this.props.clearMessage();
  }

  render() {
    return <div className="chat">
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
    return UserActions.changeNick(nick);
  },

  joinChannel(channel) {
    return ChannelActions.join(channel);
  },

  partChannel(channel) {
    return ChannelActions.part(channel);
  }
};

const Chat = connect(state => {
  const channel = state.getIn(['channels', 'active']);
  let res =  {
    channel,
    nick: state.get('nick'),
    message: state.get('message'),
    messages: state.get('messages')
      .filter(m => {
        if (m.get('type') == 'notice') {
          return true;
        }
        else if (m.get('type') == 'network') {
          return m.get('type') == 'network';
        }
        else if (m.get('type') == 'channel') {
          return m.get('to') == channel.get('name');
        }
      })
      .toJS(),
    names: channel.get('names')
  };
  return res;
}, actionCreators)(ChatBase);

export default Chat;
