//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'


export default Vue.extend({
  props: {
    question: {
      twoWay: true
    },
    index: Number,
    maxIndex: Number
  },
  ready: function() {
    var me = this;
    $('#questionInput-id-' + me.index).blur(function() {
      me.updateQuestionInStore();
    });
  },
  template: `
    <input
      type="text"
      v-model=question
      :class="['cc-questionInput', getsFocus ? 'cc-input-focus' : '']"
      :id="inputId"
      v-on:keyup.enter="dispatchEnterEvent"
    >
    <span
      :class="isSoleAndEmptyInput ? 'cc-deleteQuestionIcon-hide' : 'cc-deleteQuestionIcon'"
      v-on:click="handleDeleteClick"
    >
      x
    </span>
  `,
  computed: {
    getsFocus: function() {
      //if it's the newest input box
      if (this.index === this.maxIndex) {
        //unless it's the first
        if (this.index !== 0) {
          return true;
        }
      }
      return false;
    },
    isSoleAndEmptyInput: function() {
      if (this.maxIndex === 0 && (this.question === '' || typeof this.question === 'undefined')) {
        return true;
      }
      return false;
    },
    inputId: function() {
      return 'questionInput-id-' + this.index
    }
  },
  methods: {
    dispatchEnterEvent: function () {
      //tell parent(survey form) enter key was pressed
      this.$dispatch('enterKeyPressed');
    },
    handleDeleteClick: function() {
      //if it's the only question input
      if (this.maxIndex === 0) {
        //then clear it
        this.question = '';
      } else {
        //tell parent(survey form) to delete this question
        this.$dispatch('deleteQuestion', this.index);
      }
    }
  },
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    actions: {
      updateQuestionInStore: function() {store.dispatch('EDIT_QUESTION', this.index, this.question);}
    }
  }
});
