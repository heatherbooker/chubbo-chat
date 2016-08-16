//libraries
import Vue from 'vue';
import '../../libs/bootstrap/css/bootstrap.css'
//vuex shared state store
import store from '../store.js'


export default Vue.extend({
  template: `
    <div class="container-fluid">
      <div class="row cc-navbar">
        <div class="col-xs-8">
          <h1 v-link="{path: '/'}" class="cc-logo">Chubbo-Chat</h1>
        </div>
        <div class="col-xs-4" v-if="!onSimpleNav">
          <div v-show="onDashboard">
            <img
              v-on:click='handleMenu'
              :src="menuIconSource"
              class="cc-menuIcon-mobile"
              :class="isMenuVisible ? 'cc-menuIcon-clicked' : ''"
            />
            <p
              //only real users have uid
              v-show="!user.uid"
              v-on:click='handleLogin'
              class="cc-loginBtn"
            >
              login
            </p>
            <p
              v-else
              v-link="{path: '/'}"
              v-on:click='handleLogout'
              class="cc-logoutBtn"
            >
              logout
            </p>
          </div>
          <div v-else>
            <p
              //only real users have uid
              v-show="!user.uid"
              v-on:click='handleLogin'
              class="cc-loginBtn"
            >
              login
            </p>
            <p
              v-else
              v-link="{path: '/dashboard'}"
              class="cc-dashboardShortcut"
            >
              dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      menuIconSource: require('../../images/hamburger.svg')
    };
  },
  computed: {
    onDashboard: function() {
      //dashboard: show menu icon or logout btn (based on css media queries)
      //landing: show dashboard shortcut or login btn (based on user login status)
      return (this.$route.path.substring(0, 10) === '/dashboard');
    },
    onSimpleNav: function() {
      // Conversation page: login option is not available, therefore no need to show login button.
      return (this.$route.path.substring(0, 8) === '/surveys');
    }
  },
  methods: {
    handleLogin: function() {
      if (this.onDashboard) {
        // Survey Form component is listening to this event
        document.dispatchEvent(new Event('cc-saveSurveyState'));
      }
      window.ChubboChat.services.login.signIn();
      var me = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          if (!this.onDashboard) {
            me.$router.go('/dashboard');
          }
          // if (window.sessionStorage.getItem('cc-userSurvey')) {
          //   // Dashboard component is listening to this event
          //   document.dispatchEvent(new Event('cc-refreshDash'));
          // }
        }
      })
    },
    handleLogout: function() {
      window.ChubboChat.services.login.signOut();
      // Clean up so that if there was a local survey, it is not
      // found erroneously next time page is loaded or when user clicks 'Publish'.
      window.sessionStorage.removeItem('cc-userSurvey');
    },
    handleMenu: function() {
      //show or hide menu on menu icon click
      if (this.isMenuVisible === false) {
        this.showMenu();
      } else {
        this.hideMenu();
      }
    }
  },
  //vuex(state store) getter(s) and action dispatchers needed by this component
  vuex: {
    getters: {
      isMenuVisible: function(state) {return state.isLeftPanelVisible;},
      user: function(state) {return state.userInfo;}
    },
    actions: {
      showMenu: function() {store.dispatch('toggleLeftPanel', true);},
      hideMenu: function() {store.dispatch('toggleLeftPanel', false);}
    }
  }
});
