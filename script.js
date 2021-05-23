var canvas, canvasContainer, amountOfCars, jackInTheCar, carMovingSound, sirenSound, beepSound;

var cityMode = false;

//Setup YouTube's IFrame API
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var smallPopupInfo = {
  start: false,

};

function setup() {
  canvasContainer = document.getElementById("canvas-container");

  canvas = createCanvas(windowWidth + 10, windowHeight);

  canvasContainer.appendChild(canvas.canvas);

  for (let color of colors) {
    cars[color] = loadImage("assets/window-car-" + color + ".png");
    windowlesCars[color] = loadImage("assets/" + color + "-car.png");
  }

  amountOfCars = {
    x: Math.ceil(windowWidth / carSize),
    y: Math.ceil(windowHeight / carSize)
  };

  jackInTheCar = loadImage("assets/jackinthecar.png")

  generateCarColors()

  let popupTime = 15000;
  
  //Don't do the popup on mobile. Even though it might result in less clicking on the links, I think it looks sort of bad on mobile.
  if (!mobileCheck()) {
    setTimeout(() => {
      document.getElementById("popup-info").innerHTML = "<div><h4>Hey!</h4><p>I'm jaideng1/jg1. If you want to support my work, consider subscribing to my <a class=\"link-blue\" href=\"https://www.youtube.com/channel/UC-oDqToOF5-yP3vfwBEWYTA\" target=\"_blank\">YouTube channel!</a> Thanks lol - btw this popup will disappear in 5s</p></div>";
      //document.getElementById("popup-info").innerHTML = "<div><h4>Hey!</h4><p>I</p></div>";
      setTimeout(() => {
        document.getElementById("popup-info").innerHTML = "";
      }, 5000);
    }, popupTime)
  }
}

function mobileCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

carMovingSound = new Howl({
  src: ['assets/car-moving.mp3'],
  html5: true,
  format: ["mp3"]
})

sirenSound = new Howl({
  src: ['assets/siren_effect.mp3'],
  html5: true,
  format: ["mp3"]
})

beepSound = new Howl({
  src: ['assets/beepbeep.mp3'],
  html5: true,
  format: ["mp3"],
  onend: videoOver
})

var colors = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow"
]

var cars = {
  red: null,
  green: null,
  blue: null,
  orange: null,
  purple: null,
  yellow: null
}

var windowlesCars = {
  red: null,
  green: null,
  blue: null,
  orange: null,
  purple: null,
  yellow: null
}

var carColors = [];
const maxColors = {
  x: 50,
  y: 50
};

function generateCarColors() {
  for (let x = 0; x < maxColors.x; x++) {
    carColors.push([])
    for (let y = 0; y < maxColors.y; y++) {
      carColors[x].push(colors[Math.floor(Math.random() * colors.length)])
    }
  }
}

let carSize = 248;

let jackDisplay = {
  show: false,
  x: 100,
  y: 100,
  following: {
    x: -1,
    y: -1
  }
};

