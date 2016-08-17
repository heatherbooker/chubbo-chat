import Vue from 'vue';

export default Vue.extend({
  template: `
    <div class="cc-dashboard-tabBar">
      <div class="cc-dashboard-tab" v-link="surveysBtnLink">
        <h2 class="cc-dashboard-tabText">Surveys</h2>
      </div>
      <div class="cc-dashboard-tab" v-link="responsesBtnLink">
        <h2 class="cc-dashboard-tabText">Responses</h2>
      </div>
    </div>
  `,
  computed: {
    surveysBtnLink: function() {
      return "/dashboard/surveys/" + this.$route.params.title;
    },
    responsesBtnLink: function() {
      return "/dashboard/responses/" + this.$route.params.title;
    }
  }
});
