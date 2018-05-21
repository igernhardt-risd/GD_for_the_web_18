var eyeCount = 17;
var eyes = [];

for (var i = 0; i < eyeCount; i++) {
  eyes[i] = new Eye(100, 20, 20, "eye" + i);
  var para = document.createElement("IMG");
  para.setAttribute("src", "images/eye" + i + ".gif");
  para.setAttribute("width", eyes[i].size);
  para.setAttribute("height", eyes[i].size);
  para.id = eyes[i].ID;
  para.style.top = eyes[i].Y + "px"
  para.className = "eye";
  var element = document.getElementById("eyeContainer");
  element.appendChild(para);
}
console.log(eyes.length);

function Eye(X, S, M, I) { //creates a constructor function, which derives from a constrainer vaulue below !!ONLY WORKS IF YOU SAY NEW!!
  this.xInit = Map((Math.floor(Math.random() * 100) + 1),1,100,0,window.innerWidth); // can also creat params
  this.X = 0;
  this.Y = Map((Math.floor(Math.random() * 100) + 1),1,100,0,window.innerHeight);
  this.size = 100 + 150 * Math.random();
  this.moveMult = Math.floor(Math.random() * 10) + 2;
  this.ID = I

  this.move = function() {
      this.X = this.xInit + (Map(elementPositionInverted, 0, window.innerWidth, -window.innerWidth/2, window.innerWidth/2)/this.moveMult);
  }
  this.display = function() {
    document.getElementById(this.ID).style.left = this.X + "px";
  }
}