//libraries
import Vue from 'vue'
//vuex shared state store
import store from '../../store.js'


export default Vue.extend({
  props: {
    title: {
      twoWay: true
    },
    errorStatus: Boolean
  },
  ready: function() {
    var me = this;
    $('.cc-titleInput').blur(function() {
      me.updateTitleInStore();
    });
  }, 
  template: `
    <div class="cc-titleInputRow">
      <input
        type="text"
        v-model="title"
        class="cc-titleInput"
        placeholder="Title..."
        v-bind:class="hasErrorClass ? 'cc-titleInput-error' : ''"
        v-on:keyup.enter="moveFocusToQuestion"
      >
    </div>
  `,
  computed: {
    hasErrorClass: function() {
      if (this.errorStatus) {
        if (this.title === '' || typeof this.title === 'undefined') {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    moveFocusToQuestion: function() {
      $('#questionInput-id-0').focus();
    }
  },
  //vuex(state store) getters / action dispatcher(s) needed by this component
  vuex: {
    actions: {
      updateTitleInStore: function() {store.dispatch('EDIT_TITLE', this.title);}
    }
  }
});
