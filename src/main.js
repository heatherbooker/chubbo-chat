//libraries
import Vue from 'vue';
import Vuex from 'vuex'
//views
import './views/index.pug';
//setup
import store from './javascripts/store.js';
import router from './javascripts/services/router.js';
//services
import Login from './javascripts/services/login.js';
//components
import navbar from './javascripts/components/nav.js';
//styles
import './stylesheets/base.css'


var mainComponent = Vue.extend({
  created: function() {
    var me = this;
    //start instance of app to connect to firebase
    //pass callback to login constructor to update store when authorization state changes
    window.ChubboChat = {services: {}};
    window.ChubboChat.services.login = new Login(function(user) {me.updateUser(user);});
  },
  template: `
    <div>
      <nav-bar></nav-bar>
      <router-view></router-view>
    </div>
  `,
  components: {
    'nav-bar': navbar
  },
  //vuex state store
  store,
  //vuex action dispatcher(s) needed by this component
  vuex: {
    actions: {
      updateUser: function(state, user) {store.dispatch('setUser', user);}
    }
  }
});

router.start(mainComponent, '#chubbo-chat');
