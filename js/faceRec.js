let uavRight = true;
let goingUp = false;

function goToSalah() {
  var salah = document.getElementById("salahFace");
  var salahPos = createVector(salah.offsetLeft  + 60, salah.offsetTop + 60);
  moveUAV(salah, salahPos);
}
function goToOle() {
  var ole = document.getElementById("oleFace");
  var olePos = createVector(ole.offsetLeft + 60, ole.offsetTop + 60);
  moveUAV(ole, olePos);
}
function goToRivers() {
  var rivers = document.getElementById("riversFace");
  var riversPos = createVector(rivers.offsetLeft + 60, rivers.offsetTop + 60);
  moveUAV(rivers, riversPos);
}

function moveUAV(face, facePos) {
  document.getElementById("console-2").style.visibility = "visible";
  var uav = document.getElementById("uavPic");
  var uavPos = createVector(uav.offsetLeft + 10, uav.offsetTop + 40);
  var orUavPos = createVector(uav.offsetLeft + 10, uav.offsetTop + 40);
  var id = setInterval(frame, 10);
  function frame() {
    if (Math.abs(uavPos.x > (facePos.x - 40)) && Math.abs(uavPos.y < (facePos.y))) {
      document.getElementById("console-3").style.visibility = "visible";
      scanFace(face, facePos, orUavPos, uavPos, uav);
      clearInterval(id);
    } else if (uavRight == true) {
      uavPos.x++;
      uav.style.left = uavPos.x + 'px';
      if (Math.abs(uavPos.x > (facePos.x - 40))) {
        uavRight = false;
      }
   } else if (uavRight == false) {
     uavPos.y--;
     uav.style.top = uavPos.y + 'px';
   }
  }
}

function scanFace (face, facePos, orUavPos,  uavPos, uav) {
  let counter = 0;
  var id = setInterval(frame, 50);
  function frame() {
    if (counter == 50) {
      face.style.opacity = 1;
      document.getElementById("console-4").style.visibility = "visible";
      moveBackUAV(orUavPos, uavPos, uav, face, facePos);
      clearInterval(id);
    } else if (goingUp == true) {
      face.style.opacity = 0.6;
      counter++;
      goingUp = false;
   } else if (goingUp == false) {
     face.style.opacity = 0.4;
     counter++;
     goingUp = true;
   }
  }
}

function moveBackUAV (originalPos, uavPos, uav, face, facePos) {
  var id = setInterval(frame, 10);
  function frame() {
    if (Math.abs(uavPos.x < originalPos.x)) {
      search(originalPos, uavPos, uav, face, facePos);
      clearInterval(id);
    } else if (uavRight == false) {
      uavPos.y++;
      uav.style.top = uavPos.y + 'px';
      if (Math.abs(uavPos.y > (originalPos.y - 40))) {
        uavRight = true;
      }
   } else if (uavRight == true) {
     uavPos.x--;
     uav.style.left = uavPos.x + 'px';
   }
  }
}

function search (originalPos, uavPos, uav, face, facePos) {
  document.getElementById("console-5").style.visibility = "visible";
  var salah = document.getElementById("salahFace");
  var salahPos = createVector(salah.offsetLeft  + 60, salah.offsetTop + 60);
  var ole = document.getElementById("oleFace");
  var olePos = createVector(ole.offsetLeft + 60, ole.offsetTop + 60);
  var rivers = document.getElementById("riversFace");
  var riversPos = createVector(rivers.offsetLeft + 60, rivers.offsetTop + 60);

  var id = setInterval(frame, 10);
  function frame() {
    if (Math.abs(uavPos.x > (facePos.x - 40)) && Math.abs(uavPos.y < (facePos.y))) {
      document.getElementById("console-6").style.visibility = "visible";
      document.getElementById("console-7").style.visibility = "visible";
      document.getElementById("console-8").style.visibility = "visible";
      document.getElementById("console-9").style.visibility = "visible";
      finish(originalPos, uavPos, uav, face, facePos, salah, ole);
      clearInterval(id);
    } else if (uavRight == true) {
      uavPos.y--;
      uav.style.top = uavPos.y + 'px';
      if (Math.abs(uavPos.y < (facePos.y))) {
        uavRight = false;
      }
   } else if (uavRight == false) {
     uavPos.x++;
     uav.style.left = uavPos.x + 'px';
     if (uavPos.x > salahPos.x) {
       salah.style.opacity = 0.5;
     }
     if (uavPos.x > olePos.x) {
       ole.style.opacity = 0.5;
     }
   }
  }
}

function finish (originalPos, uavPos, uav, face, facePos, salah, ole) {
  var id = setInterval(frame, 10);
  function frame() {
    if (Math.abs(uavPos.x < originalPos.x)) {
      document.getElementById("console-2").style.visibility = "hidden";
      document.getElementById("console-3").style.visibility = "hidden";
      document.getElementById("console-4").style.visibility = "hidden";
      document.getElementById("console-5").style.visibility = "hidden";
      document.getElementById("console-6").style.visibility = "hidden";
      document.getElementById("console-7").style.visibility = "hidden";
      document.getElementById("console-8").style.visibility = "hidden";
      document.getElementById("console-9").style.visibility = "hidden";
      salah.style.opacity = 1;
      ole.style.opacity = 1;
      clearInterval(id);
    } else if (uavRight == false) {
      uavPos.y++;
      uav.style.top = uavPos.y + 'px';
      if (Math.abs(uavPos.y > (originalPos.y - 40))) {
        uavRight = true;
      }
   } else if (uavRight == true) {
     uavPos.x--;
     uav.style.left = uavPos.x + 'px';
   }
  }
}
