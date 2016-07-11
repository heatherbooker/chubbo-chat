var leftPanel = Vue.extend({
  template: `
  <div class="col-sm-3 col-xs-10">
    <div class="cc-leftPanel">
      <img v-bind:src=imgSrc class="cc-userIcon-leftPanel"/>
      <p class="cc-userEmail-leftPanel"> {{ userInfo.email }} </p>
      <p v-show="onMobile"> logout </p>
    </div>
  </div>
  `,
  data: function() {
    var userInfo = firebase.auth().currentUser,
        onMobile = false;
    //default user icon
    var imgSrc = 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png';
    if (userInfo.photoURL) {
      imgSrc = userInfo.photoURL;
    }
    if ($(window).width() <= 400) {
      onMobile = true;
    }
    return {
      userInfo,
      imgSrc,
      onMobile
    };
  },
});