function draw() {
  background(100)

  if (jackDisplay.show) {
    image(jackInTheCar, jackDisplay.x, jackDisplay.y)
  }

  for (let x = 0; x < amountOfCars.x; x++) {
    for (let y = 0; y < amountOfCars.y; y++) {

      let size = carSize + 1 - 1;
      if (notAMovingCar(x, y)) {
        if (jackDisplay.following.x == x && jackDisplay.following.y == y) {
          image(windowlesCars[carColors[x % maxColors.x][y % maxColors.y]], x * carSize + 10, y * carSize + 10, size, size)
        } else {
          image(cars[carColors[x % maxColors.x][y % maxColors.y]], x * carSize + 10, y * carSize + 10, size, size)
        }
      }
    }
  }

  // if (mouseX > (windowWidth / 2) - (size / 2) && mouseX < (windowWidth / 2) + (size / 2)) {
  //   if (mouseY > (windowHeight / 2) - (size / 2) && mouseY < (windowHeight / 2) + (size / 2)) {
  //     size *= 1.05;
  //   }
  // }

  for (let x_ = 0; x_ < amountOfCars.x; x_++) {
    stroke(0)
    let x1 = x_ + 1
    if (lineInfo.slope.rise == 0) {
      lineInfo.slope.run = x1 * carSize + 35;
      lineInfo.slope.rise = carSize * (x1 * 2) + 63;
    }
    line(x1 * carSize + 35, 0, 0, carSize * (x1 * 2) + 40);
  }
  for (let x__ = 0; x__ < amountOfCars.x; x__++) {
    stroke(0)
    let x1 = x__ + 1;
    line(x1 * carSize + (carSize / 2) + 35, 0, 0, carSize * (x1 * 2) + (carSize) + 35);
  }

  // for (let x___ = 0; x___ < amountOfCars.x; x___++) {
  //   stroke(255)
  //   line(x___ * carSize + 10, 0, 0, carSize * (x___ * 2) + 10);
  // }

  moveCar();

  for (let movingCar of lineInfo.carsMoving) {
    if (movingCar["jackCar"]) {
      if (movingCar.x >= 0 && movingCar.y >= 0) {
        image(windowlesCars[carColors[movingCar.x % maxColors.x][movingCar.y % maxColors.y]], movingCar.currentX, movingCar.currentY, carSize, carSize)
      } else {
        image(windowlesCars[carColors[lineInfo.carsMoving[0].x][lineInfo.carsMoving[0].y]], movingCar.currentX, movingCar.currentY, carSize, carSize)
      }
    } else {
      if (movingCar.x >= 0 && movingCar.y >= 0) {
        image(cars[carColors[movingCar.x % maxColors.x][movingCar.y % maxColors.y]], movingCar.currentX, movingCar.currentY, carSize, carSize)
      } else {
        image(cars[carColors[lineInfo.carsMoving[0].x][lineInfo.carsMoving[0].y]], movingCar.currentX, movingCar.currentY, carSize, carSize)
      }
    }

  }
}

var lineInfo = {
  slope: {
    rise: 0,
    run: 0,
    speedDivider: 120
  },
  firstCarToY: 0,
  carsMoving: [],
  /*
{
  x:
  y:
  currentX:
  currentY:
}
  */
}

var movingCars = false;

function notAMovingCar(x, y) {
  for (let car of lineInfo.carsMoving) {
    if (car.x == x && car.y == y) {
      return false;
    }
  }
  return true;
}

function moveCar() {
  if (lineInfo.carsMoving.length == 0) return;
  if (!movingCars) {
    carMovingSound.stop();

    for (let car of lineInfo.carsMoving) {
      if (carColors[car.x] == null) continue;
      if (carColors[car.x][car.y] == null) continue;
      try {
        carColors[car.x - 1][car.y + 2] = carColors[car.x][car.y]
      } catch (e) {}
    }
    lineInfo.carsMoving = [];
    jackDisplay.show = false;

    jackDisplay.following = {x: -1, y: -1}

    if (cityMode) {
      createNewMovingCar(Math.floor(Math.random() * amountOfCars.x), Math.floor(Math.random() * amountOfCars.y))
    }

    return;
  }

  for (let car of lineInfo.carsMoving) {
    car.currentX -= lineInfo.slope.run / lineInfo.slope.speedDivider;
    car.currentY += lineInfo.slope.rise / lineInfo.slope.speedDivider;
  }

  jackDisplay.x -= lineInfo.slope.run / lineInfo.slope.speedDivider;
  jackDisplay.y += lineInfo.slope.rise / lineInfo.slope.speedDivider;

  lineInfo.moved++;

  if (lineInfo.firstCarToY <= lineInfo.carsMoving[lineInfo.carsMoving.length - 1].currentY) {
    movingCars = false;
  }
}

function dist(x, y, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2));
}

function getCarsOnRoad(x, y) {
  let listOfCars = [];
  let x_ = JSON.parse(JSON.stringify(x)) + Math.floor(y / 2);

  for (let y_ = y % 2; y_ < amountOfCars.y; y_ += 2) {

    listOfCars.push({
      x: x_,
      y: y_,
      currentX: x_ * carSize + 10,
      currentY: y_ * carSize + 10
    })

    x_--;
  }
  return listOfCars;
}

function windowResized() {
  resizeCanvas(windowWidth + 10, windowHeight);

  amountOfCars = {
    x: Math.ceil(windowWidth / carSize),
    y: Math.ceil(windowHeight / carSize)
  };
}

