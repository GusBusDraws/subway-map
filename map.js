let lineWidth;
let stationDist;
let stations = [];
let dcWidth = 7;
let dcHeight = 7;
let dcPts = [
  [1, 0], [dcWidth - 2, 0],
  [dcWidth - 1, 1], [dcWidth - 1, dcHeight - 2],
  [dcWidth - 2, dcHeight - 1], [1, dcHeight - 1],
  [1, dcHeight - 1], [0, dcHeight - 2],
  [0, 1], [1, 0]
]
let dcOffset = [];
let dcScale;
let ccWidth = 5;
let ccHeight = 7;
let ccPts = [
  [1, 0], [ccWidth - 2, 0],
  [ccWidth - 1, 1], [ccWidth - 1, ccHeight - 2],
  [ccWidth - 2, ccHeight - 1], [1, ccHeight - 1],
  [1, ccHeight - 1], [0, ccHeight - 2],
  [0, 1], [1, 0]
]
let ccOffset = [];
let ccScale;
let comicsWidth = 6;
let comicsHeight = 7;
let comicsPts = [
  [1, 0], [comicsWidth - 3, 0],
  [comicsWidth - 2, 1], [comicsWidth - 2, comicsHeight - 2],
  [comicsWidth - 3, comicsHeight - 1], [1, comicsHeight - 1],
  [1, comicsHeight - 1], [0, comicsHeight - 2],
  [0, 1], [1, 0]
]
let comicsOffset = [];
let comicsScale;
let poetryPts = [
  [1, 0], [3, 0],
  [4, 1], [4, 3.15],
  [3.15, 4], [1, 4],
  [1, 4], [0, 3],
  [0, 1], [1, 0]
]
let poetryOffset = [];
let poetryScale;
let zinesWidth = 7;
let zinesHeight = 5;
let zinesPts = [
  [1, 0], [zinesWidth - 2, 0],
  [zinesWidth - 1, 1], [zinesWidth - 1, zinesHeight - 2],
  [zinesWidth - 2, zinesHeight - 1], [1, zinesHeight - 1],
  [1, zinesHeight - 1], [0, zinesHeight - 2],
  [0, 1], [1, 0]
]
let zinesOffset = [];
let zinesScale;
DEBUG = false;
let selection;

function setup() {
  // let canvas = createCanvas(600, 400);
  let canvasDiv = document.getElementById('map')
  let mapDivWidth = canvasDiv.offsetWidth;
	let canvas = createCanvas(mapDivWidth, mapDivWidth * 2/3);
  canvas.parent('map')
  // stationDist = height / 8;
  stationDist = height / 12;
  dcOffset = [width/6, height/4];
  lineWidth = width * 0.015
}

