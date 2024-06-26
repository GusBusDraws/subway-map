// @ts-check
/// <reference path="./node_modules/@types/p5/global.d.ts" />
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
let DEBUG = false;
let selection;

function setup() {
  // let canvas = createCanvas(600, 400);
  let canvasDiv = document.getElementById('map')
  // @ts-ignore: Object is possibly 'null'.
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
      'pt' : getScaledPt([6, 4], dcOffset, dcScale, [0, -lineWidth/2])
    },
    // Blue : Zines Line
    {
      "title" : "zines",
      "url" : "bumblechub.com/zines/",
      "owner" : "bumblechub",
      "pt" : getScaledPt([2, 4], zinesOffset, zinesScale, [0, 0])
    },
    {
      "title" : "Mythical Type Zines",
      "url" : "mythicaltype.com/zines/",
      "owner" : "Mythical Type",
      "pt" : getScaledPt([4, 4], zinesOffset, zinesScale, [0, 0]),
    },
    // Yellow : Creatives Club Line
    {
      "title" : "DoodleBot",
      "url" : "gusbus.space/doodlebot/",
      "owner" : "Gus Becker",
      "pt" : getScaledPt([0, 2], ccOffset, ccScale, [-lineWidth/2, 0])
    },
    {
      "title" : "Creatives Club",
      "url" : "creativesclub.art/",
      "owner" : "Gus Becker",
      "pt" : getScaledPt([4, 2], ccOffset, ccScale, [0, 0])
    },
    {
      "title" : "haystack blog and oddities",
      "url" : "thatoddhaystack.neocities.org/",
      "owner" : "vita",
      "pt" : getScaledPt([4, 4], ccOffset, ccScale, [0, -lineWidth/2])
    },
    {
      "title" : "UR LOCAL CYBORG",
      "url" : "urlocalcyb.org/",
      "owner" : "cyborgforty",
      "pt" : getScaledPt([2, 6], ccOffset, ccScale, [-lineWidth/2, 0])
    },
    // Orange : Comics Line
    {
      "title" : "Sunday Comics",
      "url" : "jazz-dude.com/Portfolio/SundayC.html",
      "owner" : "Jazz",
      "pt" : getScaledPt([0, 2], comicsOffset, comicsScale, [0, lineWidth])
    },
    // Green : Doodle Crew Line
    {
      "title" : "jazz-dude.com",
      "url" : "jazz-dude.com/",
      "owner" : "Jazz",
      "pt" : getScaledPt([2, 6], dcOffset, dcScale, [0, 0])
    },
    {
      "title" : "my art 2024",
      "url" : "uuupah.neocities.org/art/my-art-2024/",
      "owner" : "uuupah",
      "pt" : getScaledPt([0, 3], dcOffset, dcScale, [0, 0])
    },
    // getScaledPt([0, 2], dcOffset, dcScale, extraOffsets=[0, 0]),
    // getScaledPt([0, 4], dcOffset, dcScale, extraOffsets=[0, 0]),
    // Red : Poetry Line
    {
      "title" : "poetry!",
      "url" : "columbidaecorner.neocities.org/poetry",
      "owner" : "columbidaecorner",
      "pt" : getScaledPt([0, 2], poetryOffset, poetryScale, [0, 0])
    }
  ];
  drawStations(stations);
  drawLegend();
  checkStationHover();
  if (selection != null) {
    drawInfoBox(selection);
  }
  drawTimestamp();
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

function drawLegend() {
  let lineColors = ['#0077c0', '#25b233', '#fad447', '#f7941d', '#e51937'];
  let lineNames = ['Zines', 'Doodle Crew', 'Creatives Club', 'Comics', 'Poetry'];
  let nLines = lineColors.length;
  textSize(0.017 * width)
  textFont('Consolas')
  textAlign(LEFT, TOP);
  noStroke();
  fill(255);
  let legendWidth = 0.21*width
  let legendHeight = (2*nLines+1)*lineWidth
  let legendX = width - legendWidth - lineWidth;
  let legendY = height - legendHeight - lineWidth;
  rect(legendX, legendY, legendWidth, legendHeight);
  for (let i = 0; i < nLines; i++) {
    let itemX = legendX + lineWidth;
    let itemY = legendY+(2*i+1)*lineWidth;
    fill(lineColors[i]);
    rect(itemX, itemY, 2*lineWidth, lineWidth);
    fill(0);
    text(lineNames[i], itemX+3*lineWidth, itemY)
  }
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
        'type' : 'hover',
        'boxXMin' : undefined,
        'boxYMin' : undefined,
        'boxXMax' : undefined,
        'boxYMax' : undefined,
      }
      drawInfoBox(selection)
      // If mouse is clicked while hovering, open the corresponding url
      if (mouseIsPressed && touches.length == 0) {
        console.log('Station clicked')
        window.open('https://'+station.url);
        // Needed to insure only one page is opened
        mouseIsPressed = false;
      }
      break;
    } else {
      selection = undefined;
    }
  }
}

function drawInfoBox(selection) {
  // let selectedStation = selectedLine.getStationBytitle(stationtitle)
  // let [x, y] = selectedStation.location
  let x = selection.pt[0]
  let y = selection.pt[1]
  let title = selection.title
  let owner = selection.owner
  let url = selection.url
  strokeWeight(lineWidth / 2);
  stroke(255);
  fill(0, 0);
  circle(x, y, lineWidth * 2.5);
  fill(255);
  let boxW = 26 * lineWidth;
  let boxH = 5 * lineWidth;
  let boxX;
  let boxY;
  if (x + boxW < width) {
    boxX = x + 1.5*lineWidth
  } else if (x - boxW > lineWidth) {
    boxX = x - boxW - 1.5*lineWidth
  } else {
    boxX = x - (boxW / 2)
  }
  if (y + 30 + boxH < height) {
    boxY = y + 2.5*lineWidth
  } else {
    boxY = y - boxH - 2.5*lineWidth
  }
  selection.boxXMin = boxX;
  selection.boxYMin = boxY;
  selection.boxXMax = boxX + boxW;
  selection.boxYMax = boxY + boxH;
  rect(boxX, boxY, boxW, boxH);
  noStroke();
  fill(0);
  textSize(0.017 * width)
  textFont('Consolas')
  textAlign(LEFT, TOP)
  text(title + ' by ' +owner, boxX + lineWidth, boxY + lineWidth)
  text(url, boxX + lineWidth, boxY + 3*lineWidth);
}

function touchStarted() {
  let isFound = false;
  if (selection != undefined && touches.length > 0) {
    for (let station of stations) {
      if (
        (mouseX > selection.boxXMin && mouseX < selection.boxXMax)
        && (mouseY > selection.boxYMin && mouseY < selection.boxYMax)
      ) {
        console.log('Station clicked')
        window.open('https://'+selection.url);
        isFound = true;
        // Needed to insure only one page is opened
        mouseIsPressed = false;
        break;
      }
    }
  } else if (selection === undefined || selection.type != 'hover') {
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

function drawTimestamp() {
  fill(0);
  text('debug timestamp: 2024-06-26 18:10:00', lineWidth, lineWidth)
}
