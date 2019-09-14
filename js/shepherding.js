// ------------------------------------------------------------------------
// ---------------  Shepherding  ------------------------------------------
// ------------------------------------------------------------------------
let env, angle;

function setup() {
  canvasWidth = document.getElementById("shepCanvas").offsetWidth;
  shepCanvas = createCanvas(400, canvasWidth);
  shepCanvas.parent("shepCanvas");
  env = new Environment();
}

function draw() {
  shepCanvas.mouseClicked(addUAV);
  background(0, 180, 0);
  env.run();
}

function addUAV() {
  env.addUav(new Uav(mouseX, mouseY));
}

function startAgain () {
  env.animals.length = 0;
  for (let i = 0; i < 10; i++) {
    x = random(0 ,401);
    y = random(0, 101);
    let a = new Animal(x, y);
    env.addAnimal(a);
  }
}

function Environment() {
  this.animals = [];
  this.uavs = [];
}

Environment.prototype.run = function() {
  stroke(0);
  fill(255);
  ellipse(200,canvasWidth,20,20);
  textSize(18);
  stroke(255);
  text("Goal", 220, canvasWidth - 5);
  for (let i = 0; i < this.animals.length; i++) {
    this.animals[i].run(this.animals, this.uavs);
  }
  for (let i = 0; i < this.uavs.length; i++) {
    this.uavs[i].run();
  }

  if (this.uavs.length > 1) {
    this.uavs.length = 1;
  }

  if (this.animals.length == 0) {
    this.uavs.length = 0;
  }
}

Environment.prototype.addAnimal = function(a) {
  this.animals.push(a);
}

Environment.prototype.addUav = function(u) {
  this.uavs.push(u);
}

function Animal(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 0.01;
  this.maxforce = 0.03
  this.name = chance.first();
  this.reducingSpeed = false;
}

Animal.prototype.run = function(animals, uavs) {
  this.herd(animals, uavs);
  this.update();
  this.borders();
  this.render();
}

Animal.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

Animal.prototype.herd = function(animals, uavs) {
  let sep = this.separate(animals);
  let ali = this.align(animals);
  let coh = this.cohesion(animals);

  let fli = this.flightZone(uavs);
  let dsep = this.dSep(uavs);

  let goa = this.goal();

  if (fli == 0) {
    sep.mult(1.5);
    ali.mult(0);
    coh.mult(0);
  } else {
    this.maxspeed = 0.5;
    sep.mult(1.2);
    ali.mult(.7);
    coh.mult(.8);
    dsep.mult(1.5);
  }

  if (this.oldFli > fli) {
    this.timeCount = (Math.round(this.velocity.mag()*10));
    this.speedRed();
  }

  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
  this.applyForce(dsep);

  this.oldFli = fli;
}

Animal.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
}

Animal.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);
  return steer;
}

Animal.prototype.render = function() {
  var theta = this.velocity.heading() + radians(90);
  fill(0, 0, 0);
  stroke(255);
  push();
  translate(this.position.x,this.position.y);
  rotate(theta);
  beginShape();
  ellipse(0,0, 5, 10)
  ellipse(0,-5,5,5)
  endShape(CLOSE);
  pop();
}

Animal.prototype.borders = function() {
  if (this.position.x < 15) {
   this.velocity.x *= -1;
   this.position.x = 15;
 } else if (this.position.y < 15) {
   this.velocity.y *= -1;
   this.position.y = 15;
 } else if (this.position.x > width - 15) {
   this.velocity.x *= -1;
   this.position.x = width - 15;
 } else if (this.position.y > height - 15) {
   this.velocity.y *= -1;
   this.position.y = height - 15;
 }
}

