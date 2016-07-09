var leftPanel = Vue.extend({
  template: `
  <div class="col-sm-3">
    <div class="cc-leftPanel">
      <img v-bind:src=imgSrc class="cc-userIcon"/>
      <p class="cc-userEmail"> {{ userInfo.email }} </p>
    </div>
  </div>
  `,
  data: function() {
    var userInfo = firebase.auth().currentUser;
    //default user icon
    var imgSrc = 'images/orbis.png';
    if (userInfo.photoURL) {
      imgSrc = userInfo.photoURL;
    }
    return {
      userInfo: userInfo,
      imgSrc: imgSrc
    };
  },
});
