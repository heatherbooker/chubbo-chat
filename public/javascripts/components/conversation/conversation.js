import Vue from 'vue'

import store from '../../store.js'

import surveyApi from '../../services/surveyApi.js'
//components
import messageBubble from './messageBubble.js'
//styles
import '../../../stylesheets/chat.css'

Vue.directive('sticky-scroll', {
  bind: function() {

    //use browser MutationObserver object
    var observer = new MutationObserver(scrollToBottom);
    //looking for new children that will change the height
    var config = { childList: true };
    observer.observe(this.el, config);

    //need reference to this, otherwise 'this'=MutationObserver
    var me = this;

    function animateScroll(duration) {

      var start = me.el.scrollTop;
      var end = me.el.scrollHeight;
      var change = end - start;
      var increment = 20;

      function easeInOut(currentTime, start, change, duration) {
        //by Robert Penner
        currentTime /= duration / 2;
        if (currentTime < 1) {
          return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
      }

      function animate(elapsedTime) {
        elapsedTime += increment;
        var position = easeInOut(elapsedTime, start, change, duration);
        me.el.scrollTop = position;
        if (elapsedTime < duration) {
          setTimeout(function() {
            animate(elapsedTime);
          }, increment)
        }
      }
      animate(0);
    }

    function scrollToBottom() {
      if (me.arg === 'animate') {
        //default is 300
        var duration = Number(me.expression) || 300;
        animateScroll(duration);
      } else {
        //default is jump to bottom
        me.el.scrollTop = me.el.scrollHeight;
      }
    }
  }
});

export default Vue.extend({
  template: `
    <div class="cc-chatPage">
      <div class="cc-chat-content">
        <div class="cc-chat-messages" v-sticky-scroll>
          <message-bubble
            v-for="message in messages"
            :message="message"
          >
          </message-bubble>
        </div>
        <div class="cc-chat-inputBlock">
          <input
            type="text"
            class="cc-chat-input"
            v-model="chatInput"
            @keyup.enter="handleSubmitMsg"
          >
          <span :class="sendBtnClass" @click="handleSubmitMsg">
            send
          </span>
        </div>
      </div>
    </div>
  `,
  components: {
    'message-bubble': messageBubble
  },
  data: function() {
    return {
      chatInput: '',
      messages: [],
      surveyInfo: {
        userId: this.$route.params.userId,
        surveyId: this.$route.params.surveyId
      },
      surveyQuestions: [],
      surveyResponses: [],
      botMessages: {
        hello: 'Hi there!',
        goodbye: `Thanks for taking the survey! Visit
          chubbo-chat.herokuapp.com/#!/dashboard to create your own survey!`
      },
      isSurveyComplete: false
    };
  },
  computed: {
    sendBtnClass: function() {
      if (this.chatInput === '') {
        return 'cc-chat-sendBtn-disabled';
      }
      return 'cc-chat-sendBtn';
    }
  },
  ready: function() {
    $('.cc-chat-input').focus();
    var me = this;
    //get survey from database and send first message!
    this.setUpSurvey().then(function() {
      me.sendSurveyQuestion(me);
    });
  },
  methods: {
    setUpSurvey: function() {
      var me = this;
      return surveyApi.getSpecificSurvey(me.surveyInfo.userId, me.surveyInfo.surveyId)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        me.surveyQuestions = data.questions.map(function(question) {
          return {
            text: question,
            sender: 'bot'
          };
        });
      });
    },
    handleSubmitMsg: function() {
      if (this.chatInput !== '') {
        this.messages.push({
          text: this.chatInput,
          sender: 'user'
        });
        this.surveyResponses.push(`{"text": "${this.chatInput}"}`);
        this.chatInput = '';
        //send responses to databse if survey is done
        if (this.surveyQuestions.length === 0) {
          if (!this.isSurveyComplete) {
            this.sendToDatabase();
          }
        }
        this.sendSurveyQuestion(this);
      }
    },
    sendSurveyQuestion: function(me) {
      if (me.messages.length <= 1) {
        //first message!
        me.messages.push({
          text: me.botMessages.hello,
          sender: 'bot'
        });
      } else if (me.surveyQuestions.length === 0) {
        if (!me.isSurveyComplete) {
          //say bye
          me.messages.push({
            text: me.botMessages.goodbye,
            sender: 'bot'
          });
        }
        me.isSurveyComplete = true;
      } else {
        //send a survey question
        me.messages.push(me.surveyQuestions[0]);
        me.surveyQuestions.splice(0, 1);
      }
    },
    sendToDatabase: function() {
      surveyApi.sendSurveyResponses(
        this.surveyInfo.userId, this.surveyInfo.surveyId, `[${this.surveyResponses}]`
      );
    }
  }
 });
