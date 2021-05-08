var canvas, canvasContainer, amountOfCars, jackInTheCar, carMovingSound, sirenSound;

var cityMode = false;

//Setup YouTube's IFrame API
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
}

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
  player = new YT.Player('player', {
    height: '49',
    width: '80',
    videoId: 'oDn-i76V5KU',
    playerVars: {
      'playsinline': 1,
      'autoplay': 1,
      'controls': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': changeState
    }
  });
}

var player;
function onYouTubeIframeAPIReady() {
  console.log("YouTube IFrame API is ready.");
}

function onPlayerReady(event) {
  player.seekTo(Math.random() * 2)
  event.target.playVideo();

  if (!toSetData.setIt) {
    toSetData.setIt = true;

    setTimeout(() => {
      let vidEle = document.getElementById("player");
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
    sirenSound.play();
  }, 10000);

  createNewMovingCar(Math.floor(Math.random() * amountOfCars.x), Math.floor(Math.random() * amountOfCars.y))
}
