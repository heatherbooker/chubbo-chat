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
      //dispatch event to parent
      this.$dispatch('enterKeyPressed');
    }
  }
});
