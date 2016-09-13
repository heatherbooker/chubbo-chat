import Vue from 'vue';
import Chart from 'chart.js';


export default Vue.extend({
  props: ['question','questionIndex', 'survey', 'className'],
  template: `
    <div v-show="question.revealResponses">
      <canvas
        v-if="['slider', 'options'].indexOf(question.type) >= 0"
        class="cc-responseChart"
        height="300"
        width="300"
      ></canvas>
      <div
        class="cc-responsesPage-response"
        v-for="response in responses"
        track-by="$index"
      >
        {{ response.response }} xy
      </div>
    </div>
  `,
  ready() {
    var chartLabels;
    this.$nextTick(() => {
      console.log(this);
      if (['slider', 'options'].indexOf(this.question.type) >= 0) {
        chartLabels = this.question.options || [this.question.left, this.question.right];
      }
      var ctx = $('.cc-responseChart');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: '# of Votes',
            data: this.question.responses,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              }
            }]
          }
        }
      });
    });
  },
  computed: {
    responses() {
      var responses = [];
      if ('responses' in this.survey) {
        var numOfQuestions = this.survey.questions.length;
        for (var responseKey in this.survey.responses) {
          for (var i = 0; i < numOfQuestions; i ++) {
            if (this.questionIndex === i) {
              console.log(this.survey.responses[responseKey][i]);
              responses.push(this.survey.responses[responseKey][i]);
            }
          }
        }
        console.log(responses);
        return responses;
      }
    }
  }
});
