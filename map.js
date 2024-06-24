let lineWidth = 10
let stationDist;
let stationPts = [];
let dcPts = [
  [1, 0], [4, 0],
  [5, 1], [5, 4],
  [4, 5], [1, 5],
  [1, 5], [0, 4],
  [0, 1], [1, 0]
]
let dcOffset = [];
let dcScale;
let ccPts = [
  [1, 0], [3, 0],
  [4, 1], [4, 4],
  [3, 5], [1, 5],
  [1, 5], [0, 4],
  [0, 1], [1, 0]
]
let ccOffset = [];
let ccScale;
let comicsPts = [
  [1, 0], [3, 0],
  [4, 1], [4, 4],
  [3, 5], [1, 5],
  [1, 5], [0, 4],
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
DEBUG = true;

function setup() {
  createCanvas(600, 400);
  // stationDist = height / 8;
  stationDist = height / 10;
  dcOffset = [width/6, height/4];
  stationPts.push( [width / 2, height / 2] );
}

function draw() {
  background(225);
  dcScale = [stationDist, stationDist];
  let [dcScaledX, dcScaledY] = drawLine(dcOffset, dcScale, dcPts, '#25b233');
  ccOffset[0] = max(dcScaledX) + lineWidth;
  ccOffset[1] = dcOffset[1];
  ccScale = [stationDist, stationDist];
  let [ccScaledX, ccScaledY] = drawLine(ccOffset, ccScale, ccPts, '#fad447');
  comicsOffset[0] = (
    min(dcScaledX)
    + 3/5 * (max(dcScaledX) - min(dcScaledX))
    + lineWidth
  );
  comicsOffset[1] = min(dcScaledY) - 2/5 * (max(dcScaledY) - min(dcScaledY));
  comicsScale = [stationDist, stationDist];
  let [comicsScaledX, comicsScaledY] = drawLine(comicsOffset, comicsScale, comicsPts, '#f7941d');
  poetryOffset[0] = (
    min(dcScaledX)
    + 3/5 * (max(dcScaledX) - min(dcScaledX))
    + lineWidth
  );
  poetryOffset[1] = (
    min(dcScaledY)
    + 3/5 * (max(dcScaledY) - min(dcScaledY))
    + lineWidth
  );
  poetryScale = [stationDist, stationDist];
  let [poetryScaledX, poetryScaledY] = drawLine(poetryOffset, poetryScale, poetryPts, '#0077c0');
  // Orange : Comics Line
  stationPts = [
    getScaledPt([2, 5], comicsOffset, comicsScale, extraOffsets=[-lineWidth/2, lineWidth/2])
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
