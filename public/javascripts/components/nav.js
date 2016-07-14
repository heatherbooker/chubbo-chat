var navbar = Vue.extend({
  props: ['route'],
  template: `
    <div class="container-fluid">
      <div class="row cc-navbar">
        <div class="col-xs-8">
          <h1 v-link="{path: '/'}" class="cc-logo">Chubbo-Chat</h1>
        </div>
        <div class="col-xs-4">
          <img
            v-on:click='handleMenu'
            src="/images/hamburger.svg"
            class="cc-menuIcon"
            id={{menuIconId}} 
          />
          <div id={{loginButtonsId}}>
            <p
              v-show="!user"
              v-on:click='handleLogin'
              class="cc-loginBtn"
            >
              login
            </p>
            <p
              v-else
              v-on:click='handleLogout'
              class="cc-logoutBtn"
            >
              logout
            </p>
          </div>
          <p v-link="{path: '/dashboard'}" id={{dashButtonId}}>
            dashboard
          </p>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      user: firebase.auth().currentUser
    };
  },
  ready: function() {
    var me = this;
    //set user to be based on store
    window.setTimeout(function() {
      me.user = me.userInStore.uid;
    }, 1000);
  },
  computed: {
    loginButtonsId: function() {
      if (this.$route.path === '/') {
        if (this.userInStore.uid) {
          return 'cc-loginBtns-hide';
        } else {
          return 'cc-loginBtns-show';
        }
      } else if (this.$route.path === '/dashboard') {
        return 'cc-loginBtns-hide-mobile';
      }
    },
    menuIconId: function() {
      if (this.$route.path === '/dashboard') {
        return 'cc-menuIcon-mobile';
      } else {
        return '';
      }
    },
    dashButtonId: function() {
      if (this.$route.path === '/') {
        if (this.userInStore.uid) {
          return 'cc-dashButton';
        } else {
          return 'cc-dashButton-hide';
        }
      } else {
        return 'cc-dashButton-hide';
      }
    }
  },
  methods: {
    handleLogin: function() {
      var me = this;
      window.login.signIn().then(function() {
        me.$router.go('/dashboard');
        $('.cc-loginBtn').hide();
        $('.cc-logoutBtn').show();
      });
    },
    handleLogout: function() {
      var me = this;
      window.login.signOut().then(function() {
        me.$router.go('/')
        $('.cc-logoutBtn').hide();
        $('.cc-loginBtn').show();
      });
    },
    handleMenu: function() {
      if (this.menuStatus === 'cc-leftPanel-mobile-hide') {
        this.showMenu();
      } else {
        this.hideMenu();
      }
    }
  },
  vuex: {
    getters: {
      menuStatus: function(state) {return state.leftPanelClass;},
      menuIconStatus: function(state) {return state.seeMenuIcon;},
      userInStore: function(state) {return state.userInfo;}
    },
    actions: {
      showMenu: function() {store.dispatch('toggleState', 'cc-leftPanel-mobile-show', 'leftPanelClass');},
      hideMenu: function() {store.dispatch('toggleState', 'cc-leftPanel-mobile-hide', 'leftPanelClass');}
    }
  }
});
