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
    'rgba(78,193,255, 0.2)',
    'rgba(39, 96, 127, 0.2)',
    'rgba(58, 145, 191, 0.2)',
    'rgba(19, 48, 64, 0.2)',
    'rgba(70, 174, 229, 0.2)'
  ],
  borderColor: [
    'rgba(78,193,255,1)',
    'rgba(39, 96, 127, 1)',
    'rgba(58, 145, 191, 1)',
    'rgba(19, 48, 64, 1)',
    'rgba(70, 174, 229, 1)'
  ],
  borderWidth: 1
};

function countResponses(question) {
  var totals;
  if (question.type === 'options') {
    totals = question.options.map(option => 0);
    question.responses.forEach(response => {
      totals[question.options.indexOf(response)] ++;
    });
  } else {
    totals = [0, 0, 0];
    question.responses.forEach(responseAsString => {
      var response = Number(responseAsString);
      if (response < 40) {
        totals[0] ++;
      } else if (response >= 40 && response <= 60) {
        totals[1] ++;
      } else {
        totals[2] ++;
      }
    });
  }
  return totals.map(total => Math.max(total, 0.03));
}

function createCharts(questions) {
  questions.forEach((question, index) => {
    if (question.type === 'options') {
      createAChart(question, [...question.options]);
    } else if (question.type === 'slider') {
      createAChart(question, [question.left, 'Somewhere in the middle', question.right]);
    }
    function createAChart(question, labels) {
      var ctx = $('#chart' + index);
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
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
