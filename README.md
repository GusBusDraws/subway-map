# p5js-template
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

### 2024-05-19
- Add `checkStationOverlap` to return list of overlapping station data
- Change station structure to use index of line instead of trying to match the shape
### 2024-03-04
- Test a coordinate and array structure for lines
### 2024-01-30
- Ignore Node packages
- Add jsconfig for global p5 completion
- Remove JS directory
- Remove p5 files
