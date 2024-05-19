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
	// createCanvas(windowWidth, windowHeight);
	createCanvas(1000, 500);
	background(100);
	console.log(stations.length);
	noLoop();
  greenLine = new SubwayLine();
	greenLine.name = 'green'
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
  greenLine.stationIdcs = [
    -1,  0, -1,
    -1,  1, -1,
     2, -1,  3,
    -1,  4, -1,
    -1
  ]
  greenLine.stationNames = [
    'A', 'B', 'C', 'D', 'E'
  ]
  yellowLine = new SubwayLine();
	yellowLine.name = 'yellow'
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
  yellowLine.stationIdcs = [
    -1,  0, -1,
    -1,  1, -1,
    -1,  2, -1,
    -1,  3, -1,
    -1
  ]
  yellowLine.stationNames = [
    'F', 'G', 'H', 'B'
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
  let overlappingStations, overlapData = checkStationOverlap(lines)
  console.log(overlappingStations)
  console.log(overlapData)
    ///////////////////////
   // Draw the stations //
  ///////////////////////
  for (let l of lines) {
    l.drawStations();
  }
}

class SubwayLine {
  constructor() {
    this.name = null;
    this.startX = null;
    this.startY = null;
    this.color = null;
    this.points = [];
    this.stationIdcs = [];
    this.stationNames = [];
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
    let lineIdx = 0;
    for (let stationIdx of this.stationIdcs) {
      let x = this.points[lineIdx][0];
      let y = this.points[lineIdx][1];
      if (stationIdx >= 0) {
        let x1 = this.startX + stationDist * x;
        let y1 = this.startY + stationDist * y;
        this.drawStation(x1, y1)
        text(this.stationNames[stationIdx], x1 + 30, y1 + 30)
      }
      lineIdx++;
    }
  }
  drawStation(x, y) {
    fill(0);
    circle(x, y, stationDiameter);
    fill(255);
    circle(x, y, stationDiameter / 2);
  }
}

function checkStationOverlap(lines) {
  let overlapStationNames = []
  let overlapData = []
  let overlapDataIdx = null;
  for (let l1 of lines) {
    console.log('l1 = '+l1.name)
    for (let l2 of lines) {
      console.log('l2 = '+l2.name)
      if (l1.name != l2.name) {
        for (let stationName of l1.stationNames) {
          if (l2.stationNames.includes(stationName)) {
            if (!overlapStationNames.includes(stationName)){
              // If stationName is not in overlapStationNames, add it! This will
              // be the first occurrence of stationName of at least two to be
              // stored in the same object in overlapData
              overlapStationNames.push(stationName)
              let l1Loc = getLocationByName(l1, stationName)
              console.log(
                'Overlapping station found on '+l1.name+' line at '+l1Loc
              )
              overlapData.push(
                {
                  'station' : stationName,
                  'lines' : [l1.name],
                  'points' : [l1Loc]
                }
              )
            }
            // Get the index of the name of the overlapping line in
            // overlapStationNames so the entry for this line can be added to
            // the same object in overlapData that corresponds to the first
            // found occurrence of stationName (after checking that it isn't
            // already there)
            overlapDataIdx = overlapStationNames.indexOf(stationName)
            if (!overlapData[overlapDataIdx]['lines'].includes(l2.name)) {
              let l2Loc = getLocationByName(l2, stationName)
              console.log(
                'Overlapping station found on '+l2.name+' line at '+l2Loc
              )
              overlapData[overlapDataIdx]['lines'].push(l2.name)
              overlapData[overlapDataIdx]['points'].push(l2Loc)
            }
          }
        }
      }
    }
  }
  return [overlapStationNames, overlapData]
}

function getLocationByName(l, stationName) {
  let stationNameIdx = l.stationNames.indexOf(stationName)
  let stationLocIdx = l.stationIdcs.indexOf(stationNameIdx)
  let stationLoc = l.points[stationLocIdx]
  return stationLoc
}

