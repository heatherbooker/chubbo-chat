export default function() {
  var circles = [],
    canvas = document.getElementById('cc-dotsBackground');
  if (canvas) {
    var context = canvas.getContext('2d'),
      // SETTINGS
      colors = ['#ff9fcb'],
      minSize = 3, // the minimum size of the circles in px
      maxSize = 6, // the maximum size of the circles in px
      numCircles = 20, // the number of circles
      minSpeed = -4, // the minimum speed, recommended: -maxspeed
      maxSpeed = 1, // the maximum speed of the circles
      expandState = true; // the direction of expansion

    function buildArray() {
      circles = [];
      'use strict';

      for (var i = 0; i < numCircles; i++) {
        var color = Math.floor(Math.random() * (colors.length - 1 + 1)) + 1,
          left = Math.floor(Math.random() * (canvas.width - 0 + 1)) + 0,
          top = Math.floor(Math.random() * (canvas.height - 0 + 1)) + 0,
          size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          leftSpeed = (Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed) / 10,
          topSpeed = (Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed) / 10,
          expandState = expandState;

        while (leftSpeed == 0 || topSpeed == 0) {
          leftSpeed = (Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed) / 10,
          topSpeed = (Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed) / 10;
        }
        var circle = {
          color: color,
          left: left,
          top: top,
          size: size,
          leftSpeed: leftSpeed,
          topSpeed: topSpeed,
          expandState: expandState
        };
        circles.push(circle);
      }
    }

    function build() {
      'use strict';

      for (var h = 0; h < circles.length; h++) {
        var curCircle = circles[h];
        context.fillStyle = colors[curCircle.color - 1];
        context.beginPath();
        if (curCircle.left > canvas.width + curCircle.size) {
          curCircle.left = 0 - curCircle.size;
          context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);
        } else if (curCircle.left < 0 - curCircle.size) {
          curCircle.left = canvas.width + curCircle.size;
          context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);
        } else {
          curCircle.left = curCircle.left + curCircle.leftSpeed;
          context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);
        }

        if (curCircle.top > canvas.height + curCircle.size) {
          curCircle.top = 0 - curCircle.size;
          context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);

        } else if (curCircle.top < 0 - curCircle.size) {
          curCircle.top = canvas.height + curCircle.size;
          context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);
        } else {
          curCircle.top = curCircle.top + curCircle.topSpeed;
          if (curCircle.size != maxSize && curCircle.size != minSize && curCircle.expandState == false) {
            curCircle.size = curCircle.size - 0.1;
          } else if (curCircle.size != maxSize && curCircle.size != minSize && curCircle.expandState == true) {
            curCircle.size = curCircle.size + 0.1;
          } else if (curCircle.size == maxSize && curCircle.expandState == true) {
            curCircle.expandState = false;
            curCircle.size = curCircle.size - 0.1;
          } else if (curCircle.size == minSize && curCircle.expandState == false) {
            curCircle.expandState = true;
            curCircle.size = curCircle.size + 0.1;
          }
          context.arc(curCircle.left, curCircle.top, curCircle.size, 0, 2 * Math.PI, false);
        }

        context.closePath();
        context.fill();
        context.ellipse;
      }
    }


    var xVal = 0;

    window.requestAnimFrame = (function(callback) {
      'use strict';
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    function animate(shouldPause) {
      var pause = false;
      if (shouldPause) {
        pause = true;
      }
      if (!pause) {
        'use strict';
        var canvas = document.getElementById('cc-dotsBackground');
        if (canvas) {
          context = canvas.getContext('2d');

          // clear the canvas
          context.clearRect(0, 0, canvas.width, canvas.height);


          // draw the next frame
          xVal++;
          build();

          //console.log("Prep: animate ==> requestAnimFrame");
          // request a new frame
          requestAnimFrame(function() {
            animate(false);
          });
        }
      }
    }

    var navbarHeight = (function() {
      var mediaQuery = window.matchMedia("(max-width: 992px)");
      if (mediaQuery.matches) {
        //on mobile
        return 77;
      } else {
        return 90;
      }
    })();

    (function() {
      'use strict';
      canvas.width = $('body').innerWidth();
      canvas.height = $(window).height() - navbarHeight;
      buildArray();
      animate(false);
    }());

    var delay = (function() {
      var timer = 0;
      return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
      };
    }());

    $(window).resize(function() {
      animate(true);
      delay(function() {
        'use strict';
        canvas.width = $('body').innerWidth();
        canvas.height = $(window).height() - navbarHeight;
        buildArray();
        animate(false);
      }, 1000);
    });
  }
}
