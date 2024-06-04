// @ts-check
/// <reference path="./node_modules/@types/p5/global.d.ts" />
let greenJSON = [
  {
    "name" : "DoodleBot",
    "url" : "gusbus.space/doodlebot/",
    "owner" : "Gus Becker"
  },
  {
    "name" : "Jazz's Doodles",
    "url" : "jazz-dude.com/Portfolio/doodles.html",
    "owner" : "Jazz"
  },
  {
    "name" : "Smallweb Subway",
    "url" : "gusbus.space/smallweb-subway/",
    "owner" : "Gus Becker"
  },
  {
    "name" : "Megan's Doodles",
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
let yellowJSON = [
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
let currentBox;
let selection;

function setup() {
	console.log('Starting...');
	// noLoop();
	// createCanvas(windowWidth, windowHeight);
	createCanvas(1000, 500);
  greenLine = new SubwayLine(greenJSON);
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
  for (let station of greenJSON) {
    greenLine.names.push(station.name)
    greenLine.urls.push(station.url)
    greenLine.owners.push(station.owner)
  }
  yellowLine = new SubwayLine(yellowJSON);
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
  for (let station of yellowJSON) {
    yellowLine.names.push(station.name)
    yellowLine.urls.push(station.url)
    yellowLine.owners.push(station.owner)
  }
  lines = [greenLine, yellowLine];
}

function draw() {
	background(100);
  drawMap(lines);
  checkStationHover(lines);
  if (selection != null) {
    console.log('Drawing selection')
    drawInfoBox(selection.lineName, selection.stationName);
  }
}

function drawMap(lines) {
  // Draw the line //
  for (let l of lines) {
    l.drawLine();
  }
  [overlappingStations, overlapData] = checkStationOverlap(lines)
  // Draw the stations //
  for (let l of lines) {
    l.drawStations(overlappingStations);
  }
  // Draw overlapping stations //
  drawOverlappingStations(overlapData)
}

function checkStationHover(lines) {
  for (let l of lines) {
    for (let stationIdx = 0; stationIdx < l.stations.length; stationIdx++) {
      let station = l.stations[stationIdx]
      let stationX = station.location[0];
      let stationY = station.location[1];
      let mouseDist = dist(mouseX, mouseY, stationX, stationY);
      if ((mouseDist < stationDiameter / 2)) {
        selection = {
          'lineName' : l.name,
          'stationName' : station.name,
          'type' : 'hover'
        }
        drawInfoBox(selection.lineName, selection.stationName)
        // If mouse is clicked while hovering, open the corresponding url
        if (mouseIsPressed) {
          console.log('Station clicked')
          window.open('https://'+station.url);
          mouseIsPressed = false;
          // onStationClick(stationX, stationY, name, url, owner);
          // if (currentBox != null && currentBox[3] === url) {
          //   console.log('Visiting site')
          // } else {
          //   console.log('Setting currentBox')
          //   currentBox = onStationClick(stationX, stationY, name, url, owner);
          // }
        }
      } else if (selection != null && selection.type == 'hover') {
        selection = null
      }
    }
  }
}

function mouseReleased() {
  let isFound = false;
  for (let l of lines) {
    for (let stationIdx = 0; stationIdx < l.stations.length; stationIdx++) {
      let station = l.stations[stationIdx]
      let mouseDist = dist(
        mouseX, mouseY, station.location[0], station.location[1]
      );
      // If mouse is within the radius of a station AND the station index is
      // non-zero, i.e. a station point and not a line point, set the station
      // bow to be drawn by drawStationBox()
      if ((mouseDist < stationDiameter / 2)) {
        // if (currentBox != null && currentBox[3] === station.url) {
        //   // BUG: overlapping stations are immediately opened. Instead of this
        //   // double click situation, maybe it would be better to open the site when
        //   // the box is clicked
        //   console.log('Visiting site')
        //   window.open('https://'+station.url)
        // } else {
        console.log('Setting selection: ' + station.name)
        selection = {
          'lineName' : l.name,
          'stationName' : station.name,
          'type' : 'click'
        }
        drawInfoBox(l.name, station.name);
        isFound = true
        break;
      }
    }
  }
  if (!isFound) {
    selection = null;
  }
}

class SubwayLine {
  constructor(propJSON) {
    this.name = null;
    this.startX = null;
    this.startY = null;
    this.color = null;
    this.points = [];
    this.stationIdcs = [];
    this.names = [];
    this.urls = [];
    this.owners = [];
    this.stations = []
    for (let i = 0; i < propJSON.length; i++) {
      this.stations.push(
        {
          'name' : propJSON[i].name,
          'url' : propJSON[i].url,
          'owner' : propJSON[i].owner,
          'location' : null,
          'isOverlapping' : null
        }
      )
    }
  }
  getStationByName(name) {
    console.log('getting station by name: '+name)
    let stationIdx = this.names.indexOf(name)
    console.log('found stationIdx: '+stationIdx)
    let station = this.stations[stationIdx]
    console.log('found station:')
    console.log(station)
    return station
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
      // stationIdx will have a non-negative value if that location along the
      // line corresponds to a station. That value is the
      // position of the corresponding station in the SubwayLine.stations
      // properties array
      if (stationIdx >= 0) {
        let x = this.points[idxAlongLine][0];
        let y = this.points[idxAlongLine][1];
        if (!overlappingStations.includes(stationURL)) {
          this.stations[stationIdx].isOverlapping = false
          let x1 = this.startX + stationDist * x;
          let y1 = this.startY + stationDist * y;
          this.stations[stationIdx].location = [x1, y1]
          drawStation(x1, y1)
        }
        else {
          this.stations[stationIdx].isOverlapping = true
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
    // Add location of overlapping station to station properties
    for (let l of lines) {
      if (station.lines.includes(l.name)) {
        let stationIdx = l.urls.indexOf(station.url)
        l.stations[stationIdx].location = [avgX, avgY]
      }
    }
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

function drawInfoBox(lineName, stationName) {
  let selectedLine;
  for (let l of lines) {
    if (l.name == lineName) {
      selectedLine = l
      break;
    }
  }
  console.log('selectedLine:')
  console.log(selectedLine)
  let selectedStation = selectedLine.getStationByName(stationName)
  console.log('selectedStation:')
  console.log(selectedStation)
  let [x, y] = selectedStation.location
  strokeWeight(hoverWeight);
  stroke(255);
  fill(0, 0);
  circle(x, y, stationDiameter + hoverWeight);
  fill(255);
  let boxW = 300;
  let boxH = 50;
  let boxX;
  let boxY;
  if (x + boxW < width) {
    boxX = x
  } else {
    boxX = x - boxW
  }
  if (y + 30 + boxH < height) {
    boxY = y + 30
  } else {
    boxY = y - boxH - 30
  }
  rect(boxX, boxY, 300, 50);
  noStroke();
  fill(0);
  textFont('Consolas')
  textStyle(BOLD)
  textAlign(LEFT, TOP)
  text(selectedStation.name + ' by ' +selectedStation.owner, boxX + 10, boxY + 10)
  text(selectedStation.url, boxX + 10, boxY + 30);
  // let a = createA('https://'+url, url, '_blank');
  // a.position(boxX + 10, boxY + 50);
}

function drawStationBox() {
  let [stationX, stationY, name, url, owner] = currentBox
  removeElements();
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
  text(name + ' by ' +owner, boxX + 10, boxY + 10)
  text(url, boxX + 10, boxY + 30);
  // let a = createA('https://'+url, url, '_blank');
  // a.position(boxX + 10, boxY + 50);
}

function keyPressed() {
  if (key === 's') {
    saveCanvas('smallweb-subway-progress.png')
  }
}

