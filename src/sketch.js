// Get CSS variables for colors
const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

let w, h; // Width and height of each cell
let angle = 0; // Current angle for animation
const cols = 5; // Number of columns
const rows = 5; // Array to store curve points
const curves = [];

function setup() {
  // Create canvas that fits in the app div
  const appDiv = document.getElementById('app');
  const size = Math.min(appDiv.clientWidth, appDiv.clientHeight);
  const canvas = createCanvas(size, size);
  canvas.parent('app');

  // Calculate cell size
  w = width / cols;
  h = height / rows;

  // Initialize curves array
  for (let i = 0; i < cols; i++) {
    curves[i] = [];
    for (let j = 0; j < rows; j++) {
      curves[i][j] = [];
    }
  }

  // Set drawing properties
  stroke(getCSSVar('--color-muted-purple'));
  noFill();
}

function draw() {
  background(getCSSVar('--color-darker-gray'));
  
  const margin = width * 0.15;
  const r = min(w, h) * 0.15;

  // Calculate and draw curves
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = margin + w * (i + 0.5) + cos(angle * (i + 1)) * (r * 0.8);
      const y = margin + h * (j + 0.5) + sin(angle * (j + 1)) * (r * 0.8);
      
      curves[i][j].push(createVector(x, y));
      
      if (curves[i][j].length > 100) {
        curves[i][j].shift();
      }
      
      // Draw curve with fade effect
      noFill();
      for (let k = 0; k < curves[i][j].length - 1; k++) {
        const alpha = map(k, 0, curves[i][j].length - 1, 0, 255);
        stroke(color(getCSSVar('--color-olive') + hex(floor(alpha), 2)));
        strokeWeight(1.5);
        line(
          curves[i][j][k].x, 
          curves[i][j][k].y, 
          curves[i][j][k + 1].x, 
          curves[i][j][k + 1].y
        );
      }
    }
  }

  angle += 0.03;
}

// Handle window resize
function windowResized() {
  const appDiv = document.getElementById('app');
  const size = Math.min(appDiv.clientWidth, appDiv.clientHeight);
  resizeCanvas(size, size);
  w = width / cols;
  h = height / rows;

  // Clear curves when resizing
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      curves[i][j] = [];
    }
  }
}
