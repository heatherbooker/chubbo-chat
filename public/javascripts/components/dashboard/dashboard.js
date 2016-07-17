window.ChubboChat.components.dashboard = Vue.extend({
  route: {
    //make sure user is logged in
    activate: function(transition) {
      var authStateChecked = false;
      firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
          //dashboard is for logged in users only! go to landing page
          transition.redirect('/');
        } else {
          //without this check, transition.next() is called multiple times
          if (!authStateChecked) {
            //ok, you can continue to view dashboard
            transition.next();
            authStateChecked = true;
          }
        }
      });
    }
  },
  data: function() {
    return {
      //shortcut so vuex action dispatchers can access this.store
      store: window.ChubboChat.store
    };
  },
  created: function() {
    this.hideMenuMobile();
  },
  template: `
    <div class="container-fluid">
      <div class="row">
        <div v-bind:class="isLeftPanelVisible ? 'cc-greyedSurveyForm' : '' ">
        </div>
        <left-panel></left-panel>
        <survey-form></survey-form>
      </div>
    </div>
  `,
  components: {
    'left-panel': window.ChubboChat.components.leftPanel,
    'survey-form': window.ChubboChat.components.surveyForm
  },
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    getters: {
      isLeftPanelVisible: function(state) {return state.isLeftPanelVisible;}
    },
    actions: {
      hideMenuMobile: function() {this.store.dispatch('toggleLeftPanel', false, 'isLeftPanelVisible');}
    }
  }
});
