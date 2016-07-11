var leftPanel = Vue.extend({
  template: `
  <div class="col-sm-3 col-xs-10">
    <div class="cc-leftPanel">
      <img v-bind:src=imgSrc class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ userInfo.email }} </p>
    </div>
  </div>
  `,
  data: function() {
    var userInfo = firebase.auth().currentUser;
    //default user icon
    var imgSrc = 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png';
    if (userInfo.photoURL) {
      imgSrc = userInfo.photoURL;
    }
    return {
      userInfo,
      imgSrc
    };
  },
});
