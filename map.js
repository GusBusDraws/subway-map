let lineWidth = 8
let stationDist;
let stationPts = [];
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
  [4, 1], [4, 3],
  [3, 4], [1, 4],
  [1, 4], [0, 3],
  [0, 1], [1, 0]
]
let poetryOffset = [];
let poetryScale;
DEBUG = false;

function setup() {
  createCanvas(600, 400);
  // stationDist = height / 8;
  stationDist = height / 12;
  dcOffset = [width/6, height/4];
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
   // Blue : Poetry Line //
  ////////////////////////
  poetryOffset[0] = (
    min(dcScaledX)
    + 4 * (max(dcScaledX)-min(dcScaledX)) / (dcWidth-1)
    // - lineWidth
  );
  poetryOffset[1] = (
    min(dcScaledY)
    + 4 * (max(dcScaledY)-min(dcScaledY)) / (dcHeight-1)
    // - lineWidth
  );
  poetryScale = [stationDist, stationDist];
  let [poetryScaledX, poetryScaledY] = drawLine(poetryOffset, poetryScale, poetryPts, '#0077c0');
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
  stationPts = [
    // Map
    getScaledPt([0, 4], ccOffset, ccScale, extraOffsets=[-lineWidth/2, -lineWidth/2]),
    // Yellow : Creatives Club Line
    getScaledPt([0, 2], ccOffset, ccScale, extraOffsets=[-lineWidth/2, 0]),
    getScaledPt([4, 2], ccOffset, ccScale, extraOffsets=[0, 0]),
    getScaledPt([4, 4], ccOffset, ccScale, extraOffsets=[0, -lineWidth/2]),
    // Orange : Comics Line
    getScaledPt([0, 2], comicsOffset, comicsScale, extraOffsets=[0,+lineWidth]),
    getScaledPt([2, 0], comicsOffset, comicsScale, extraOffsets=[0, 0]),
    // Green : Doodle Crew Line
    getScaledPt([2, 0], dcOffset, dcScale, extraOffsets=[0, 0]),
    getScaledPt([3, 6], dcOffset, dcScale, extraOffsets=[0, 0]),
    getScaledPt([0, 2], dcOffset, dcScale, extraOffsets=[0, 0]),
    getScaledPt([0, 4], dcOffset, dcScale, extraOffsets=[0, 0]),
    // Blue : Poetry Line
    getScaledPt([2, 4], poetryOffset, poetryScale, extraOffsets=[lineWidth/2, 0]),
  ];
  drawStations(stationPts);
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

function drawStations(stationPts) {
  for (let pt of stationPts) {
    drawStation(pt[0], pt[1])
  }
}

function drawStation(x, y) {
  noStroke();
  fill(0);
  circle(x, y, lineWidth * 2);
  fill(255);
  circle(x, y, lineWidth);
}
