var dashboard = Vue.extend({
  template: `
  <div class="container-fluid">
    <div class="row">
    hello world, this is <strong>dashboard</strong>
    <left-panel></left-panel>
    </div>
  </div>
  `,
    components: {
    'left-panel': leftPanel
  }
});
