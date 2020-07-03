<template>
  <div class="message-list">
    <h4>Messages</h4>
    <hr>
    <div id="chat-messages" class="message-group" v-chat-scroll="{smooth: true}">
      <div class="message" v-for="(message, index) in messages" :key="index">
        <div class="clearfix">
          <h4 class="message-title float-right">@{{ message.name }}</h4>
        </div>
        <p class="message-text float-left">
          {{ message.text }}
        </p>
        <div class="clearfix">
          <small class="text-muted float-right">{{ message.date }}</small>
        </div>
      </div>
    </div>
    <div class="user-typing">
      <small class="text-muted" v-if="userTyping">@{{ userTyping }} is typing....</small>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'message-list',
  computed: {
    ...mapState([
      'messages',
      'userTyping'
    ])
  }
}
</script>

<style>
.message-list {
  margin-bottom: 15px;
  padding-right: 15px;
}
.message-group {
  height: 65vh !important;
  overflow-y: scroll;
}
.message {
  border: 2px solid #00acb6;
  background-color:#00b5bf;
  color: #fff;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  margin-right:5px;
}
.message-title {
  font-size: 1rem;
  display:inline;
}
.message-text {
  color: white;
  margin-bottom: 0;
}
.user-typing {
  height: 1rem;
}
</style>