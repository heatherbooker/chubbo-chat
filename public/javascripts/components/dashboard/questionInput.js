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
      class="cc-deleteQuestionIcon"
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
  }
});
