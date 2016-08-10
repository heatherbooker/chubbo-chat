//libraries
import Vue from 'vue'
import VueRouter from 'vue-router'
//components
import landing from '../components/landing.js';
import surveyForm from '../components/dashboard/surveyForm.js';
import responsesPage from '../components/dashboard/responses.js';
import dashboard from '../components/dashboard/dashboard.js';
import conversation from '../components/conversation/conversation.js';


Vue.use(VueRouter);

var router = new VueRouter();

router.map({
  '/': {
    component: landing
  },
  '/dashboard': {
    component: dashboard,

    subRoutes: {
      '/survey': {
        component: surveyForm
      },
      '/responses': {
        component: responsesPage
      }
    }
  },
  '/surveys': {
    component: conversation,

    subRoutes: {
      '/:userId/:surveyId': {
        component: conversation
      }
    }
  }
});

router.redirect({
  '/dashboard': '/dashboard/survey'
});

module.exports = router;
