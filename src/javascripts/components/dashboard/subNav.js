import Vue from 'vue';
import surveyService from '../../services/surveyService';


export default Vue.extend({
  template: `
    <div class="cc-dashboard-subNav">
      <div>
        <h2 v-link="surveysBtnLink" class="cc-dashboard-subNav-viewText">Surveys</h2>
        <h2
          v-if="user"
          v-link="responsesBtnLink"
          class="cc-dashboard-subNav-viewText"
        >Responses</h2>
      </div>
      <div>
        <button class="cc-buttonReset">
          <img :src="testIconSrc" class="cc-dashboard-subNav-icon">
          <h2 class="cc-dashboard-subNav-actionText">Test</h2>
        </button>
        <button class="cc-buttonReset" :class="classOfPublishBtn" @click="handlePublishBtn">
          <img :src="srcOfPublishIcon" class="cc-dashboard-subNav-icon">
          <h2 class="cc-dashboard-subNav-actionText">Publish</h2>
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      testIconSrc: require('../../../images/test.svg'),
      publishIconNormalSrc: require('../../../images/star.svg'),
      publishIconDisabledSrc: require('../../../images/star-disabled.svg'),
    }
  },
  computed: {
    surveysBtnLink: function() {
      return "/dashboard/surveys/" + this.$route.params.surveyId;
    },
    responsesBtnLink: function() {
      return "/dashboard/responses/" + this.$route.params.surveyId;
    },
    classOfPublishBtn() {
      if (this.survey.isPublished) {
        return 'cc-dashboard-subNav-btnDisabled';
      }
      return '';
    },
    srcOfPublishIcon() {
      if (this.survey.isPublished) {
        return this.publishIconDisabledSrc;
      }
      return this.publishIconNormalSrc;
    }
  },
  methods: {
    handlePublishBtn() {
      if (this.survey.title.length > 0) {
        if (this.user) {
          surveyService.handlePublishing(this.user, this.survey.title, this.survey.questions)
              .then((surveyInfo) => {
                this.$router.go(`/dashboard/surveys/${surveyInfo.id}`);
                this.alertUserSurveyPublished(surveyInfo.url);
                this.setSurveyToPublished(surveyInfo.id, surveyInfo.timestamp);
              });
        } else {
          this.handleUserNotLoggedIn(this.title, this.questions);
        }
      } else {
        $('.cc-titleInput').focus();
        // scroll up to title input and make it stand out
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.setTitleError(true);
      }
    },
    handleUserNotLoggedIn(title, questions) {
      swal({
        type: 'warning',
        title: 'Please log in to save your survey!',
        showCancelButton: true
      }).then(() => {
        // Users are redirected to login, so we need to save their survey first.
        // Last arg is true to indicate this survey should be published.
        surveyService.setLocalSurvey(title, questions, true);
        window.ChubboChat.services.login.signIn();
      });
    },
    alertUserSurveyPublished: function(surveyUrl) {
      swal({
        type: 'success',
        title: 'Survey successfully published',
        html: `People can take your survey at:<br><span class="cc-copyBtn">copy</span>`,
        input: 'text',
        inputValue: surveyUrl
      });
      this.makeInputTextCopyable();
    },
    makeInputTextCopyable: function() {
      var isTextSelected = false;
      // select and unselect all input text on click
      $('.swal2-input').click(function() {
        if (isTextSelected) {
          isTextSelected = false;
        } else {
          $(this).select();
          isTextSelected = true;
        }
      });
      // copy input text to users clipboard
      $('.cc-copyBtn').click(function() {
        $('.swal2-input').select();
        document.execCommand('copy');
      });
    }
  },
  // Vuex(state store) getters / action dispatchers needed by this component
  vuex: {
    getters: {
      user(state) {return state.user;},
      title(state) {return state.selectedSurvey.title;},
      questions(state) {return state.selectedSurvey.questions;},
      survey(state) {return state.selectedSurvey;}
    },
    actions: {
      setTitleError(store, hasError) {store.dispatch('SET_TITLE_ERROR', true)},
      setSurveyToPublished: function(store, surveyId, timestamp) {
        store.dispatch('PUBLISH_SURVEY', surveyId, timestamp);
      }
    }
  }
});
