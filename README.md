# subway-map
This is a template for creating new p5 projects. This template is based on
the p5 + VS Code setup as
[published by Stef Tervelde and Raphaël de Courville](https://sableraph.notion.site/The-perfect-p5-js-VSCode-setup-for-everyday-creative-coding-414c7eb4fb524da28d53763777d427b8),
which assumes that p5 will be installed using [Node.js](https://nodejs.org/en).

## Installation
To install p5 to use with this template, first check that Node.js is installed:
```bash
node --version
```

If Node returns the version, make sure you have navigated to the project
directory and initialize a new Node package:
```bash
npm init -y
```

Then, download & install the p5 package:
```bash
npm install @types/p5
```

## Change Log

### 2024-06-18
- Link canvas to div with id = 'map'
- Update yellow to '#fad447'
- Update green to '#25b233'
- Update selection to count number of clicks to test `mousePressed` on mobile
### 2024-06-04
- Add condition for placing the center of the info box under the station
- Reorganize functions alphabetically
- Click to visit works with and without hover (desktop and mobile)
### 2024-06-03
- Added hover to view info in addition to click
- Identify bug making shared website names problematic
- Fix bug preventing info boxes from being drawn
### 2024-06-01
- Add SubwayLine.stations properties to hold info like station locations
### 2024-05-24
- Replace hover box with box when clicked
- Link to station URL when clicked while hovering
- Make position of info box dynamic
- Add info box on hover
- Add station highlight on hover
### 2024-05-19
- Add `drawOverlappingStations` to draw only one station when it is shared across multiple lines
- Add `keyPressed` command for saving progress images when 's' is typed
- Add `checkStationOverlap` to return list of overlapping station data
- Change station structure to use index of line instead of trying to match the shape
### 2024-03-04
- Test a coordinate and array structure for lines
### 2024-01-30
- Ignore Node packages
- Add jsconfig for global p5 completion
- Remove JS directory
- Remove p5 files
