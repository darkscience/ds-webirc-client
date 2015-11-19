import { connect } from 'react-redux';
import classnames from 'classnames';
import _ from 'lodash';
import React from 'react';
import Chat from './Chat';

class AppBase extends React.Component {
  constructor() {
    super();
  }

  renderChannelList() {
    if (this.props.channels.size > 0) {
      const channelListItems = this.props.channels.map(chan => {
        const cls = classnames({
          'list-group-item': true,
          'active': chan == this.props.activeChannel
        });
        const name = chan.get('name');
        return <a href="" key={name} className={cls}>{name}</a>;
      });
      return <div className="list-group">
        {channelListItems}
      </div>;
    }
    else {
      return <div className="panel-body">
        <p className="help-block">You're haven't joined any channels.</p>
      </div>;
    }
  }

  render() {
    return <div className="row">
      <div className="col-sm-2">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Channels</h3>
          </div>
          {this.renderChannelList()}
        </div>
      </div>

      <div className="col-sm-10">
        <Chat></Chat>
      </div>
    </div>;
  }
}

const App = connect(state => {
  return {
    activeChannel: state.getIn(['channels', 'active']),
    channels: state.getIn(['channels', 'joined'])
  };
}, state => {
  return {};
})(AppBase);

export default App;
