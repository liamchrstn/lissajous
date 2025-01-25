const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

let singleSketch = function(p) {
    let points = [];
    const freqX = 3;  // Frequency ratio X
    const freqY = 2;  // Frequency ratio Y
    const phase = p.PI / 2;  // Phase difference
    let size;
    let maxDim = 0; // Track maximum dimension for scaling
    
    // Generate points for the curve and find max dimension
    const generatePoints = () => {
        points = [];
        maxDim = 0;
        for (let angle = 0; angle < p.TWO_PI; angle += 0.01) {
            const x = p.sin(freqX * angle + phase);
            const y = p.sin(freqY * angle);
            points.push({x, y});
            maxDim = Math.max(maxDim, Math.abs(x), Math.abs(y));
        }
    };
    
    p.setup = function() {
        const appDiv = document.getElementById('app');
        size = Math.min(appDiv.clientWidth * 0.2, appDiv.clientHeight * 0.2);
        const canvas = p.createCanvas(size, size);
        canvas.parent('single-curve');
        generatePoints();
    };
    
    p.draw = function() {
        p.clear(); // Makes background transparent
        p.translate(size/2, size/2);  // Center the curve
        
        // Scale dynamically to fit the canvas with small padding
        const scale = (size * 0.85) / (2 * maxDim); // 85% of half canvas size
        
        p.stroke(getCSSVar('--color-olive'));
        p.strokeWeight(2);
        p.noFill();
        
        p.beginShape();
        for (let point of points) {
            p.vertex(point.x * scale, point.y * scale);
        }
        p.endShape();
    };
    
    p.windowResized = function() {
        const appDiv = document.getElementById('app');
        size = Math.min(appDiv.clientWidth * 0.2, appDiv.clientHeight * 0.2);
        p.resizeCanvas(size, size);
        generatePoints(); // Ensure points are regenerated for proper scaling
    };
};

// Create a new p5 instance for the single curve
new p5(singleSketch);
