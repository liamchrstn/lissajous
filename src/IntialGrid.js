// Utility function to get CSS variables
const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// Global variables
let w, h;                     // Cell dimensions
let angle = 0;               // Animation angle
const cols = 5;              // Grid columns
const rows = 5;              // Grid rows
const curves = [];           // Store curve points
let showGeneratorLines = false;
let speed = 0.03;
let isPaused = false;
let margin, r;               // Canvas margin and circle radius

// p5.js functions need to be global
window.setup = function() {
  // Setup canvas
  const appDiv = document.getElementById('app');
  const size = Math.min(appDiv.clientWidth, appDiv.clientHeight);
  const canvas = createCanvas(size, size);
  canvas.parent('app');

  // Initialize dimensions
  w = width / cols;
  h = height / rows;
  margin = width * 0.15;
  r = min(w, h) * 0.15;

  // Initialize curves grid
  for (let i = 0; i < cols; i++) {
    curves[i] = [];
    for (let j = 0; j < rows; j++) {
      curves[i][j] = [];
    }
  }

  // Initial drawing settings
  stroke(getCSSVar('--color-muted-purple'));
  noFill();
}

window.draw = function() {
  background(getCSSVar('--color-darker-gray'));
  
  // Arrays to store generator points
  const horizontalPoints = [];
  const verticalPoints = [];

  // Draw generator circles
  stroke(getCSSVar('--color-muted-purple'));
  strokeWeight(1);
  
  // Draw horizontal generator circles
  for (let i = 0; i < cols; i++) {
    const centerX = margin + w * (i + 0.5);
    const centerY = margin / 2;
    
    circle(centerX, centerY, r * 2);
    
    // Store points for later use
    const pointX = centerX + cos(angle * (i + 1)) * r;
    const pointY = centerY + sin(angle * (i + 1)) * r;
    horizontalPoints[i] = { x: pointX, y: pointY };
    
    fill(getCSSVar('--color-olive'));
    circle(pointX, pointY, 5);
    noFill();
  }

  // Draw vertical generator circles
  for (let j = 0; j < rows; j++) {
    const centerX = margin / 2;
    const centerY = margin + h * (j + 0.5);
    
    circle(centerX, centerY, r * 2);
    
    // Store points for later use
    const pointX = centerX + cos(angle * (j + 1)) * r;
    const pointY = centerY + sin(angle * (j + 1)) * r;
    verticalPoints[j] = { x: pointX, y: pointY };
    
    fill(getCSSVar('--color-olive'));
    circle(pointX, pointY, 5);
    noFill();
  }

  // Calculate and draw curves
  for (let i = 0; i < cols; i++) {
    // Calculate last row position for horizontal generator line
    const lastRowX = margin + w * (i + 0.5) + cos(angle * (i + 1)) * (r * 0.8);
    const lastRowY = margin + h * (rows - 0.5) + sin(angle * (rows)) * (r * 0.8);
    
    for (let j = 0; j < rows; j++) {
      const x = margin + w * (i + 0.5) + cos(angle * (i + 1)) * (r * 0.8);
      const y = margin + h * (j + 0.5) + sin(angle * (j + 1)) * (r * 0.8);
      
      if (!isPaused) {
        curves[i][j].push(createVector(x, y));
        if (curves[i][j].length > 100) {
          curves[i][j].shift();
        }
      }
      
      // Draw curves with fade effect
      noFill();
      for (let k = 0; k < curves[i][j].length - 1; k++) {
        const alpha = map(k, 0, curves[i][j].length - 1, 0, 255);
        stroke(color(getCSSVar('--color-olive') + hex(floor(alpha), 2)));
        strokeWeight(2);
        line(
          curves[i][j][k].x, 
          curves[i][j][k].y, 
          curves[i][j][k + 1].x, 
          curves[i][j][k + 1].y
        );
      }
    }
    
    // Draw averaged horizontal generator line extending to last row
    if (showGeneratorLines) {
      stroke(getCSSVar('--color-muted-purple'));
      strokeWeight(0.5);
      line(horizontalPoints[i].x, horizontalPoints[i].y, lastRowX, lastRowY);
    }
  }

  // Draw averaged vertical generator lines
  if (showGeneratorLines) {
    for (let j = 0; j < rows; j++) {
      // Calculate last column position for vertical generator line
      const lastColX = margin + w * (cols - 0.5) + cos(angle * cols) * (r * 0.8);
      const lastColY = margin + h * (j + 0.5) + sin(angle * (j + 1)) * (r * 0.8);
      
      stroke(getCSSVar('--color-muted-purple'));
      strokeWeight(2);
      line(verticalPoints[j].x, verticalPoints[j].y, lastColX, lastColY);
    }
  }

  angle += isPaused ? 0 : speed;
}

// Handle window resize
window.windowResized = function() {
  const appDiv = document.getElementById('app');
  const size = Math.min(appDiv.clientWidth, appDiv.clientHeight);
  resizeCanvas(size, size);
  w = width / cols;
  h = height / rows;
  margin = width * 0.15;
  r = min(w, h) * 0.15;

  // Clear curves when resizing
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      curves[i][j] = [];
    }
  }
}

// UI Control Functions
export function toggleGeneratorLines() {
  showGeneratorLines = !showGeneratorLines;
  const button = document.getElementById('toggleLines');
  button.innerHTML = showGeneratorLines ? 
    '<i class="nf nf-md-draw nf-oct-x"></i>' : 
    '<i class="nf nf-md-draw"></i>';
}

export function updateSpeed(value) {
  speed = parseFloat(value);
}

export function togglePause() {
  isPaused = !isPaused;
  const button = document.getElementById('pauseButton');
  button.innerHTML = isPaused ? 
    '<i class="nf nf-fa-play"></i>' : 
    '<i class="nf nf-fa-pause"></i>';

  // Handle curve points
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      curves[i][j] = [];
      if (isPaused) {
        // Generate full rotation points when paused
        for (let ang = 0; ang < TWO_PI; ang += TWO_PI / 360) {
          const x = margin + w * (i + 0.5) + cos((i + 1) * ang) * (r * 0.8);
          const y = margin + h * (j + 0.5) + sin((j + 1) * ang) * (r * 0.8);
          curves[i][j].push(createVector(x, y));
        }
      }
    }
  }
}

export function toggleSettings() {
  const controls = document.querySelector('.controls');
  const settingsButton = document.getElementById('settingsButton');
  controls.classList.toggle('visible');
  settingsButton.classList.toggle('active');
}

// Initialize by making functions globally available
window.toggleGeneratorLines = toggleGeneratorLines;
window.updateSpeed = updateSpeed;
window.togglePause = togglePause;
window.toggleSettings = toggleSettings;
