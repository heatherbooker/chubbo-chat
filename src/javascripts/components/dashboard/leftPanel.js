//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'
//styles
import '../../../stylesheets/leftPanel.css'

export default Vue.extend({
  template: `
    <div v-bind:class="isLeftPanelVisible ? 'cc-leftPanel-mobile-show' : 'cc-leftPanel-mobile-hide'">
      <img v-bind:src=userPic class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ emailField }} </p>
      <p
        v-link="{path: '/'}"
        v-on:click="handleLogout"
        class="cc-logout-leftPanel"
        v-show="isLoggedIn"
      > logout </p>
      <hr class="cc-leftPanel-seperatingLine">
      <a @click="hideMenu" v-link="'/dashboard/survey'" :class="surveyBtnClass">
        survey
      </a>
      <a
        @click="hideMenu"
        v-link="'/dashboard/responses'"
        :class="responsesBtnClass"
        v-show="isLoggedIn"
      >
        responses
      </a>
    </div>
  `,
  created: function() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.isLoggedIn = true;
      }
    });
  },
  data: function() {
    return {
      isLoggedIn: false
    };
  },
  computed: {
    surveyBtnClass: function() {
      if (this.$route.path === '/dashboard/survey') {
        return 'cc-leftPanel-surveyBtn-selected';
      }
      return 'cc-leftPanel-surveyBtn';
    },
    responsesBtnClass: function() {
      if (this.$route.path === '/dashboard/responses') {
        return 'cc-leftPanel-responsesBtn-selected';
      }
      return 'cc-leftPanel-responsesBtn';
    }
  },
  methods: {
    handleLogout: function() {
      window.ChubboChat.services.login.signOut();
    }
  },
  //vuex(state store) action dispatchers / getter(s) needed by this component
  vuex: {
    actions: {
      hideMenu: function() {store.dispatch('toggleLeftPanel', false);}
    },
    getters: {
      isLeftPanelVisible: function(state) {return state.isLeftPanelVisible;},
      emailField: function(state) {return state.userInfo.email;},
      userPic: function(state) {return state.userInfo.imgSrc}
    }
  }
});
