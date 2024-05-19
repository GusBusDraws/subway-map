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
let greenPoints = [
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
let greenStations = [
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0],
  [0, 1, 0, 1, 0],
]
let greenLine, yellowLine;
let lines;

function setup() {
	console.log('Starting...');
	createCanvas(windowWidth, windowHeight);
	background(100);
	console.log(stations.length);
	// noLoop();
  greenLine = new SubwayLine();
	greenLine.startX = width / 2 - 4 * stationDist;
  greenLine.startY = height / 2 - (4 * stationDist) / 2;
  greenLine.color = color(0, 255, 0);
  greenLine.points = [
    [1, 0], [2, 0], [3, 0],
    [4, 1], [4, 2], [4, 3],
    [3, 4], [2, 4], [1, 4],
    [0, 3], [0, 2], [0, 1],
    [1, 0]
  ]
  greenLine.stations = [
    0, 1, 0,
    0, 1, 0,
    1, 0, 1,
    0, 1, 0,
    0
  ]
  yellowLine = new SubwayLine();
	yellowLine.startX = width / 2 + lineWidth;
  yellowLine.startY = height / 2 - (4 * stationDist) / 2;
  yellowLine.color = color(255, 255, 0);
  yellowLine.points = [
    [1, 0], [2, 0], [3, 0],
    [4, 1], [4, 2], [4, 3],
    [3, 4], [2, 4], [1, 4],
    [0, 3], [0, 2], [0, 1],
    [1, 0]
  ]
  yellowLine.stations = [
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0
  ]
  lines = [greenLine, yellowLine];
}

function draw() {
    ///////////////////
   // Draw the line //
  ///////////////////
  for (let l of lines) {
    l.drawLine();
  }
    ///////////////////////
   // Draw the stations //
  ///////////////////////
  for (let l of lines) {
    l.drawStations();
  }
}

class SubwayLine {
  constructor() {
    this.startX = null;
    this.startY = null;
    this.color = null;
    this.points = [];
    this.stations = [];
  }
  drawLine() {
    stroke(this.color);
    strokeWeight(lineWidth);
    for (let i = 0; i < this.points.length - 1; i++) {
      let x1 = this.startX + stationDist * this.points[i][0];
      let y1 = this.startY + stationDist * this.points[i][1];
      let x2 = this.startX + stationDist * this.points[i + 1][0];
      let y2 = this.startY + stationDist * this.points[i + 1][1];
      line(x1, y1, x2, y2);
    }
  }
  drawStations() {
    noStroke();
    let i = 0;
    for (let station_bool of this.stations) {
      let x = this.points[i][0];
      let y = this.points[i][1];
      if (station_bool === 1) {
        let x1 = this.startX + stationDist * x;
        let y1 = this.startY + stationDist * y;
        this.drawStation(x1, y1)
        text(i, x1 + 30, y1 + 30)
      }
      i++;
    }
  }
  drawStation(x, y) {
    fill(0);
    circle(x, y, stationDiameter);
    fill(255);
    circle(x, y, stationDiameter / 2);
  }
}

function drawConnection(selectionIdx) {
	stroke(255, 0, 0);
	strokeWeight(5);
	let selectedStation = stations[selectionIdx];
	let prevStationIdx = selectedStationIdcs[selectedStationIdcs.length - 2]
	let prevStation = stations[prevStationIdx];
	line(selectedStation.x, selectedStation.y, prevStation.x, prevStation.y);
}
