import { bindActionCreators } from 'redux';

const Users = {
  changeNick(newNick) {
    return {
      type: 'users:changeNick',
      newNick
    };
  },

  nickChanged(oldNick, newNick) {
    return {
      type: 'users:nickChanged',
      oldNick, newNick
    };
  },

  bindDispatch(dispatch) {
    return bindActionCreators(Users, dispatch);
  }
}

export default Users;
