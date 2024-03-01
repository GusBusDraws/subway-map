// @ts-check
/// <reference path="./node_modules/@types/p5/global.d.ts" />
let stations = [
  {
    "name" : "DoodleBot",
    "url" : "gusbus.space/doodlebot/",
    "owner" : "Gus Becker"
  },
  {
    "name" : "Doodles",
    "url" : "jazz-dude.com/Portfolio/doodles.html",
    "owner" : "Jazz"
  },
  {
    "name" : "Doodles",
    "url" : "art.bymegan.com/doodles.html",
    "owner" : "Megan Chesterton"
  },
  {
    "name" : "my art 2024",
    "url" : "uuupah.neocities.org/art/my-art-2024/",
    "owner" : "uuupah"
  },
  {
    "name" : "Webring Landing Page",
    "url" : "yamasztuka.com/artindex.html",
    "owner" : "Yamasztuka"
  }
];

let stationDiameter = 30;
let lineWidth = stationDiameter / 2;
let stationDist = 100;
let structure = [
  [1, 0], [2, 0], [3, 0],
  [4, 1], [4, 2], [4, 3],
  [3, 4], [2, 4], [1, 4],
  [0, 3], [0, 2], [0, 1],
  [1, 0]
]
// let structure = [
//   [4, 2], [4, 3],
//   [3, 4], [2, 4], [1, 4],
//   [0, 3], [0, 2], [0, 1],
//   [1, 0], [2, 0], [3, 0],
//   [4, 1], [4, 2]
// ]
let stationLocation = [
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0],
]
let startX, startY;

function setup() {
	console.log('Starting...');
	createCanvas(windowWidth, windowHeight);
	background(100);
	console.log(stations.length);
	noLoop();
}

function draw() {
    ///////////////////
   // Draw the line //
  ///////////////////
	startX = width / 2;
  startY = height / 2;
  stroke(0, 255, 0);
  strokeWeight(lineWidth);
  for (let i = 0; i < structure.length - 1; i++) {
    let x1 = startX + stationDist * structure[i][0];
    let y1 = startY + stationDist * structure[i][1];
    let x2 = startX + stationDist * structure[i + 1][0];
    let y2 = startY + stationDist * structure[i + 1][1];
    line(x1, y1, x2, y2);
  }
    ///////////////////////
   // Draw the stations //
  ///////////////////////
  noStroke();
  let i = 0;
  for (let coord of structure) {
    let x = coord[0];
    let y = coord[1];
    if (stationLocation[y][x] === 1) {
      let x1 = startX + stationDist * x;
      let y1 = startY + stationDist * y;
      drawStation(x1, y1)
      text(i, x1 + 30, y1 + 30)
      i++;
    }
  }
}

class Station {
  constructor() {
    this.x = random(width);
    this.y = random(height);
  }
}

function drawStation(x, y) {
	fill(0);
  circle(x, y, stationDiameter);
	fill(255);
  circle(x, y, stationDiameter / 2);
}

function drawConnection(selectionIdx) {
	stroke(255, 0, 0);
	strokeWeight(5);
	let selectedStation = stations[selectionIdx];
	let prevStationIdx = selectedStationIdcs[selectedStationIdcs.length - 2]
	let prevStation = stations[prevStationIdx];
	line(selectedStation.x, selectedStation.y, prevStation.x, prevStation.y);
}
