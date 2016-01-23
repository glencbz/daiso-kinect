const MOVEMENT_SCALE = 0.1;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var origin = [window.innerWidth/2, window.innerHeight/2];

var scene = new THREE.Scene();

var lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff00
});

var pointMaterial = new THREE.PointCloudMaterial({
    color: 0xff0000,
    size: 5,
    sizeAttenuation: false,
});

var currentPoint = [0,0,0];
var lines = [];
var point = undefined;

document.addEventListener("keydown", function(e){
	var keyCode = e.keyCode;
	var originalPoint = currentPoint.slice();
	switch(keyCode){
		case 37: //left
			currentPoint[0] -= 1;
			break;
		case 38: //up
			currentPoint[1] += 1;
			break;
		case 39: //right
			currentPoint[0] += 1;
			break;
		case 40: //down
			currentPoint[1] -= 1;
			break;
		default:
			rotateImage();
	}
	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push(new THREE.Vector3(originalPoint[0], originalPoint[1], originalPoint[2]));
	lineGeometry.vertices.push(new THREE.Vector3(currentPoint[0], currentPoint[1], currentPoint[2]));
	var line = new THREE.Line(lineGeometry, lineMaterial);

	var pointGeometry = new THREE.Geometry();
	pointGeometry.vertices.push(new THREE.Vector3(currentPoint[0], currentPoint[1], currentPoint[2]));
	point.geometry = pointGeometry;

	scene.add(line);
	lines.push(line);
	renderer.render(scene, camera);
});

document.addEventListener("mousemove", function(e){
	var pointGeometry = new THREE.Geometry();
	var threeX = e.clientX - origin[0];
	var threeY = origin[1] - e.clientY;

	threeX *= MOVEMENT_SCALE;
	threeY *= MOVEMENT_SCALE;

	pointGeometry.vertices.push(new THREE.Vector3(threeX, threeY, 0));
	point.geometry = pointGeometry;
	renderer.render(scene, camera);
});

function rotateImage(){
	lines.map(function(d){
		d.rotation.x += 0.1;
		d.rotation.y += 0.1;
		// d.rotation.z += 0.1;
	});
	// point.rotation.x += 0.1;
	// point.rotation.y += 0.1;
}

var pointGeometry = new THREE.Geometry();
pointGeometry.vertices.push(new THREE.Vector3(currentPoint[0], currentPoint[1], currentPoint[2]));
point = new THREE.Points(pointGeometry, pointMaterial);
scene.add(point);
renderer.render(scene, camera);