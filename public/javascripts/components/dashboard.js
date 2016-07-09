var dashboard = Vue.extend({
  template: `
  <div class="container-fluid">
    <div class="row">
      <left-panel></left-panel>
    </div>
  </div>
  `,
    components: {
    'left-panel': leftPanel
  }
});
