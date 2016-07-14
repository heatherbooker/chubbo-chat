var navbar = Vue.extend({
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
            class={{menuIconClass}} 
          />
          <div class={{loginButtonsClass}}>
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
          <p v-link="{path: '/dashboard'}" class={{dashButtonClass}}>
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
    //set user to be based on store, once it has updated
    //(firebase user doesn't update immediately)
    window.setTimeout(function() {
      me.user = me.userInStore.uid;
    }, 1000);
  },
  computed: {
    loginButtonsClass: function() {
      if (this.$route.path === '/') {
        if (this.userInStore.uid) {
          //if home and logged in, will show dashboard btn instead
          return 'cc-loginBtns-hide';
        } else {
          return 'cc-loginBtns-show';
        }
      } else if (this.$route.path === '/dashboard') {
        //if at dash on mobile, will show menuburger instead
        return 'cc-loginBtns-hide-mobile';
      }
    },
    menuIconClass: function() {
      if (this.$route.path === '/dashboard') {
        //if on mobile, show menuburger
        return 'cc-menuIcon-mobile';
      } else {
        return 'cc-menuIcon-hide';
      }
    },
    dashButtonClass: function() {
      if (this.$route.path === '/') {
        if (this.userInStore.uid) {
          //if home and logged in,show dash shortcut
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
  //get state and change state of vuex state store
  vuex: {
    getters: {
      menuStatus: function(state) {return state.leftPanelClass;},
      userInStore: function(state) {return state.userInfo;}
    },
    actions: {
      showMenu: function() {store.dispatch('toggleState', 'cc-leftPanel-mobile-show', 'leftPanelClass');},
      hideMenu: function() {store.dispatch('toggleState', 'cc-leftPanel-mobile-hide', 'leftPanelClass');}
    }
  }
});
