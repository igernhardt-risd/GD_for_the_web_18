var context, canvas, carrier, modulator, fft, carFreq = 10, targetPos, transitionTimer = [1, 120, 60], scoreStarted = false, endTimer = 120, startedLockpick = false;

var targetPosMultiplier = [0.2, 0.6, 0.75, 0.4, 0.1];
var mainDuckingSize = 0.5;
var main_MinMaxFreq = [150, 400];
var mod_AmpFreq = [0.6, 8];

var noiseAmp = 0.01;
var noiseDucking = 15;

var score = 0;
var scoreCheckpoint = [20, 40, 60, 80, 100];
var scoreDuckingSize = 1;
var scoreScale = [0.1, -1, 0.02];
var progress = [0, scoreCheckpoint[0]];

var unlocked = [false, false, false, false, false]
var transitionTimerBase = [40, 120, 60];



function preload() {
  unlock1 = loadSound('assets/safeUnlock1.wav');
  unlock2 = loadSound('assets/safeUnlock2.wav');
  unlock3 = loadSound('assets/safeUnlock3.wav');
  unlock4 = loadSound('assets/safeUnlock4.wav');
  unlock5 = loadSound('assets/safeUnlock5.wav');
  carrier = new p5.Oscillator();
  modulator = new p5.Oscillator('triangle');
  reverb = new p5.Reverb();
  filter = new p5.BandPass();
  noise = new p5.Noise();
}


function setup() {
  canvas = createCanvas(windowWidth * 0.8, windowHeight / 5);
  canvas.parent('canvasContainer');
  canvas.style('position', 'absolute');
  noFill();
  background(30);
  targetPos = windowWidth * targetPosMultiplier[0];



  carrier.freq(200);
  carrier.amp(0);
  carrier.start();


  modulator.disconnect();
  modulator.freq(5);
  modulator.amp(0);
  modulator.start();


  reverb.process(modulator, 3, 10);

  noise.disconnect();
  filter.process(noise);
  noise.start();
  noise.amp(noiseAmp);

  carrier.amp(modulator.scale(-1, 1, 1, -1));

  fft = new p5.FFT();

  //context = canvas.getContext('2d');
}





function draw() {
  background(30, 30, 30, 100);

  if (endTimer >= 120 && startedLockpick) {
    filterFreq = 200;
    filterWidth = Math.max(0, map(abs(mouseX - targetPos), 0, width * noiseDucking, 0, 50));
    filter.set(filterFreq, filterWidth);

    var modFreq = Math.max(0, map(abs(mouseX - targetPos), 0, width * mainDuckingSize, mod_AmpFreq[1], 0));
    modulator.freq(modFreq);


    if (transitionTimer[0] > 0) {
      scoreStarted = false;
      transitionTimer[0]--;
      modulator.amp(map(transitionTimer[0], 0, transitionTimerBase[0], 0, mod_AmpFreq[0]), 0.01)
      noise.amp(map(transitionTimer[0], 0, transitionTimerBase[0], 0, noiseAmp), 0.01);

    } else if (transitionTimer[1] > 0) {
      transitionTimer[1]--;
      modulator.amp(0, 0);
      noise.amp(0);

    } else if (transitionTimer[2] > 0 && !unlocked[4]) {
      scoreStarted = true;
      transitionTimer[2]--;
      modulator.amp(map(transitionTimer[2], 0, transitionTimerBase[2], mod_AmpFreq[0] * Math.max(0, map(abs(mouseX - targetPos), 0, width * mainDuckingSize, mod_AmpFreq[0], 0)), 0))
      noise.amp(map(transitionTimer[2], 0, transitionTimerBase[2], noiseAmp, 0), 0.01);

    } else if (!unlocked[4]) {
      var modAmp = Math.max(0, map(abs(mouseX - targetPos), 0, width * mainDuckingSize, mod_AmpFreq[0], 0));
      modulator.amp(modAmp, 0.01);
      
    } else if (unlocked[4] && endTimer > 0) {
      endTimer--
    }


    carFreq = map(mouseX, 0, width, main_MinMaxFreq[0], main_MinMaxFreq[1]);
    carrier.freq(carFreq);

    ///////// SCORE SHIT
    if (scoreStarted) {
      if (map(abs(mouseX - targetPos), 0, width * scoreDuckingSize, scoreScale[0], scoreScale[1]) > 0) {
        var scoreModifier = map(abs(mouseX - targetPos), 0, width * scoreDuckingSize, scoreScale[0], scoreScale[1]);
      } else {
        var scoreModifier = Math.max(-scoreScale[2], map(abs(mouseX - targetPos), 0, width * scoreDuckingSize, 0, -scoreScale[2]));
      }
      score += scoreModifier;
      score = Math.max(0, score);
    }


    ////////// DISPLAY SHIT
    waveform = fft.waveform();
    drawWaveform();
    drawText(modFreq, modAmp);
    stroke(255);
    strokeWeight(1);

    //line(width / 2, height - 10, map(scoreModifier, 0, scoreScale[0], width / 2, width), height - 10);

    if (!unlocked[0] && score > scoreCheckpoint[0]) {
      unlocked1();
    } else if (!unlocked[1] && score > scoreCheckpoint[1]) {
      unlocked2();
    } else if (!unlocked[2] && score > scoreCheckpoint[2]) {
      unlocked3();
    } else if (!unlocked[3] && score > scoreCheckpoint[3]) {
      unlocked4();
    } else if (!unlocked[4] && score > scoreCheckpoint[4]) {
      unlocked5();
    }
  }
}