Animal.prototype.separate = function(animals) {
  let desiredseparation = 5;
  let steer = createVector(0, 0);
  let count = 0;
  for (let i = 0; i < animals.length; i++) {
    let d = p5.Vector.dist(this.position,animals[i].position);
    if ((d > 0) && (d < desiredseparation)) {
      let diff = p5.Vector.sub(this.position, animals[i].position);
      diff.normalize();
      diff.div(d);
      steer.add(diff);
      count++;
    }
  }
  if (count > 0) {
    steer.div(count);
  }

  if (steer.mag() > 0) {
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

Animal.prototype.align = function(animals) {
  let neighbordist = 200;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < animals.length; i++) {
    let d = p5.Vector.dist(this.position,animals[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(animals[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

Animal.prototype.cohesion = function(animals) {
  let neighbordist = 200;
  let sum = createVector(0, 0);
  let count = 0;
  for (let i = 0; i < animals.length; i++) {
    let d = p5.Vector.dist(this.position,animals[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(animals[i].position);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);
  } else {
    return createVector(0, 0);
  }
}

Animal.prototype.goal = function () {
  var goal = createVector(200,canvasWidth);
  if (dist(this.position.x, this.position.y, goal.x, goal.y) < 30) {
    var index = env.animals.map(function (item) {
      return item.name;
    }).indexOf(this.name);
    env.animals.splice(index, 1);
  }
}

Animal.prototype.flightZone = function(uavs) {
  var neighbordistMax = 100;
  var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
  var count = 0;
  var neighCount = 0;

  for (var i = 0; i < uavs.length; i++) {
    var d = p5.Vector.dist(this.position,uavs[i].position);
    if ((d > 0) && (d < neighbordistMax)) {
      sum.add(uavs[i].position); // Add location
      count++;
    }
  }
  return count; // Return number of shepherds in pressure zone
}

Animal.prototype.dSep = function(uavs) {
  var desiredseparation = 100;
  var steer = createVector(0,0);
  var count = 0;
  for (var i = 0; i < uavs.length; i++) {
    var d = p5.Vector.dist(this.position,uavs[i].position);
    if ((d > 0) && (d < desiredseparation)) {
      var diff = p5.Vector.sub(this.position,uavs[i].position);
      diff.normalize();
      diff.div(d);
      steer.add(diff);
      count++;
    }
  }
  if (steer.mag() > 0) {
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

Animal.prototype.speedRed = function() {
  if (this.reducingSpeed == false) {
    this.reducingSpeed = true;
    var self = this;
    var timer = setInterval(function () {
      if (self.timeCount == 0) {
        self.velocity.setMag(0.03);
        self.reducingSpeed = false;
        clearInterval(timer);
      } else {
        self.velocity.setMag(self.timeCount * .1);
        self.timeCount--;
      }
    }, 1000);
  } else {

  }
}

function Uav(x,y) {
  this.position = createVector(x,y);
  this.r = 3.0;
}

Uav.prototype.run = function(herd) {
  this.update();
  this.borders();
  this.render();
}

Uav.prototype.borders = function () {
  if (this.position.x < 15) {
    this.position.x = 15;
  } else if (this.position.y < 15) {
    this.position.y = 15;
  } else if (this.position.x > width - 15) {
    this.position.x = width - 15;
  } else if (this.position.y > height - 15) {
    this.position.y = height - 15;
  }
}

Uav.prototype.update = function() {
  this.position.x = lerp(this.position.x, mouseX, 0.6);
  this.position.y = lerp(this.position.y, mouseY, 0.6);
}

Uav.prototype.render = function() {
  if (mouseY != pmouseY && mouseX != pmouseX) {
    angle = atan2(mouseY-pmouseY, mouseX-pmouseX);
  }
  fill(255);
  stroke(0);
  push();
  translate(mouseX, mouseY);
  rotate(angle + HALF_PI);
  beginShape();
  ellipse(-5, 0, 5,5); // 2
  ellipse(0, 0, 5,5); // 4
  fill(0,0,255);
  ellipse(-5,-5, 5,5); // 1
  ellipse(0,-5, 5,5); // 3
  endShape(CLOSE);
  pop();
}
