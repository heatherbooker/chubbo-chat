import Vue from 'vue';

export default Vue.extend({
  props: ['isLoggedIn'],
  template: `
    <div class="cc-dashboard-tabBar" v-show="isLoggedIn">
      <div :class="surveysClass" v-link="surveysBtnLink">
        <h2 class="cc-dash-tabBar-text">Surveys</h2>
      </div>
      <div :class="responsesClass" v-link="responsesBtnLink">
        <h2 class="cc-dash-tabBar-text">Responses</h2>
      </div>
    </div>
  `,
  computed: {
    surveysClass: function() {
      if (this.$route.path.substring(11, 18) === 'surveys') {
        return 'cc-dash-tabBar-surveys-selected';
      }
      return 'cc-dash-tabBar-surveys';
    },
    responsesClass: function() {
      if (this.$route.path.substring(11, 20) === 'responses') {
        return 'cc-dash-tabBar-responses-selected';
      }
      return 'cc-dash-tabBar-responses';
    },
    surveysBtnLink: function() {
      return "/dashboard/surveys/" + this.$route.params.title;
    },
    responsesBtnLink: function() {
      return "/dashboard/responses/" + this.$route.params.title;
    }
  }
});