var toSetData = {
  x: 0,
  y: 0,
  setIt: true
}

function mousePressed() {
  if (movingCars) return;

  let carX = 0;
  let carY = 0;
  for (let x = 0; x < amountOfCars.x; x++) {
    for (let y = 0; y < amountOfCars.y; y++) {
      if (mouseX > x * carSize + 10 && mouseX < x * carSize + 10 + carSize) {
        if (mouseY > y * carSize + 10 && mouseY < y * carSize + 10 + carSize) {
          carX = x;
          carY = y;
        }
      }
    }
  }

  createNewMovingCar(carX, carY)
}

function createNewMovingCar(carX, carY) {
  destroyPlayer();

  // toSetData = {
  //   x: mouseX,
  //   y: mouseY,
  //   setIt: false
  // }

  jackDisplay = {
    show: true,
    x: 100 + (carX * carSize),
    y: 100 + (carY * carSize),
    following: {
      x: carX,
      y: carY
    }
  };

  movingCarQueue.push({
    x: carX,
    y: carY,
    currentX: (carX * carSize) + 10,
    currentY: (carY * carSize) + 10
  })

  movingCars = true;

  createNewVideoPlayer();
}

function createNewVideoPlayer() {
  onPlayerReady(null)
  // player = new YT.Player('player', {
  //   height: '49',
  //   width: '80',
  //   videoId: 'oDn-i76V5KU',
  //   playerVars: {
  //     'playsinline': 1,
  //     'autoplay': 1,
  //     'controls': 0,
  //     //'enablejsapi': 1
  //     //'origin': (document.location.host == "jaideng1.github.io") ? "https://" + document.location.host : "http://" + document.location.host
  //   },
  //   events: {
  //     'onReady': onPlayerReady,
  //     'onStateChange': changeState
  //   }
  // });
}

var player;
function onYouTubeIframeAPIReady() {
  console.log("YouTube IFrame API is ready.");
}

function onPlayerReady(event) {
  if (player != null) {
    player.seekTo(Math.random() * 2)
  } else {
    let id = beepSound.play();
    beepSound.seek(Math.random() * 2, id);
  }
  if (event != null) event.target.playVideo();

  if (!toSetData.setIt) {
    toSetData.setIt = true;

    setTimeout(() => {
      let vidEle = document.getElementById("player");
      if (vidEle == null) return;

      vidEle.style = "left: " + toSetData.x + "px; top: " + toSetData.y + "px; z-index: 4;";
    }, 10);
  }

  // setTimeout(() => {
  //   destroyPlayer();
  // }, );
}

var movingCarQueue = [];

function changeState(event) {
  if (event.data === 0) {
    videoOver();
  }
}

function videoOver() {
  destroyPlayer();

  for (let carQ of movingCarQueue) {
    let cs = getCarsOnRoad(carQ.x, carQ.y);
    for (let carOR of cs) {
      lineInfo.carsMoving.push((!(carOR.x == carQ.x && carOR.y == carQ.y)) ? carOR : {
        x: carOR.x,
        y: carOR.y,
        currentX: carOR.currentX,
        currentY: carOR.currentY,
        jackCar: true
      });
    }
    let beforeX = cs[0].x + 1;
    let beforeY = cs[0].y - 2;
    lineInfo.carsMoving.push({
      x: beforeX,
      y: beforeY,
      currentX: beforeX * carSize + 20,
      currentY: beforeY * carSize + 10,
    });
  }

  lineInfo.firstCarToY = lineInfo.carsMoving[0].currentY;

  carMovingSound.play();

  movingCarQueue = [];
}

function destroyPlayer() {
  if (player != null) {
    player.destroy();
    player = null;
  }
}

var cityModeInterval;

function toCityMode() {
  if (cityMode) {
    cityMode = false;
    clearInterval(cityModeInterval);
    return;
  }
  cityMode = true;
  movingCars = true;

  cityModeInterval = setInterval(() => {
    let id = sirenSound.play();
    sirenSound.fade(1, 0, 10000, id)
  }, 15000);

  createNewMovingCar(Math.floor(Math.random() * amountOfCars.x), Math.floor(Math.random() * amountOfCars.y))
}
