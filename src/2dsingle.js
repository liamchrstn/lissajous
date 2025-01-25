const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

let singleSketch = function(p) {
    let points = [];
    const freqX = 3;  // Frequency ratio X
    const freqY = 2;  // Frequency ratio Y
    const phase = p.PI / 2;  // Phase difference
    // Generate points for the curve
    const generatePoints = () => {
        points = [];
        for (let angle = 0; angle < p.TWO_PI; angle += 0.01) {
            const x = p.sin(freqX * angle + phase);
            const y = p.sin(freqY * angle);
            points.push({x, y});
        }
    };
    
    p.setup = function() {
        const canvas = p.createCanvas(400, 400); // Fixed size canvas
        canvas.parent('single-curve');
        generatePoints();
    };
    
    p.draw = function() {
        p.clear(); // Makes background transparent
        p.translate(200, 200);  // Center the curve
        
        p.stroke(getCSSVar('--color-olive'));
        p.strokeWeight(2);
        p.noFill();
        
        p.beginShape();
        for (let point of points) {
            // Scale points to fit within canvas while preserving padding
            p.vertex(point.x * 170, point.y * 170); // 170 = (400/2) * 0.85
        }
        p.endShape();
    };
};

// Create a new p5 instance for the single curve
new p5(singleSketch);
