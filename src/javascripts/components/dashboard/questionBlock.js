//libraries
import Vue from 'vue'


export default Vue.extend({
  props: ['question'],
  template: `
    <div class="cc-questionBlock-container">
      <img :src="srcOfDragIcon" class="cc-questionBlock-dragIcon">
      <div class="cc-questionBlock">
        <div class="cc-questionBlock-top">
          {{ question }}
        </div>
        <div class="cc-questionBlock-bottom">
          other stuff will go here
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      srcOfDragIcon: require('../../../images/drag.svg')
    };
  }
});