function draw() {
  background(225);
    //////////////////////////////
   // Green : Doodle Crew Line //
  //////////////////////////////
  dcScale = [stationDist, stationDist];
  let [dcScaledX, dcScaledY] = drawLine(dcOffset, dcScale, dcPts, '#25b233');
    //////////////////////////
   // Orange : Comics Line //
  //////////////////////////
  comicsOffset[0] = (
    min(dcScaledX)
    + 4 * (max(dcScaledX) - min(dcScaledX))/(dcWidth - 1)
    // - lineWidth
  )
  comicsOffset[1] = (
    min(dcScaledY)
    - 2 * (max(dcScaledY) - min(dcScaledY))/(dcHeight - 1)
    - lineWidth
  );
  comicsScale = [stationDist, stationDist];
  let [comicsScaledX, comicsScaledY] = drawLine(comicsOffset, comicsScale, comicsPts, '#f7941d');
    ////////////////////////
   // Blue : Zines Line //
  ////////////////////////
  zinesOffset[0] = (
    min(dcScaledX)
    + 3 * (max(dcScaledX)-min(dcScaledX)) / (dcWidth-1)
    // - lineWidth
  );
  zinesOffset[1] = (
    min(dcScaledY)
    + 4 * (max(dcScaledY)-min(dcScaledY)) / (dcHeight-1)
  );
  zinesScale = [stationDist, stationDist];
  let [zinesScaledX, zinesScaledY] = drawLine(zinesOffset, zinesScale, zinesPts, '#0077c0');
    ////////////////////////
   // Red : Poetry Line //
  ////////////////////////
  poetryOffset[0] = (
    min(dcScaledX)
    + 2 * (max(dcScaledX)-min(dcScaledX)) / (dcWidth-1)
    - lineWidth
  );
  poetryOffset[1] = (
    min(dcScaledY)
    + 2 * (max(dcScaledY)-min(dcScaledY)) / (dcHeight-1)
    - lineWidth
  );
  poetryScale = [stationDist, stationDist];
  let [poetryScaledX, poetryScaledY] = drawLine(poetryOffset, poetryScale, poetryPts, '#e51937');
  // Redraw green to put it over blue
  [dcScaledX, dcScaledY] = drawLine(dcOffset, dcScale, dcPts, '#25b233');
    //////////////////////////////////
   // Yellow : Creatives Club Line //
  //////////////////////////////////
  ccOffset[0] = max(dcScaledX) + lineWidth;
  ccOffset[1] = dcOffset[1];
  ccScale = [stationDist, stationDist];
  let [ccScaledX, ccScaledY] = drawLine(ccOffset, ccScale, ccPts, '#fad447');
    //////////////
   // Stations //
  //////////////
  stations = [
    // Map
    {
      'title' : 'Smallweb Subway',
      'url' : 'gusbus.space/smallweb-subway/',
      'owner' : 'Gus Becker',
      'pt' : getScaledPt([6, 4], dcOffset, dcScale, extraOffsets=[0, -lineWidth/2])
    },
    // Blue : Zines Line
    {
      "title" : "zines",
      "url" : "bumblechub.com/zines/",
      "owner" : "bumblechub",
      "pt" : getScaledPt([2, 4], zinesOffset, zinesScale, extraOffsets=[0, 0])
    },
    {
      "title" : "Mythical Type Zines",
      "url" : "mythicaltype.com/zines/",
      "owner" : "Mythical Type",
      "pt" : getScaledPt([4, 4], zinesOffset, zinesScale, extraOffsets=[0, 0]),
    },
    // Yellow : Creatives Club Line
    {
      "title" : "DoodleBot",
      "url" : "gusbus.space/doodlebot/",
      "owner" : "Gus Becker",
      "pt" : getScaledPt([0, 2], ccOffset, ccScale, extraOffsets=[-lineWidth/2, 0])
    },
    {
      "title" : "Creatives Club",
      "url" : "creativesclub.art/",
      "owner" : "Gus Becker",
      "pt" : getScaledPt([4, 2], ccOffset, ccScale, extraOffsets=[0, 0])
    },
    {
      "title" : "haystack blog and oddities",
      "url" : "thatoddhaystack.neocities.org/",
      "owner" : "vita",
      "pt" : getScaledPt([4, 4], ccOffset, ccScale, extraOffsets=[0, -lineWidth/2])
    },
    {
      "title" : "UR LOCAL CYBORG",
      "url" : "urlocalcyb.org/",
      "owner" : "cyborgforty",
      "pt" : getScaledPt([2, 6], ccOffset, ccScale, extraOffsets=[-lineWidth/2, 0])
    },
    // Orange : Comics Line
    {
      "title" : "Sunday Comics",
      "url" : "jazz-dude.com/Portfolio/SundayC.html",
      "owner" : "Jazz",
      "pt" : getScaledPt([0, 2], comicsOffset, comicsScale, extraOffsets=[0, lineWidth])
    },
    // Green : Doodle Crew Line
    {
      "title" : "jazz-dude.com",
      "url" : "jazz-dude.com/",
      "owner" : "Jazz",
      "pt" : getScaledPt([2, 6], dcOffset, dcScale, extraOffsets=[0, 0])
    },
    {
      "title" : "my art 2024",
      "url" : "uuupah.neocities.org/art/my-art-2024/",
      "owner" : "uuupah",
      "pt" : getScaledPt([0, 3], dcOffset, dcScale, extraOffsets=[0, 0])
    },
    // getScaledPt([0, 2], dcOffset, dcScale, extraOffsets=[0, 0]),
    // getScaledPt([0, 4], dcOffset, dcScale, extraOffsets=[0, 0]),
    // Red : Poetry Line
    {
      "title" : "poetry!",
      "url" : "columbidaecorner.neocities.org/poetry",
      "owner" : "columbidaecorner",
      "pt" : getScaledPt([0, 2], poetryOffset, poetryScale, extraOffsets=[0, 0])
    }
  ];
  drawStations(stations);
  checkStationHover();
  if (selection != null) {
    drawInfoBox(selection);
  }
}

