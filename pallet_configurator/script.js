let threeScene, threeCamera, threeRenderer, threeControls, threePallet, threeCases = [];

document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Get case dimensions
    const caseLength = parseFloat(document.getElementById('caseLength').value);
    const caseWidth = parseFloat(document.getElementById('caseWidth').value);
    const caseHeight = parseFloat(document.getElementById('caseHeight').value);
    // Get pallet dimensions
    const palletLength = parseFloat(document.getElementById('palletLength').value);
    const palletWidth = parseFloat(document.getElementById('palletWidth').value);
    const palletHeight = parseFloat(document.getElementById('palletHeight').value);

    // Get orientation
    const orientation = document.querySelector('input[name="orientation"]:checked').value;

    // Helper to calculate fit for a given orientation
    function calcFit(len, wid, hei) {
        const fitLength = Math.floor(palletLength / len);
        const fitWidth = Math.floor(palletWidth / wid);
        const fitHeight = Math.floor(palletHeight / hei);
        return {
            fitLength,
            fitWidth,
            fitHeight,
            casesPerLayer: fitLength * fitWidth,
            layersPerPallet: fitHeight,
            totalCases: fitLength * fitWidth * fitHeight,
            caseL: len,
            caseW: wid,
            caseH: hei
        };
    }

    let resultStandard = calcFit(caseLength, caseWidth, caseHeight);
    let resultRotated = calcFit(caseWidth, caseLength, caseHeight);
    let result;
    if (orientation === 'standard') {
        result = resultStandard;
    } else if (orientation === 'rotated') {
        result = resultRotated;
    } else {
        // maximize
        result = (resultStandard.totalCases >= resultRotated.totalCases) ? resultStandard : resultRotated;
    }

    // Show result
    document.getElementById('result').textContent =
        `Maximum cases per pallet: ${result.totalCases}`;

    // Show breakdown
    document.getElementById('breakdown').innerHTML =
        `<strong>Cases Per Layer:</strong> ${result.casesPerLayer} &nbsp; | &nbsp; <strong>Layers Per Pallet:</strong> ${result.layersPerPallet} &nbsp; | &nbsp; <strong>Total Cases Per Pallet:</strong> ${result.totalCases}`;

    // Draw 3D pallet view
    drawPallet3D(result.fitLength, result.fitWidth, result.fitHeight, result.caseL, result.caseW, result.caseH, palletLength, palletWidth, palletHeight);
});

function drawPallet3D(fitLength, fitWidth, fitHeight, caseLength, caseWidth, caseHeight, palletLength, palletWidth, palletHeight) {
    // Remove previous renderer if exists
    if (threeRenderer) {
        threeRenderer.dispose && threeRenderer.dispose();
        document.getElementById('pallet3d').innerHTML = '';
    }

    // --- SCALE TO FIT ---
    // Find the largest dimension (pallet or stack of cases)
    const stackLength = fitLength * caseLength;
    const stackWidth = fitWidth * caseWidth;
    const stackHeight = fitHeight * caseHeight + 4; // 4 for pallet base
    const maxStackDim = Math.max(stackLength, stackWidth, stackHeight, palletLength, palletWidth, palletHeight);
    // We'll fit this into a 300x220px area (with some margin)
    const renderWidth = 800, renderHeight = 320;
    const fitTo = Math.min(renderWidth, renderHeight) * 0.8;
    const scale = fitTo / maxStackDim;

    // Scene setup
    threeScene = new THREE.Scene();
    threeScene.background = new THREE.Color(0xfafafa);
    const aspect = renderWidth / renderHeight;
    threeCamera = new THREE.PerspectiveCamera(45, aspect, 1, 10000);
    // Camera position: show the pallet from an angle
    threeCamera.position.set(
        (palletLength * scale) * 1.2,
        (palletHeight * scale) * 1.2,
        (palletWidth * scale) * 1.2
    );
    threeCamera.lookAt(new THREE.Vector3((palletLength * scale)/2, (caseHeight * fitHeight * scale)/2, (palletWidth * scale)/2));

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    threeScene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(1,2,1);
    threeScene.add(dirLight);

    // Pallet base
    const palletGeometry = new THREE.BoxGeometry(palletLength * scale, 4 * scale, palletWidth * scale);
    const palletMaterial = new THREE.MeshLambertMaterial({ color: 0xdeb887 });
    threePallet = new THREE.Mesh(palletGeometry, palletMaterial);
    threePallet.position.set((palletLength * scale)/2, 2 * scale, (palletWidth * scale)/2);
    threeScene.add(threePallet);

    // Cases
    threeCases = [];
    const caseMaterial = new THREE.MeshLambertMaterial({ color: 0x0078d7, transparent: false });
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
    for (let h = 0; h < fitHeight; h++) {
        for (let i = 0; i < fitLength; i++) {
            for (let j = 0; j < fitWidth; j++) {
                // Box
                const boxGeo = new THREE.BoxGeometry(caseLength * scale, caseHeight * scale, caseWidth * scale);
                const box = new THREE.Mesh(boxGeo, caseMaterial);
                box.position.set(
                    (i * caseLength + caseLength/2) * scale,
                    (4 + h * caseHeight + caseHeight/2) * scale,
                    (j * caseWidth + caseWidth/2) * scale
                );
                threeScene.add(box);
                threeCases.push(box);
                // Edges
                const edges = new THREE.EdgesGeometry(boxGeo);
                const line = new THREE.LineSegments(edges, edgeMaterial);
                line.position.copy(box.position);
                threeScene.add(line);
            }
        }
    }

    // Renderer
    threeRenderer = new THREE.WebGLRenderer({ antialias: true });
    threeRenderer.setSize(renderWidth, renderHeight);
    document.getElementById('pallet3d').appendChild(threeRenderer.domElement);

    // Simple orbit controls (mouse drag to rotate)
    let isDragging = false, prevX, prevY, theta = 0, phi = 0;
    const dom = threeRenderer.domElement;
    dom.onmousedown = function(e) { isDragging = true; prevX = e.clientX; prevY = e.clientY; };
    dom.onmouseup = function() { isDragging = false; };
    dom.onmouseleave = function() { isDragging = false; };
    dom.onmousemove = function(e) {
        if (!isDragging) return;
        theta -= (e.clientX - prevX) * 0.01;
        phi -= (e.clientY - prevY) * 0.01;
        phi = Math.max(-Math.PI/2, Math.min(Math.PI/2, phi));
        prevX = e.clientX; prevY = e.clientY;
        updateCamera();
    };
    function updateCamera() {
        const r = Math.max(palletLength, palletWidth, palletHeight) * scale * 2;
        threeCamera.position.x = (palletLength * scale)/2 + r * Math.sin(theta) * Math.cos(phi);
        threeCamera.position.y = (caseHeight * fitHeight * scale)/2 + r * Math.sin(phi);
        threeCamera.position.z = (palletWidth * scale)/2 + r * Math.cos(theta) * Math.cos(phi);
        threeCamera.lookAt(new THREE.Vector3((palletLength * scale)/2, (caseHeight * fitHeight * scale)/2, (palletWidth * scale)/2));
        render();
    }

    function render() {
        threeRenderer.render(threeScene, threeCamera);
    }
    render();
}
