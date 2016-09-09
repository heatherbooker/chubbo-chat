// Libraries
import Vue from 'vue';


export default Vue.extend({
  props: ['min', 'max'],
  template: `
    <div class="cc-rightPanel-edit-row">
      <label class="cc-numInput-label">Minimum</label>
      <input
        type="number"
        :value="min"
        @input="editMin"
        class="cc-editPanel-numInput"
      >
      <span class="cc-numInput-arrow-up" @click="editMin('up')"></span>
      <span class="cc-numInput-arrow-down" @click="editMin('down')"></span>
    </div>
    <div class="cc-rightPanel-edit-row">
      <label class="cc-numInput-label">Maximum</label>
      <input
        type="number"
        :value="max"
        @input="editMax"
        class="cc-editPanel-numInput"
      >
      <span class="cc-numInput-arrow-up" @click="editMax('up')"></span>
      <span class="cc-numInput-arrow-down" @click="editMax('down')"></span>
    </div>
  `,
  methods: {
    editMin(arg) {
      // 'arg' will either be a string (from @click on arrow) or native event (from @input)
      if (arg === 'up') {
        this.min += 1;
      } else if (arg === 'down') {
        this.min -= 1;
      } else {
        this.min = arg.target.value;
      }
      this.$dispatch('edit-slider', 'min', this.min)
    },
    editMax(arg) {
      // 'arg' will either be a string (from @click on arrow) or native event (from @input)
      if (arg === 'up') {
        this.max += 1;
      } else if (arg === 'down') {
        this.max -= 1;
      } else {
        this.max = arg.target.value;
      }
      this.$dispatch('edit-slider', 'max', this.max)
    }
  }
});
