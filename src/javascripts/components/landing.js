//libraries
import Vue from 'vue';
import '../../libs/bootstrap/css/bootstrap.css'
//services
import makeDots from '../services/floatingDots.js';
//styles
import '../../stylesheets/landing.css'


module.exports = Vue.extend({
  route: {
    activate(transition) {
      window.ChubboChat.services.login.getUserAfterRedirect()
          .then((user) => {
            if (user) {
              transition.redirect('/dashboard/surveys');
            }
            else {
              transition.next();
            }
          });
    }
  },
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
            <div class="cc-orbisAndBtn">
              <img :src="orbisSource" class="orbis"/>
              <div
                class="cc-btnStart"
                v-link="{path: '/dashboard/surveys/$creating_survey'}"
              >
                Create a survey!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      orbisSource: require('../../images/orbis.png')
    };
  }
});
