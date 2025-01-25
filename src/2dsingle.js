const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

let singleSketch = function(p) {
    let points = [];
    const freqX = 3;  // Frequency ratio X
    const freqY = 2;  // Frequency ratio Y
    const phase = p.PI / 2;  // Phase difference
    let size;
    
    p.setup = function() {
        const appDiv = document.getElementById('app');
        size = Math.min(appDiv.clientWidth, appDiv.clientHeight) * 0.2; // 20% of app size
        const canvas = p.createCanvas(size, size);
        canvas.parent('single-curve');
        
        // Generate points for the full curve
        for (let angle = 0; angle < p.TWO_PI; angle += 0.01) {
            const x = p.sin(freqX * angle + phase);
            const y = p.sin(freqY * angle);
            points.push({x, y});
        }
    };
    
    p.draw = function() {
        p.background(getCSSVar('--color-darker-gray'));
        p.translate(size/2, size/2);  // Center the curve
        
        // Scale to fit the canvas with padding
        const scale = size * 0.4;
        
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
        size = Math.min(appDiv.clientWidth, appDiv.clientHeight);
        p.resizeCanvas(size, size);
    };
};

// Create a new p5 instance for the single curve
new p5(singleSketch);
