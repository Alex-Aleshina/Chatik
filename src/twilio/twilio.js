import Client from "twilio-chat/dist/twilio-chat";
import credentials from './credentials.json';
import TokenProvider from './tokenprovider';

import moment from 'moment'
import store from '../store/index'

const MESSAGE_LIMIT = 30;

let currentUser = null;
let activeRoom = null;
let client = null;
let channels = null;
// let session = null;

async function connectUser(userId) {
  const tokenProvider = new TokenProvider(credentials);
  const token = tokenProvider.getToken(userId);

  client = await Client.create(token, { logLevel: 'info' });
  client.on('tokenAboutToExpire', () => {
    const token = tokenProvider.getToken(userId);
    client.updateToken(token);
    
      
  });


  channels = (await client.getSubscribedChannels()).items;

  currentUser = {
    ...client.user,
    rooms: channels
  };

  return currentUser;
}

async function setMembers() {
  const members = await activeRoom.getMembers();

  const users = [];
  for (const m of members) {
    const user = await m.getUser();

    
    users.push({
      username: m.identity,
      name: m.identity,
      presence: user.online ? 'online' : 'offline'
    });
  }

  store.commit('setUsers', users);
}

async function subscribeToRoom(roomId) {
  store.commit('clearChatRoom');

  const channel = channels.find(c => c.sid === roomId);
  if (channel) {
    if (activeRoom) {
      activeRoom.removeAllListeners();
    }

    activeRoom = channel;

    const addMessage = (message) => {
      store.commit('addMessage', {
        name: message.author,
        username: message.memberSid,
        text: message.body,
        date: moment(message.timestamp).format('h:mm a D-MM-YYYY')
      });


    }

    const messages = await activeRoom.getMessages(MESSAGE_LIMIT);
    messages.items.map(m => addMessage(m));
    activeRoom.on('messageAdded', addMessage);

    activeRoom.on('memberJoined', setMembers);
    activeRoom.on('memberLeft', setMembers);
    activeRoom.on('memberUpdated', setMembers);

    activeRoom.on('typingStarted', function (member) {
      member.getUser().then(user => {
        store.commit('setUserTyping', user.identity)
      });
    });

    activeRoom.on('typingEnded', function (member) {
      member.getUser().then(() => {
        store.commit('setUserTyping', null)
      });
    });
  }

  setMembers();
  return {
    id: activeRoom.sid,
    name: activeRoom.friendlyName
  };
}

async function sendMessage(text) {
  const messageId = await activeRoom.sendMessage(text);
  return messageId;
}

export async function isTyping() {
  await activeRoom.typing();
}

function disconnectUser() {
  client.shutdown();
}

export default {
  connectUser,
  subscribeToRoom,
  sendMessage,
  disconnectUser
}