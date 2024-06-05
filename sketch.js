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
let mapDivWidth
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
	// Set up canvas
	console.log('Starting...');
  mapDivWidth = 500
	let canvas = createCanvas(mapDivWidth, mapDivWidth * 5/8);
  // Set size parameters based on canvas size
  stationDiameter = 0.03 * mapDivWidth;
  lineWidth = stationDiameter / 2;
  stationDist = 0.1 * mapDivWidth;
  hoverWeight = stationDiameter / 8;
  // Initialize subway lines
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
    let stationIdx = this.names.indexOf(name)
    let station = this.stations[stationIdx]
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
          // @ts-ignore
          this.stations[stationIdx].isOverlapping = false
          let x1 = this.startX + stationDist * x;
          let y1 = this.startY + stationDist * y;
          // @ts-ignore
          this.stations[stationIdx].location = [x1, y1]
          drawStation(x1, y1)
        }
        else {
          // @ts-ignore
          this.stations[stationIdx].isOverlapping = true
        }
      }
      idxAlongLine++;
    }
  }
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
        }
      } else if (selection != null && selection.type == 'hover') {
        selection = null
      }
    }
  }
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
  } else if (x - boxW > 0) {
    boxX = x - boxW
  } else {
    boxX = x - (boxW / 2)
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

function drawStation(x, y) {
  fill(0);
  circle(x, y, stationDiameter);
  fill(255);
  circle(x, y, stationDiameter / 2);
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

function keyPressed() {
  if (key === 's') {
    saveCanvas('smallweb-subway-progress.png')
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
        if (selection != null && selection.stationName === station.name) {
          // let station = getSelectedStation(lines, selection);
          console.log('Visiting station: '+station.name);
          window.open('https://'+station.url);
          mouseIsPressed = false;
        } else {
          console.log('Setting selection: ' + station.name)
          selection = {
            'lineName' : l.name,
            'stationName' : station.name,
            'type' : 'click'
          }
          drawInfoBox(l.name, station.name);
          isFound = true
        }
      }
      if (isFound) {
        // If marked as found, break out of loop through stations
        break;
      }
    }
    if (isFound) {
      // If marked as found, break out of loop through lines
      break;
    }
  }
  if (!isFound) {
    // If not marked as found after looping through each station of each line,
    // set the selection to null. This unselects the last station (or keeps it
    // unselected) if clicked beyond a station.
    selection = null;
  }
}

