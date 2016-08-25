import Vue from 'vue';

export default Vue.extend({
  template: `
    <div class="cc-dashboard-subNav">
      <div>
        <h2 v-link="surveysBtnLink" class="cc-dashboard-subNav-viewText">Surveys</h2>
        <h2 v-link="responsesBtnLink" class="cc-dashboard-subNav-viewText">Responses</h2>
      </div>
      <div>
        <button class="cc-buttonReset">
          <img :src="testIconSrc" class="cc-dashboard-subNav-icon">
          <h2 class="cc-dashboard-subNav-actionText">Test</h2>
        </button>
        <button class="cc-buttonReset">
          <img :src="publishIconSrc" class="cc-dashboard-subNav-icon">
          <h2 class="cc-dashboard-subNav-actionText">Publish</h2>
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      testIconSrc: require('../../../images/test.svg'),
      publishIconSrc: require('../../../images/star.svg')
    }
  },
  computed: {
    surveysBtnLink: function() {
      return "/dashboard/surveys/" + this.$route.params.surveyId;
    },
    responsesBtnLink: function() {
      return "/dashboard/responses/" + this.$route.params.surveyId;
    }
  }
});