function unlocked1() {
  unlocked[0] = true;
  unlock1.play();
  document.getElementById('canvasContainer').style.top = (windowHeight * 0.2) + 40 + "px";
  document.getElementById('line1').style.visibility = "visible";
  document.getElementById('line1').style.opacity = "1";
  transitionTimer = [transitionTimerBase[0], transitionTimerBase[1], transitionTimerBase[2]];
  targetPos = windowWidth * targetPosMultiplier[1];
  progress = [scoreCheckpoint[0], scoreCheckpoint[1]];
  noiseDucking = 10;
}

function unlocked2() {
  unlocked[1] = true;
  unlock2.play();
  document.getElementById('canvasContainer').style.top = (windowHeight * 0.4) + 40 + "px";
  document.getElementById('line2').style.visibility = "visible";
  document.getElementById('line2').style.opacity = "1";
  transitionTimer = [transitionTimerBase[0], transitionTimerBase[1], transitionTimerBase[2]];
  targetPos = windowWidth * targetPosMultiplier[2];
  progress = [scoreCheckpoint[1], scoreCheckpoint[2]];
  noiseDucking = 6;
}

function unlocked3() {
  unlocked[2] = true;
  unlock3.play();
  document.getElementById('canvasContainer').style.top = (windowHeight * 0.6) + 40 + "px";
  document.getElementById('line3').style.visibility = "visible";
  document.getElementById('line3').style.opacity = "1";
  transitionTimer = [transitionTimerBase[0], transitionTimerBase[1], transitionTimerBase[2]];
  targetPos = windowWidth * targetPosMultiplier[3];
  progress = [scoreCheckpoint[2], scoreCheckpoint[3]];
  noiseDucking = 4;
}

function unlocked4() {
  unlocked[3] = true;
  unlock4.play();
  document.getElementById('canvasContainer').style.top = (windowHeight * 0.8) + 40 + "px";
  document.getElementById('line4').style.visibility = "visible";
  document.getElementById('line4').style.opacity = "1";
  transitionTimer = [transitionTimerBase[0], transitionTimerBase[1], transitionTimerBase[2]];
  targetPos = windowWidth * targetPosMultiplier[4];
  progress = [scoreCheckpoint[3], scoreCheckpoint[4]];
  noiseDucking = 1;
}

function unlocked5() {
  unlocked[4] = true;
  unlock5.play();
  document.getElementById('canvasContainer').style.top = (windowHeight * 1) + 40 + "px";
  document.getElementById('line5').style.visibility = "visible";
  document.getElementById('line5').style.opacity = "1";
  transitionTimer = [transitionTimerBase[0], transitionTimerBase[1], transitionTimerBase[2]];
  noiseDucking = 0.5;
}




function drawWaveform() {
  stroke(map(score, progress[0], progress[1], 255, 100), 255, map(score, progress[0], progress[1], 255, 100), map(endTimer, 120, 0, 255, 0));
  strokeWeight(2);
  noFill();
  beginShape();
  for (var i = 0; i < waveform.length; i++) {
    var x = map(i, 0, waveform.length, 0, width);
    var y = map(waveform[i], -1, 1, -height / 2, height / 2) * map(x, 0, width, 0, 2) * map(x, 0, width, 2, 0);
    vertex(x, y + height / 2);
  }
  endShape();
}

function drawText(modFreq, modAmp) {
  fill("White");
  noStroke();
  text(floor(score) + " / " + progress[1], mouseX + 10, mouseY - 10);
  text(carFreq.toFixed(3) + ' Hz', mouseX + 10, mouseY + 20);
}


function startLockpick() {
  startedLockpick = true;
  document.getElementById('canvasContainer').style.top = "40px";
  document.getElementById('startContainer').style.top = "200%";
  document.getElementById('dottedLines').style.top = "40px";
}

function unlock() {
  endTimer = 0;
  document.getElementById('canvasContainer').style.top = "150vh";
  document.getElementById('dottedLines').style.transition = "top 1.5s 0s";
  document.getElementById('dottedLines').style.top = "150vh";
  document.getElementById('textContainer').style.top = "150vh";
  document.getElementById('unlockContainer').style.top = "150vh";
  unlock1.play();
  unlock2.play();
}


function windowResized() {
  resizeCanvas(windowWidth * 0.8, windowHeight / 5);
}