import Twilio from "twilio-chat";
import credentials from './credentials.json';
import TokenProvider from './tokenprovider';

import moment from 'moment'
import store from '../store/index'

let currentUser = null;
let activeRoom = null;
let client = null;
// let session = null;

async function connectUser(userId) {
  const tokenProvider = new TokenProvider(credentials);
  const token = tokenProvider.getToken(userId);

  client = await Twilio.Chat.Client.create(token, { logLevel: 'info' });
  client.on('tokenAboutToExpire', () => {
    const token = tokenProvider.getToken(userId);
    client.updateToken(token);
  });

  currentUser = this.client.user;
  return currentUser;
}


/*

function setMembers() {
    const members = activeRoom.users.map(user => ({
      username: user.id,
      name: user.name,
      presence: user.presence.state
    }));
    store.commit('setUsers', members);
  }

async function connectUser(userId) {
    await Talk.ready;
    currentUser = new Talk.User({
        id: userId,
        name: "me",
    });
    // session = new Talk.Session({
    //     appId: "tOkvsVcZ",//todo: put into .env
    //     me: currentUser
    // });
    return currentUser;
}

async function subscribeToRoom(roomId) {
    store.commit('clearChatRoom');
    activeRoom = await currentUser.subscribeToRoom({
      roomId,
      hooks: {
        onMessage: message => {
          store.commit('addMessage', {
            name: message.sender.name,
            username: message.senderId,
            text: message.text,
            date: moment(message.createdAt).format('h:mm:ss a D-MM-YYYY')
          });
        },
        onPresenceChanged: () => {
          setMembers();
        },
        onUserStartedTyping: user => {
          store.commit('setUserTyping', user.id)
        },
        onUserStoppedTyping: () => {
          store.commit('setUserTyping', null)
        }
      }
    });
    setMembers();
    return activeRoom;
  }
  */

export default {
    connectUser,
    subscribeToRoom
}