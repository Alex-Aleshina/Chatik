import twilio from '../twilio/twilio';

// Helper function for displaying error messages
function handleError(commit, error) {
  const message = error.message || error.info.error_description;
  commit('setError', message);
}

export default {
  async login({ commit, state }, userId) {
    try {
      commit('setError', '');
      commit('setLoading', true);
      // Connect user to Twilio service
      const currentUser = await twilio.connectUser(userId);
      commit('setUser', {
        username: currentUser.state.identity,
        name: currentUser.name
      });

      const rooms = currentUser.rooms.map(r => ({
        id: r.sid,
        name: r.friendlyName
      }));
      commit('setRooms', rooms);

      // Subscribe user to a room
      const activeRoom = state.activeRoom || rooms[0];
      commit('setActiveRoom', {
        id: activeRoom.id,
        name: activeRoom.name
      });
      await twilio.subscribeToRoom(activeRoom.id);

      commit('setReconnect', false);

      // Test state.user
      console.log(state.user);

      return true;
    } catch (error) {
      handleError(commit, error)
      return false;
    } finally {
      commit('setLoading', false);
    }
  },

  async changeRoom({ commit }, roomId) {
    try {
      const { id, name } = await twilio.subscribeToRoom(roomId);
      commit('setActiveRoom', { id, name });
    } catch (error) {
      handleError(commit, error)
    }
  },

  async sendMessage({ commit }, message) {
    try {
      commit('setError', '');
      commit('setSending', true);
      const messageId = await twilio.sendMessage(message);
      return messageId;
    } catch (error) {
      handleError(commit, error)
    } finally {
      commit('setSending', false);
    }
  },

  async logout({ commit }) {
    commit('reset');
    twilio.disconnectUser();
    window.localStorage.clear();
  }
}