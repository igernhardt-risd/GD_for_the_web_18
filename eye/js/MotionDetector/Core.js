/**
 *
 * @project        Motion Detection in JS
 * @file           Core.js
 * @description    Core functionality.
 * @author         Benjamin Horn (edited by Isaiah Gernhardt)
 * @package        MotionDetector
 * @version        -
 * 
 */
var flip = true;

var previousX = 0;
var change = 0;
var speed = 10; // changes how much C will be devided by
var change2 = 0;
var targetXArray = [0, 0,0,0,0,0,0,0,0,0,0];
var averagePosition = 0;
var finalX = 0;
var currentSpeed = 0;
var elementPosition = 0;
var elementPositionInverted = 0;
var delayArray = [0,0,0,0,0,0,0,0,0,0,0];
var delayCount = 0;
var blinkTimer = 0;
var nextBlinkCount = 0;
var currentBlinkCount = 0;
var isBlinking = false;

function Map(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

;
(function(App) {

  "use strict";

  /*
   * The core motion detector. Does all the work.
   *
   * @return <Object> The initalized object.
   *
   */
  App.Core = function() {

    var rendering = false;

    var width = 100;
    var height = 14;

    var debugPosMult = (window.innerWidth / width);

    var webCam = null;
    var imageCompare = null;

    var currentImage = null;
    var oldImage = null;

    var topLeft = [Infinity, Infinity];
    var bottomRight = [0, 0];

    var raf = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    /*
     * Initializes the object.
     *
     * @return void.
     *
     */
    function initialize() {
      imageCompare = new App.ImageCompare();
      webCam = new App.WebCamCapture(document.getElementById('webCamWindow'));

      rendering = true;

      main();
    }

    /*
     * Compares to images and updates the position
     * of the motion div.
     *
     * @return void.
     *
     */
    function render() {
      oldImage = currentImage;
      currentImage = webCam.captureImage(false);

      if (!oldImage || !currentImage) {
        return;
      }

      var vals = imageCompare.compare(currentImage, oldImage, width, height);

      topLeft[0] = vals.topLeft[0] * debugPosMult;
      topLeft[1] = vals.topLeft[1] * debugPosMult;

      bottomRight[0] = vals.bottomRight[0] * debugPosMult;
      bottomRight[1] = vals.bottomRight[1] * debugPosMult;

      var sizeX = (bottomRight[0] - topLeft[0]);
      var sizeY = (bottomRight[1] - topLeft[1]);

      previousX = finalX;

      var topY = topLeft[1] + (sizeX / 2);
      var leftX = topLeft[0] + (sizeX / 2);

      if (document.getElementById('movement').style.left && leftX) {
        targetXArray.push(parseInt(document.getElementById('movement').style.left));
        targetXArray.shift();
      }

      for (var i = 0; i < targetXArray.length; i++) {
        averagePosition += targetXArray[i];
      };
      averagePosition /= targetXArray.length + 1;

      if (document.getElementById('movement').style.left) {
        change = previousX - averagePosition;
      }

      change2 = previousX - change / speed;

      finalX = change2;

      currentSpeed = (previousX - finalX);
      elementPosition -= currentSpeed;
      if (flip) {
        elementPositionInverted = (Map(elementPosition, 0, window.innerWidth, window.innerWidth, 0));
      } else {
        elementPositionInverted = elementPosition;
      }
      
      document.getElementById('movement').style.top = topY + 'px';
      document.getElementById('movement').style.left = leftX + 'px';

      document.getElementById('movementSmoothing').style.left = leftX + 'px';
      document.getElementById('pupil').style.left = Map(elementPositionInverted, 0, window.innerWidth, -window.innerWidth/3, window.innerWidth/3) + 'px';
      document.getElementById('pupil').style.marginTop = Map(Math.abs(Map(elementPositionInverted, 0, window.innerWidth, -window.innerHeight/3, window.innerHeight/3)), 0, window.innerHeight,window.innerHeight/2, 0) + 'px';
      
      delayArray.push(change);
      delayArray.shift();
      var average = 0;
      for (var i = 0; i < delayArray.length; i++) {
        average += delayArray[i];
        average /= delayArray.length;
        average = Math.round(average);
      }
      
      for (var i = 0; i < eyeCount; i++) {
        eyes[i].move();
        eyes[i].display();
      }
      
      if (average == 0) {
        if (delayCount < 301) {
          delayCount++;
        }
      } else {
        if (delayCount > 0) {
          delayCount = 0;
        }
        nextBlinkCount++
      }
      if (nextBlinkCount > 300) { ///////blinks after certain time has passed
        nextBlinkCount = 0;
        isBlinking = true;
      }
      
      if (currentBlinkCount < 10 && isBlinking == true) {
        currentBlinkCount++
      }
      if (currentBlinkCount == 10) {
        isBlinking = false;
      }
      if (currentBlinkCount > 0 && isBlinking == false) {
        currentBlinkCount--
      }
      
      if (delayCount > 300) {
        if (blinkTimer < 15) {
          blinkTimer++;
        }
      } else {
        if (blinkTimer > 0) {
          blinkTimer--;
        }
      }
      if (blinkTimer > 7 || currentBlinkCount > 7) {
        document.getElementById("background").setAttribute("src", "images/background-2.png");
      } else if (blinkTimer > 5 || currentBlinkCount > 5) {
        document.getElementById("background").setAttribute("src", "images/background-1.png");
      } else if (blinkTimer < 3 || currentBlinkCount > 3) {
        document.getElementById("background").setAttribute("src", "images/background.png");
      } else if (blinkTimer == 0 || currentBlinkCount > 0) {
      }
      topLeft = [Infinity, Infinity];
      bottomRight = [0, 0]

    }

    /*
     * The main rendering loop.
     *
     * @return void.
     *
     */
    function main() {
      try {
        render();
      } catch (e) {
        return;
      }

      if (rendering == true) {
        raf(main.bind(this));
      }
    }

    initialize();
  };
})(MotionDetector);

function windowResized() {
  var debugPosMult = (window.innerWidth / 64);
  window.location.reload(false);
}