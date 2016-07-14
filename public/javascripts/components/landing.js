var landing = Vue.extend({
  ready: function() {
    //animate background canvas
    makeDots();
  },
  template: `
    <div>
      <canvas id="cc-dotsBackground"></canvas>
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <h2 class="cc-tagline">Create free surveys that feel like chats</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12">
            <div class="cc-orbisAndBtn"><img src="/images/orbis.png" class="orbis"/>
              <div class="cc-btnStart">Create a survey!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});
