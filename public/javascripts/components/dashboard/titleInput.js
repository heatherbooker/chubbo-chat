window.ChubboChat.components.titleInput = Vue.extend({
  props: {
    title: {
      twoWay: true
    },
    styles: Object
  },
  ready: function() {
    var me = this;
    $('.cc-titleInput').focus(function() {
      me.hasFocus = true;
    });
    $('.cc-titleInput').blur(function() {
      me.hasFocus = false;
    });
  }, 
  template: `
    <div class="cc-titleInputRow">
      <input
        type="text"
        v-model="title"
        class="cc-titleInput"
        placeholder="Title..."
        :style="styles"
      >
      <div class="cc-invalidInfo">
        <span v-show="isInvalid" class="cc-invalidInputIcon">
          *
        </span>
        <span class="cc-invalidInfoTooltip">
          please add a title
        </span>
      </div>
    </div>
  `,
  data: function() {
    return {
      hasFocus: true
    }
  },
  computed: {
    isInvalid: function() {
      if (!this.hasFocus) {
        if (this.title === '') {
          return true;
        } else if (typeof this.title === 'undefined') {
          return true;
        }
      }
      return false;
    }
  }
});
