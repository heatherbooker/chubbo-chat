// Libraries
import Vue from 'vue';
// Vuex state store
import store from '../../store.js';
// Styles
import '../../../stylesheets/rightPanel.css'


export default Vue.extend({
  template: `
    <div class="cc-rightPanel">
      <div class="cc-rightPanel-tabBar">
        <div class="cc-rightPanel-tab-selected">
          <h3 class="cc-rightPanel-tabText">New</h3>
        </div>
        <div class="cc-rightPanel-tab">
          <h3 class="cc-rightPanel-tabText">Edit</h3>
        </div>
      </div>
      <div class="cc-rightPanel-btnsDiv">
        <div class="cc-rightPanel-btnsLeftCol">
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(0)">
            <span class="fa fa-3x fa-pencil cc-rightPanel-btnIcon"></span>
            <h4>Text</h4>
          </button>
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(1)">
            <span class="fa fa-3x fa-check-square-o cc-rightPanel-btnIcon"></span>
            <h4>Options</h4>
          </button>
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(2)">
            <span class="fa fa-3x fa-picture-o cc-rightPanel-btnIcon"></span>
            <h4>Image</h4>
          </button>
        </div>
        <div class="cc-rightPanel-btnsRightCol">
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(3)">
            <span class="fa fa-3x fa-envelope-o cc-rightPanel-btnIcon"></span>
            <h4>Email</h4>
          </button>
          <button class="cc-rightPanel-btn" @click="handleNewQuestionBtn(4)">
            <span class="fa fa-3x fa-sliders cc-rightPanel-btnIcon"></span>
            <h4>Sliders</h4>
          </button>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      questionTypes: ['text', 'options', 'image', 'email', 'sliders']
    }
  },
  methods: {
    handleNewQuestionBtn(questionReferenceNum) {
      console.log(this.questionTypes[questionReferenceNum]);
    }
  }
})