function getScaledPt(pt, offsets, scales, extraOffsets=[0, 0]) {
  let x = offsets[0] + pt[0] * scales[0] + extraOffsets[0];
  let y = offsets[1] + pt[1] * scales[1] + extraOffsets[1];
  return [x, y];
}

function drawLine(offsets, scales, linePts, lineColor) {
  let scaledX = [];
  let scaledY = [];
  for (let i = 0; i < linePts.length - 1; i++) {
    stroke(lineColor);
    strokeWeight(lineWidth);
    let x1 = offsets[0] + scales[0] * linePts[i][0];
    let y1 = offsets[1] + scales[1] * linePts[i][1];
    let x2 = offsets[0] + scales[0] * linePts[i + 1][0];
    let y2 = offsets[1] + scales[1] * linePts[i + 1][1];
    line(x1, y1, x2, y2);
    if (DEBUG) {
      noStroke()
      fill(0)
      text(linePts[i], x1, y1)
    }
    scaledX.push(x1);
    scaledY.push(y1);
  }
  return [scaledX, scaledY];
}

function drawStations(stations) {
  for (let station of stations) {
    drawStation(station.pt[0], station.pt[1])
  }
}

function drawStation(x, y) {
  noStroke();
  fill(0);
  circle(x, y, lineWidth * 2);
  fill(255);
  circle(x, y, lineWidth);
}

function checkStationHover() {
  // for (let stationIdx = 0; stationIdx < stations.length; stationIdx++) {
  for (let station of stations) {
    let stationX = station.pt[0];
    let stationY = station.pt[1];
    let mouseDist = dist(mouseX, mouseY, stationX, stationY);
    if ((mouseDist < 2*lineWidth)) {
      selection = {
        'title' : station.title,
        'owner' : station.owner,
        'url' : station.url,
        'pt' : station.pt,
        'type' : 'hover'
      }
      drawInfoBox(selection)
      // If mouse is clicked while hovering, open the corresponding url
      if (mouseIsPressed && selection.type === 'hover') {
        console.log('Station clicked')
        window.open('https://'+station.url);
        mouseIsPressed = false;
      }
      break;
    } else {
      selection = null;
    }
  }
}

function drawInfoBox(selectedStation) {
  // let selectedStation = selectedLine.getStationBytitle(stationtitle)
  // let [x, y] = selectedStation.location
  let x = selectedStation.pt[0]
  let y = selectedStation.pt[1]
  let title = selectedStation.title
  let owner = selectedStation.owner
  let url = selectedStation.url
  strokeWeight(lineWidth / 2);
  stroke(255);
  fill(0, 0);
  circle(x, y, lineWidth * 2.5);
  fill(255);
  let boxW = 300;
  let boxH = 50;
  let boxX;
  let boxY;
  if (x + boxW < width) {
    boxX = x
  } else if (x - boxW > 10) {
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
  text(title + ' by ' +owner, boxX + 10, boxY + 10)
  text(url, boxX + 10, boxY + 30);
}

function mouseReleased() {
  let isFound = false;
  if (selection === undefined || selection.type != 'hover') {
    for (let station of stations) {
      let stationX = station.pt[0];
      let stationY = station.pt[1];
      let mouseDist = dist(mouseX, mouseY, stationX, stationY);
      if ((mouseDist < 4*lineWidth)) {
        selection = {
          'title' : station.title,
          'owner' : station.owner,
          'url' : station.url,
          'pt' : station.pt,
          'type' : 'touch'
        }
        drawInfoBox(selection)
        isFound = true;
        break;
      }
    }
    if (!isFound) {
      selection = undefined;
    }
  }
}
