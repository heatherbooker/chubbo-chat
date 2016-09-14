import Chart from 'chart.js';

const options = {
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        fixedStepSize: 1
      },
      gridLines: {
        drawOnChartArea: false,
        drawTicks: false
      },
      display: false
    }],
    xAxes: [{
      gridLines: {
        drawOnChartArea: false,
        drawTicks: false
      },
      display: false
    }]
  },
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  },
  maintainAspectRatio: false
};

const style = {
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
};

function countResponses(question) {
  var totals = question.options.map(option => 0);
  question.responses.forEach(response => {
    totals[question.options.indexOf(response)] ++;
  });
  return totals;
}

function createCharts(questions) {
  var canvasRefs = [];
  questions.forEach((question, index) => {
    if (question.type === 'options') {
      var ctx = $('#chart' + index);
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: question.options,
          datasets: [{
            data: countResponses(question),
            ...style
          }]
        },
        options
      });
    }
  });
}

module.exports = createCharts;
