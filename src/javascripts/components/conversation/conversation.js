//libraries
import Vue from 'vue'
//services
import surveyApi from '../../services/surveyApi.js'
import 'vue-sticky-scroll'
//components
import messageBubble from './messageBubble.js'
//styles
import '../../../stylesheets/chat.css'


export default Vue.extend({
  template: `
    <div class="cc-chatPage">
      <div class="cc-chat-content">
        <div class="cc-chat-messages" v-sticky-scroll>
          <message-bubble
            v-for="(index, message) in messages"
            v-if="!message.noShow"
            :message="message"
            :index="Math.ceil(index / 2 - 1)"
            :can-click-hi-btn="isSurveyStarted ? false : true"
            @button-clicked="handleBtnClick"
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
          <span
            :class="chatInput === '' ? 'cc-chat-sendBtn-disabled' : 'cc-chat-sendBtn'"
            @click="handleSubmitMsg"
          >
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
        hello: `Hi there! I'm Chubbo, your favourite friendly survey administrator! Are you
                ready to begin the survey?`,
        confirm: `That's all for now! I'm going to send this to my master, ok?`,
        goodbye: `Thanks for chatting with me today! Visit
          chubbo-chat.herokuapp.com/#!/dashboard to create your own friendly survey!`
      },
      isSurveyStarted: false,
      isSurveyComplete: false,
      isSurveySent: false
    };
  },
  ready: function() {
    $('.cc-chat-input').focus();
    //get survey from database and send first message!
    this.setUpSurvey().then(() => {
      this.sendSurveyQuestion();
    });
  },
  methods: {
    setUpSurvey: function() {
      return surveyApi.getSpecificSurvey(this.surveyInfo.userId, this.surveyInfo.surveyId)
      .then((data) => {
        this.surveyQuestions = data.questions.map(question => ({
          ...question,
          sender: 'bot'
        }));
      });
    },
    handleSubmitMsg: function() {
      if (this.chatInput !== '') {
        if (!this.isSurveyStarted) {
          this.isSurveyStarted = true;
          this.sendSurveyQuestion();
          this.chatInput = '';
        } else {
          this.messages.push({
            text: this.chatInput,
            type: 'text',
            sender: 'user'
          });
          this.handleUserResponse(this.chatInput.trim());
          this.chatInput = '';
        }
      }
    },
    handleUserResponse(response) {
      var responseObject;
      if (typeof response === 'object') {
        responseObject = response;
      } else {
        responseObject = `{"type": "text", "response": "${response}"}`;
      }
      this.surveyResponses.push(responseObject);
      this.sendSurveyQuestion();
    },
    sendSurveyQuestion: function() {
      if (!this.isSurveyStarted) {
        //first message!
        this.messages.push({
          text: this.botMessages.hello,
          type: 'buttons',
          buttons: ['Ready!'],
          sender: 'bot'
        });
      } else if (this.surveyQuestions.length === 0) {
        if (!this.isSurveyComplete) {
          //say bye
          this.messages.push({
            text: this.botMessages.confirm,
            type: 'buttons',
            buttons: ['Sure!'],
            sender: 'bot'
          });
        }
        this.isSurveyComplete = true;
      } else {
        //send a survey question
        this.messages.push(this.surveyQuestions[0]);
        if (['slider', 'options'].indexOf(this.surveyQuestions[0].type) > -1) {
          this.attachChangeListener();
        }
        this.surveyQuestions.splice(0, 1);
      }
    },
    attachChangeListener() {
      this.$nextTick(() => {
        var me = this;
        $('input[type="range"], input[type="radio"]').change(function() {
          var className = $(this).attr('class');
          // Last character of class is its index in the array of survey questions.
          var index = className.substring(className.length - 1);
          // Divide by 2 to account for user messages.
          // Subtract 1 to account for initial greeting.
          if (index == Math.ceil((me.messages.length - 1) / 2 - 1)) {
            me.messages.push({noShow: true});
            me.handleUserResponse({});
          }
        });
      });
    },
    gatherResponses() {
      var responses = [...this.surveyResponses];
      $('input[type="range"], input[type="radio"]:checked').each(function(i, inputElement) {
        var className = $(this).attr('class');
        var index = className.substring(className.length - 1);
        responses[index] = JSON.stringify({
          type: $(this).attr("type"),
          response: $(this).val()
        });
      });
      return responses;
    },
    sendToDatabase: function(responses) {
      surveyApi.sendSurveyResponses(
        this.surveyInfo.userId, this.surveyInfo.surveyId, `[${responses}]`
      );
    },
    handleBtnClick(buttonText) {
      if (buttonText === 'Ready!') {
        if (!this.isSurveyStarted) {
          this.isSurveyStarted = true;
          this.sendSurveyQuestion();
        }
      } else if (!this.isSurveySent) {
        this.sendToDatabase(this.gatherResponses());
        // Invite the user to make their own survey.
        this.messages.push({
          text: this.botMessages.goodbye,
          type: 'text',
          sender: 'bot'
        });
        this.isSurveySent = true;
      }
    }
  }
 });
