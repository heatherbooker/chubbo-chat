import Chart from 'chart.js';

Chart.defaults.global.defaultFontFamily = "'Quicksand', sans-serif";
Chart.defaults.global.defaultFontColor = "#3c5a71";

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
      }
    }],
    xAxes: [{
      gridLines: {
        drawOnChartArea: false,
        drawTicks: false
      }
    }]
  },
  legend: {
    display: false
  },
  maintainAspectRatio: false
};

const smallChartOptions = $.extend(true, {
  tooltips: {
    enabled: false
  }
}, options);

smallChartOptions.scales.xAxes[0].display = false;
smallChartOptions.scales.yAxes[0].display = false;


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
  return totals;
}

function splitString(string) {
  // String must be manually split into lines to appear nicely on chart.
  var words = string.split(' ');
  var arrayOfSubstrings = [];
  if (words.length === 1) {
    return string;
  }
  var substr = words[0];
  for (var i = 1; i < words.length; i++) {
    if (substr.length > 8) {
      arrayOfSubstrings.push(substr);
      substr = words[i];
    } else {
      substr = substr + ' ' + words[i];
      if (i === words.length - 1) {
        arrayOfSubstrings.push(substr);
      }
    }
  }
  return arrayOfSubstrings;
}

function getLabels(question) {
  if (question.type === 'options') {
    var optionsLabels = question.options.map(option => {
      return splitString(option);
    });
    return optionsLabels;
  } else if (question.type === 'slider') {
    return [splitString(question.left), ['Somewhere', 'in the middle'], splitString(question.right)];
  }
}

var charts = [];

function drawAChart(question, index) {
  var ctx = $('#chart' + index);
  if (charts[index]) {
    charts[index].destroy();
  }
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: getLabels(question),
      datasets: [{
        data: countResponses(question),
        ...style
      }]
    },
    options: smallChartOptions
  });
  charts[index] = myChart;
}

function drawLargeChart(question, index) {
  var ctx = $('#chart' + index);
  if (charts[index]) {
    charts[index].destroy();
  }
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: getLabels(question),
      datasets: [{
        data: countResponses(question),
        ...style
      }]
    },
    options
  });
  charts[index] = myChart;
}

function drawCharts(questions) {
  questions.forEach((question, index) => {
    if (['options', 'slider'].indexOf(question.type) > -1) {
      if (question.responses.length > 0) {
        drawAChart(question, index);
      }
    }
  });
}

module.exports = {drawCharts, drawLargeChart};
