var dashboard = Vue.extend({
  template: `
  <div class="container-fluid">
    <div class="row">
      <left-panel v-show=showProfile ></left-panel>
    </div>
  </div>
  `,
  components: {
    'left-panel': leftPanel
  },
  data: function() {
    var showProfile = true;
    if ($(window).width() <= 400) {
      showProfile = false;
    }
    return {
      showProfile
    };
  }
});
