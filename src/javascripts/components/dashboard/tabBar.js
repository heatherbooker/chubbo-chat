import Vue from 'vue';

export default Vue.extend({
  props: ['isLoggedIn'],
  template: `
    <div class="cc-dashboard-tabBar">
      <div :class="surveysClass" v-link="'/dashboard/survey'">
        <h2 class="cc-dash-tabBar-text">Surveys</h2>
      </div>
      <div :class="responsesClass" v-link="'/dashboard/responses'" v-show="isLoggedIn">
        <h2 class="cc-dash-tabBar-text">Responses</h2>
      </div>
    </div>
  `,
  computed: {
    surveysClass: function() {
      if (this.$route.path === '/dashboard/survey') {
        return 'cc-dash-tabBar-surveys-selected';
      }
      return 'cc-dash-tabBar-surveys';
    },
    responsesClass: function() {
      if (this.$route.path === '/dashboard/responses') {
        return 'cc-dash-tabBar-responses-selected';
      }
      return 'cc-dash-tabBar-responses';
    }
  }
});
