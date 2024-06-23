let lineWidth = 10
let stationDist = 50
let stationPts = [
  [300, 400]
];
let dcPts = [
  [1, 0], [4, 0],
  [5, 1], [5, 4],
  [4, 5], [1, 5],
  [1, 5], [0, 4],
  [0, 1], [1, 0]
]
let dcOffset = [100, 100];

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  drawLine(dcOffset, dcPts, [0, 0, 255]);
  drawStations(stationPts);
}

function drawLine(offset, linePts, lineColor) {
  stroke(lineColor);
  strokeWeight(lineWidth);
  for (let i = 0; i < linePts.length - 1; i++) {
    let x1 = offset[0] + stationDist * linePts[i][0];
    let y1 = offset[1] + stationDist * linePts[i][1];
    let x2 = offset[0] + stationDist * linePts[i + 1][0];
    let y2 = offset[1] + stationDist * linePts[i + 1][1];
    line(x1, y1, x2, y2);
  }
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
