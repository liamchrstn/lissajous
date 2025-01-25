const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

let singleSketch = function(p) {
    let points = [];
    let params = {
        freqX: 3,
        freqY: 2,
        ampX: 1,
        ampY: 1,
        phase: p.PI / 2
    };
    let isPlaying = false;
    let currentTime = 0;

    const generatePoints = () => {
        points = [];
        for (let angle = 0; angle < p.TWO_PI; angle += 0.01) {
            const x = params.ampX * p.sin(params.freqX * angle + params.phase);
            const y = params.ampY * p.sin(params.freqY * angle);
            points.push({x, y});
        }
    };

    const updateTime = (time) => {
        currentTime = time;
        document.getElementById('time-value').textContent = currentTime.toFixed(2);
        document.getElementById('timeSlider').value = currentTime;
    };

    const togglePlayPause = () => {
        isPlaying = !isPlaying;
        const btn = document.getElementById('playPauseTime');
        btn.innerHTML = `<i class="nf nf-fa-${isPlaying ? 'pause' : 'play'}"></i>`;
    };

    const updateParams = () => {
        params.ampX = parseFloat(document.getElementById('ampX').value);
        params.ampY = parseFloat(document.getElementById('ampY').value);
        params.freqX = parseFloat(document.getElementById('freqX').value);
        params.freqY = parseFloat(document.getElementById('freqY').value);
        params.phase = parseFloat(document.getElementById('phase').value) * p.PI;
        
        generatePoints();
    };

    const randomizeParams = () => {
        // Generate random values within the input ranges
        params.ampX = parseFloat(p.random(0.1, 1).toFixed(1));
        params.ampY = parseFloat(p.random(0.1, 1).toFixed(1));
        params.freqX = parseFloat(p.random(1, 10).toFixed(1));
        params.freqY = parseFloat(p.random(1, 10).toFixed(1));
        params.phase = parseFloat((p.random(0, 2)).toFixed(1));

        // Update input values
        document.getElementById('ampX').value = params.ampX;
        document.getElementById('ampY').value = params.ampY;
        document.getElementById('freqX').value = params.freqX;
        document.getElementById('freqY').value = params.freqY;
        document.getElementById('phase').value = params.phase;

        // Update display values and regenerate points
        updateParams();
    };
    
    p.setup = function() {
        const canvas = p.createCanvas(400, 400);
        canvas.parent('single-curve');
        generatePoints();
        
        // Add event listeners to sliders
        ['ampX', 'ampY', 'freqX', 'freqY', 'phase'].forEach(id => {
            document.getElementById(id).addEventListener('input', updateParams);
        });

        // Add randomize button listener
        document.getElementById('randomizeParams').addEventListener('click', randomizeParams);

        // Add time control listeners
        document.getElementById('playPauseTime').addEventListener('click', togglePlayPause);
        document.getElementById('timeSlider').addEventListener('input', (e) => {
            updateTime(parseFloat(e.target.value));
        });
    };
    
    p.draw = function() {
        if (isPlaying) {
            currentTime = (currentTime + 0.01) % p.TWO_PI;
            updateTime(currentTime);
        }

        p.clear();
        p.translate(200, 200);
        
        // Draw complete curve in muted purple
        p.stroke(getCSSVar('--color-muted-purple'));
        p.strokeWeight(1);
        p.noFill();
        p.beginShape();
        for (let point of points) {
            p.vertex(point.x * 170, point.y * 170);
        }
        p.endShape();

        // Draw partial curve up to current time in olive
        p.stroke(getCSSVar('--color-olive'));
        p.strokeWeight(2);
        p.beginShape();
        for (let angle = 0; angle <= currentTime; angle += 0.01) {
            const x = params.ampX * p.sin(params.freqX * angle + params.phase) * 170;
            const y = params.ampY * p.sin(params.freqY * angle) * 170;
            p.vertex(x, y);
        }
        p.endShape();

        // Draw current point
        const x = params.ampX * p.sin(params.freqX * currentTime + params.phase) * 170;
        const y = params.ampY * p.sin(params.freqY * currentTime) * 170;
        p.fill(getCSSVar('--color-lavender'));
        p.noStroke();
        p.circle(x, y, 8);
    };
};

new p5(singleSketch);
