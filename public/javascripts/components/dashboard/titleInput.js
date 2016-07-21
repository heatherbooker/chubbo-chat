window.ChubboChat.components.titleInput = Vue.extend({
  props: {
    title: {
      twoWay: true
    },
    styles: Object
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
        v-bind:style="isBlank ? styles : ''"
        v-on:keyup.enter="moveFocusToQuestion"
      >
    </div>
  `,
  data: function() {
    return {
      //shortcut so vuex action dispatchers can access this.store
      store: window.ChubboChat.store
    }
  },
  computed: {
    isBlank: function() {
      if (this.title === '' || typeof this.title === 'undefined') {
        return true;
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
      updateTitleInStore: function() {this.store.dispatch('editTitle', this.title);}
    }
  }
});
