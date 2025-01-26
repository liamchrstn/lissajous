const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

let singleSketch = function(p) {
    let points = [];
    let timeEnabled = true;
    const lockedParams = {
        ampX: true,
        ampY: true,
        freqX: false,
        freqY: false,
        phase: true
    };
    
    const defaultParams = {
        freqX: 3,
        freqY: 7.5,
        ampX: 1,
        ampY: 1,
        phase: p.PI,
        time: 0
    };
    
    let params = { ...defaultParams };
    
    const paramState = {
        freqX: { playing: false, interval: null },
        freqY: { playing: false, interval: null },
        phase: { playing: false, interval: null },
        time: { playing: false, interval: null }
    };

    const generatePoints = () => {
        points = [];
        for (let angle = 0; angle < p.TWO_PI; angle += 0.01) {
            const x = params.ampX * p.sin(params.freqX * angle + params.phase);
            const y = params.ampY * p.sin(params.freqY * angle);
            points.push({x, y});
        }
    };

    const setupParamCycling = (paramId, paramName, step = 0.01) => {
        if (paramId === 'ampX' || paramId === 'ampY') return; // Skip amplitude controls

        const input = document.getElementById(paramId);
        const btn = document.getElementById(`playPause${paramName}`);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        const updateValue = () => {
            let value = parseFloat(input.value);
            value = value + step;
            if (value > max) value = min;
            input.value = value.toFixed(2);
            updateParams();
        };

        btn.addEventListener('click', () => {
            const state = paramState[paramId];
            state.playing = !state.playing;
            btn.innerHTML = `<i class="nf nf-fa-${state.playing ? 'pause' : 'play'}"></i>`;
            btn.classList.toggle('playing', state.playing);

            if (state.playing) {
                state.interval = setInterval(updateValue, 100);
            } else {
                clearInterval(state.interval);
            }
        });
    };

    const resetParams = () => {
        // Stop any playing animations
        Object.keys(paramState).forEach(paramId => {
            const state = paramState[paramId];
            if (state.playing) {
                clearInterval(state.interval);
                state.playing = false;
                const btn = document.getElementById(`playPause${paramId.charAt(0).toUpperCase() + paramId.slice(1)}`);
                if (btn) {
                    btn.innerHTML = '<i class="nf nf-fa-play"></i>';
                    btn.classList.remove('playing');
                }
            }
        });

        // Reset values to defaults (except locked params)
        Object.keys(defaultParams).forEach(key => {
            if (!lockedParams[key]) {
                params[key] = defaultParams[key];
            }
        });

        // Update input values
        document.getElementById('ampX').value = params.ampX;
        document.getElementById('ampY').value = params.ampY;
        document.getElementById('freqX').value = params.freqX;
        document.getElementById('freqY').value = params.freqY;
        document.getElementById('phase').value = params.phase / p.PI;  // Convert to multiples of π for display
        document.getElementById('time').value = params.time;

        generatePoints();
    };

    const updateParams = () => {
        params.ampX = parseFloat(document.getElementById('ampX').value);
        params.ampY = parseFloat(document.getElementById('ampY').value);
        params.freqX = parseFloat(document.getElementById('freqX').value);
        params.freqY = parseFloat(document.getElementById('freqY').value);
        params.phase = parseFloat(document.getElementById('phase').value) * p.PI;  // Convert from multiples of π to radians
        params.time = parseFloat(document.getElementById('time').value);
        
        generatePoints();
    };

    const randomizeParams = () => {
        // Stop any playing animations
        Object.keys(paramState).forEach(paramId => {
            const state = paramState[paramId];
            if (state.playing) {
                clearInterval(state.interval);
                state.playing = false;
                const btn = document.getElementById(`playPause${paramId.charAt(0).toUpperCase() + paramId.slice(1)}`);
                if (btn) {
                    btn.innerHTML = '<i class="nf nf-fa-play"></i>';
                    btn.classList.remove('playing');
                }
            }
        });

        // Generate random values for unlocked parameters
        if (!lockedParams.ampX) params.ampX = parseFloat(p.random(0.1, 1).toFixed(1));
        if (!lockedParams.ampY) params.ampY = parseFloat(p.random(0.1, 1).toFixed(1));
        if (!lockedParams.freqX) params.freqX = parseFloat(p.random(1, 10).toFixed(1));
        if (!lockedParams.freqY) params.freqY = parseFloat(p.random(1, 10).toFixed(1));
        if (!lockedParams.phase) params.phase = p.random(0, 2) * p.PI;  // Random phase in radians
        params.time = 0;

        // Update input values
        document.getElementById('ampX').value = params.ampX;
        document.getElementById('ampY').value = params.ampY;
        document.getElementById('freqX').value = params.freqX;
        document.getElementById('freqY').value = params.freqY;
        document.getElementById('phase').value = (params.phase / p.PI).toFixed(1);  // Convert to multiples of π for display
        document.getElementById('time').value = params.time;

        generatePoints();
    };
    
    p.setup = function() {
        const canvas = p.createCanvas(400, 400);
        canvas.parent('single-curve');
        generatePoints();
        
        // Setup cycling controls (excluding amplitudes)
        setupParamCycling('freqX', 'FreqX', 0.05);
        setupParamCycling('freqY', 'FreqY', 0.05);
        setupParamCycling('phase', 'Phase');
        setupParamCycling('time', 'Time', 0.05);

        // Add input event listeners
        ['ampX', 'ampY', 'freqX', 'freqY', 'phase', 'time'].forEach(id => {
            document.getElementById(id).addEventListener('input', updateParams);
        });

        // Add button listeners
        document.getElementById('randomizeParams').addEventListener('click', randomizeParams);
        document.getElementById('resetParams').addEventListener('click', resetParams);

        // Add lock button listeners and set initial state
        Object.keys(lockedParams).forEach(paramId => {
            const lockBtn = document.getElementById(`lock${paramId.charAt(0).toUpperCase() + paramId.slice(1)}`);
            // Set initial state
            if (lockedParams[paramId]) {
                lockBtn.classList.add('locked');
                lockBtn.querySelector('i').classList.remove('nf-fa-unlock');
                lockBtn.querySelector('i').classList.add('nf-fa-lock');
            }
            // Add click listener
            lockBtn.addEventListener('click', (e) => {
                lockedParams[paramId] = !lockedParams[paramId];
                e.currentTarget.classList.toggle('locked');
                e.currentTarget.querySelector('i').classList.toggle('nf-fa-unlock');
                e.currentTarget.querySelector('i').classList.toggle('nf-fa-lock');
            });
        });
        
        // Add time toggle listener
        document.getElementById('toggleTime').addEventListener('click', () => {
            timeEnabled = !timeEnabled;
            document.getElementById('toggleTime').classList.toggle('active', timeEnabled);
            document.querySelector('.input-group.with-play:has(#time)').classList.toggle('time-disabled', !timeEnabled);
        });
    };
    
    p.draw = function() {
        p.clear();
        p.translate(200, 200);
        
        if (timeEnabled) {
            // Draw partial curve up to current time in olive
            p.noFill();
            p.stroke(getCSSVar('--color-olive'));
            p.strokeWeight(2);
            p.beginShape();
            for (let angle = 0; angle <= params.time; angle += 0.01) {
                const x = params.ampX * p.sin(params.freqX * angle + params.phase) * 170;
                const y = params.ampY * p.sin(params.freqY * angle) * 170;
                p.vertex(x, y);
            }
            p.endShape();

            // Draw current point
            const x = params.ampX * p.sin(params.freqX * params.time + params.phase) * 170;
            const y = params.ampY * p.sin(params.freqY * params.time) * 170;
            p.fill(getCSSVar('--color-lavender'));
            p.noStroke();
            p.circle(x, y, 8);
        } else {
            // Draw complete curve in olive
            p.stroke(getCSSVar('--color-olive'));
            p.strokeWeight(2);
            p.noFill();
            p.beginShape();
            for (let point of points) {
                p.vertex(point.x * 170, point.y * 170);
            }
            p.endShape();
        }
    };
};

new p5(singleSketch);
