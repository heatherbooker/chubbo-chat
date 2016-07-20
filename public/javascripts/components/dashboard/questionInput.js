window.ChubboChat.components.questionInput = Vue.extend({
  props: {
    question: {
      twoWay: true
    },
    index: Number,
    maxIndex: Number
  },
  template: `
    <input
      type="text"
      v-model=question
      class="cc-questionInput"
      :id="getsFocus ? 'cc-input-focus' : ''"
      v-on:keyup.enter="dispatchEnterEvent"
    >
    <span
      v-show="!isSoleInput"
      class="cc-deleteQuestionIcon"
      v-on:click="dispatchDeleteEvent"
    >
      x
    </span>
  `,
  computed: {
    isSoleInput: function() {
      if (this.maxIndex === 0) {
        return true;
      }
      return false;
    },
    getsFocus: function() {
      //if it's the newest input box
      if (this.index === this.maxIndex) {
        //unless it's the first
        if (this.index !== 0) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    dispatchEnterEvent: function () {
      //tell parent(survey form) enter key was pressed
      this.$dispatch('enterKeyPressed');
    },
    dispatchDeleteEvent: function() {
      //tell parent(survey form) to delete this question
      this.$dispatch('deleteQuestion', this.index);
    }
  }
});
