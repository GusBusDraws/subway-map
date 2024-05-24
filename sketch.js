// @ts-check
/// <reference path="./node_modules/@types/p5/global.d.ts" />
let greenStations = [
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
    "name" : "Smallweb Subway",
    "url" : "gusbus.space/smallweb-subway/",
    "owner" : "Gus Becker"
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
let yellowStations = [
  {
    "name" : "Creatives Club",
    "url" : "creativesclub.art",
    "owner" : "Gus Becker"
  },
  {
    "name" : "urlocalcyb.org",
    "url" : "urlocalcyb.org",
    "owner" : "cyborgforty"
  },
  {
    "name" : "haystack blog and oddities",
    "url" : "thatoddhaystack.neocities.org",
    "owner" : "vita"
  },
  {
    "name" : "Smallweb Subway",
    "url" : "gusbus.space/smallweb-subway/",
    "owner" : "Gus Becker"
  }
];
let stationDiameter = 30;
let lineWidth = stationDiameter / 2;
let stationDist = 100;
let greenLine, yellowLine;
let lines;
let overlappingStations;
let overlapData;
let hoverWeight = stationDiameter / 8;

function setup() {
	console.log('Starting...');
	// createCanvas(windowWidth, windowHeight);
	createCanvas(1000, 500);
	// noLoop();
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
     0, -1,  1,
    -1,  2, -1,
     3, -1,  4,
    -1,  5, -1,
    -1
  ]
  // greenLine.stationNames = [
  //   'A', 'B', 'C', 'D', 'E'
  // ]
  // Populate Green Line station names from JSON
  for (let station of greenStations) {
    greenLine.titles.push(station.name)
    greenLine.urls.push(station.url)
    greenLine.authors.push(station.owner)
  }
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
  // yellowLine.stationNames = [
  //   'F', 'G', 'H', 'B'
  // ]
  // Populate Yellow Line station names from JSON
  for (let station of yellowStations) {
    yellowLine.titles.push(station.name)
    yellowLine.urls.push(station.url)
    yellowLine.authors.push(station.owner)
  }
  lines = [greenLine, yellowLine];
}

function draw() {
	background(100);
  drawMap(lines);
  checkStationHover(lines);
}

function drawMap(lines) {
    ///////////////////
   // Draw the line //
  ///////////////////
  for (let l of lines) {
    l.drawLine();
  }
  [overlappingStations, overlapData] = checkStationOverlap(lines)
    ///////////////////////
   // Draw the stations //
  ///////////////////////
  for (let l of lines) {
    l.drawStations(overlappingStations);
  }
    ///////////////////////////////
   // Draw overlapping stations //
  ///////////////////////////////
  drawOverlappingStations(overlapData)
}

function checkStationHover(lines) {
  for (let l of lines) {
    for (let i = 0; i < l.stationIdcs.length; i++) {
      let pt = l.points[i]
      let stationIdx = l.stationIdcs[i]
      let title = l.titles[stationIdx]
      let url = l.urls[stationIdx]
      let author = l.authors[stationIdx]
      let stationX;
      let stationY;
      // Check if station is an overlapping station
      if (overlappingStations.includes(url)) {
        let overlapIdx = overlappingStations.indexOf(url);
        let station = overlapData[overlapIdx];
        [stationX, stationY] = getOverlappingStationCoord(station)
      } else {
        stationX = l.startX + stationDist * pt[0];
        stationY = l.startY + stationDist * pt[1];
      }
      let mouseDist = dist(mouseX, mouseY, stationX, stationY);
      if ((mouseDist < stationDiameter / 2) && (l.stationIdcs[i] >= 0)) {
        onHover(stationX, stationY, title, url, author);
        // If mouse is clicked while hovering, open the corresponding url
        if (mouseIsPressed) {
          window.open('https://'+url)
        }
      }
    }
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
    this.titles = [];
    this.urls = [];
    this.authors = [];
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
  drawStations(overlappingStations) {
    noStroke();
    let idxAlongLine = 0;
    for (let stationIdx of this.stationIdcs) {
      let stationURL = this.urls[stationIdx]
      if (!overlappingStations.includes(stationURL)) {
        let x = this.points[idxAlongLine][0];
        let y = this.points[idxAlongLine][1];
        if (stationIdx >= 0) {
          let x1 = this.startX + stationDist * x;
          let y1 = this.startY + stationDist * y;
          drawStation(x1, y1)
        }
      }
      idxAlongLine++;
    }
  }
}

function drawStation(x, y) {
  fill(0);
  circle(x, y, stationDiameter);
  fill(255);
  circle(x, y, stationDiameter / 2);
}

function checkStationOverlap(lines) {
  let overlapStationURLs = []
  let overlapData = []
  let overlapDataIdx = null;
  for (let l1 of lines) {
    for (let l2 of lines) {
      if (l1.name != l2.name) {
        for (let url of l1.urls) {
          if (l2.urls.includes(url)) {
            if (!overlapStationURLs.includes(url)){
              // If url is not in overlapStationURLs, add it! This will
              // be the first occurrence of url of at least two to be
              // stored in the same object in overlapData
              overlapStationURLs.push(url)
              let l1Loc = getLocationByURL(l1, url)
              overlapData.push(
                {
                  'url' : url,
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
            overlapDataIdx = overlapStationURLs.indexOf(url)
            if (!overlapData[overlapDataIdx]['lines'].includes(l2.name)) {
              let l2Loc = getLocationByURL(l2, url)
              overlapData[overlapDataIdx]['lines'].push(l2.name)
              overlapData[overlapDataIdx]['points'].push(l2Loc)
            }
          }
        }
      }
    }
  }
  return [overlapStationURLs, overlapData]
}

function getLocationByURL(l, url) {
  let stationURLIdx = l.urls.indexOf(url)
  let stationLocIdx = l.stationIdcs.indexOf(stationURLIdx)
  let stationLoc = l.points[stationLocIdx]
  let stationCoord = [
    l.startX + stationDist * stationLoc[0],
    l.startY + stationDist * stationLoc[1]
  ]
  return stationCoord
}

function drawOverlappingStations(overlapData) {
  for (let station of overlapData) {
    let [avgX, avgY] = getOverlappingStationCoord(station);
    drawStation(avgX, avgY)
  }
}

function getOverlappingStationCoord(station) {
  let avgX = 0;
  let avgY = 0;
  for (let pt of station.points) {
    avgX += pt[0];
    avgY += pt[1];
  }
  avgX /= station.points.length
  avgY /= station.points.length
  return [avgX, avgY]
}

function onHover(stationX, stationY, title, url, author) {
  strokeWeight(hoverWeight);
  stroke(255);
  fill(0, 0);
  circle(stationX, stationY, stationDiameter + hoverWeight);
  fill(255);
  let boxW = 300;
  let boxH = 50;
  let boxX;
  let boxY;
  if (stationX + boxW < width) {
    boxX = stationX
  } else {
    boxX = stationX - boxW
  }
  if (stationY + 30 + boxH < height) {
    boxY = stationY + 30
  } else {
    boxY = stationY - boxH - 30
  }
  rect(boxX, boxY, 300, 50);
  noStroke();
  fill(0);
  textFont('Consolas')
  textStyle(BOLD)
  textAlign(LEFT, TOP)
  text(title + ' by ' +author, boxX + 10, boxY + 10)
  text(url, boxX + 10, boxY + 30)
}

function keyPressed() {
  if (key === 's') {
    saveCanvas('smallweb-subway-progress.png')
  }
}

