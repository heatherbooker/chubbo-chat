window.ChubboChat.components.conversation = Vue.extend({
  template: `
    <div class="cc-chatPage">
      <div class="cc-chat-content">
        <div class="cc-chat-messages">
          <div class="cc-chatRow-bot">
            <div class="cc-chatBubble-bot">
              ganooblenop
            </div>
          </div>
          <div
            :class="message.sender === 'bot' ? 'cc-chatRow-bot' : 'cc-chatRow'"
            v-for="message in messages"
          >
            <div :class="message.sender === 'bot' ? 'cc-chatBubble-bot' : 'cc-chatBubble-reply'">
              {{message.text}}
            </div>
          </div>
        </div>
        <div class="cc-chat-inputBlock">
          <input
            type="text"
            class="cc-chat-input"
            v-model="chatInput"
            @keyup.enter="handleSubmitMsg"
          >
          <span class="cc-chat-sendBtn" @click="handleSubmitMsg">
            send
          </span>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      chatInput: '',
      messages: []
    };
  },
  ready: function() {
    $('.cc-chat-input').focus();
  },
  methods: {
    handleSubmitMsg: function() {
      this.messages.push({
        text: this.chatInput,
        sender: 'user'
      });
      this.chatInput = '';
    }
  }
 });
