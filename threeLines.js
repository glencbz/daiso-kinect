const MOVEMENT_SCALE = 0.1;

var controls, renderer, camera, scene, point, mouseDown, currentPoint, origin, framerate, frametime, lineMaterial
var coordinatesUrl = 'http://localhost:8080/'
var timeStepSinceLast = 1
var lines = [];
var drawing = true;

init()
animate()
getCurrentCoordinate()

$(function(){
  $("#reset").click(function(){
    lines.map(function(d){
      scene.remove(d)
    })
    renderer.render(scene, camera)
    lines = []
  })

  $(document).keydown(function(e){
    if (e.keyCode == 82) { // r key
      lines.map(function(d){
        scene.remove(d)
      })
      renderer.render(scene, camera)
      lines = []
    } else if (e.keyCode == 32) {
      drawing = !drawing
      if (drawing)
        getCurrentCoordinate()
    }
  })
})

function init () {
  framerate = 10
  frametime = 1000/framerate

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3(20, -20, 20));
  camera.position.z = 250;

  controls = new THREE.OrbitControls( camera, renderer.domElement );

  origin = [window.innerWidth/2, window.innerHeight/2];

  scene = new THREE.Scene();

  lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1000,
  });

  var pointMaterial = new THREE.PointCloudMaterial({
      color: 0xff0000,
      size: 5,
      sizeAttenuation: false,
  });

  mouseDown = false;
  currentPoint = null;
  lines = [];
  // point = null;
  /*
  document.addEventListener("keydown", function(e){
    var keyCode = e.keyCode;
    switch(keyCode){
      case 37: //left
        rotateImage(0, -0.1);
        break;
      case 38: //up
        rotateImage(-0.1, 0);
        break;
      case 39: //right
        rotateImage(0, 0.1);
        break;
      case 40: //down
        rotateImage(0.1, 0);
        break;
    }
    renderer.render(scene, camera);
  });

  document.addEventListener("mousemove", function(e){
    var pointGeometry = new THREE.Geometry();
    var threeX = e.clientX - origin[0];
    var threeY = origin[1] - e.clientY;

    threeX *= MOVEMENT_SCALE;
    threeY *= MOVEMENT_SCALE;

    var newPosition = new THREE.Vector3(threeX, threeY, 0);
    pointGeometry.vertices.push(newPosition);

    if (mouseDown){
      var lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(point.geometry.vertices[0]);
      lineGeometry.vertices.push(newPosition);
      var line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      lines.push(line);
    }

    point.geometry = pointGeometry;
    renderer.render(scene, camera);
  });

  document.addEventListener("mousedown", function(){
    mouseDown = true;
  });

  document.addEventListener("mouseup", function(){
    mouseDown = false;
  });



  function rotateImage(x, y){
    lines.map(function(d){
      d.rotation.x += x;
      d.rotation.y += y;
    });
  }

  */

  var xAxisMaterial = new THREE.LineBasicMaterial({
      color: 0xff00ff,
      linewidth: 2,
  });

  var yAxisMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      linewidth: 2,
  });

  var zAxisMaterial = new THREE.LineBasicMaterial({
      color: 0xffff00,
      linewidth: 2,
  });

  var xAxisGeometry = new THREE.Geometry();
  xAxisGeometry.vertices.push(new THREE.Vector3(0,0,0));
  xAxisGeometry.vertices.push(new THREE.Vector3(10,0,0));
  var xAxisLine = new THREE.Line(xAxisGeometry, xAxisMaterial);
  scene.add(xAxisLine);
  // lines.push(xAxisLine);

  var yAxisGeometry = new THREE.Geometry();
  yAxisGeometry.vertices.push(new THREE.Vector3(0,0,0));
  yAxisGeometry.vertices.push(new THREE.Vector3(0,-10,0));
  var yAxisLine = new THREE.Line(yAxisGeometry, yAxisMaterial);
  scene.add(yAxisLine);
  // lines.push(yAxisLine);

  var zAxisGeometry = new THREE.Geometry();
  zAxisGeometry.vertices.push(new THREE.Vector3(0,0,0));
  zAxisGeometry.vertices.push(new THREE.Vector3(0,0,10));
  var zAxisLine = new THREE.Line(zAxisGeometry, zAxisMaterial);
  scene.add(zAxisLine);
  // lines.push(zAxisLine);

  var pointGeometry = new THREE.Geometry();
  pointGeometry.vertices.push(new THREE.Vector3(0,0,0));
  var point = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(point);
}

function animate () {
  requestAnimationFrame( animate );
  controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
  // stats.update();
  render();
}

function render () {
  renderer.render(scene, camera);
}

function getCurrentCoordinate () {
  $.get(coordinatesUrl, function (data) {
    var coordinates = JSON.parse(data)
    var point = new THREE.Vector3(coordinates[0], - coordinates[2], coordinates[1])
    if (currentPoint) {
      var velocity = currentPoint.distanceTo(point) / (timeStepSinceLast / framerate)
      if (velocity > 20) {
        timeStepSinceLast += 1
      } else {
        var lineGeometry = new THREE.Geometry()
        lineGeometry.vertices.push(currentPoint)
        lineGeometry.vertices.push(point)
        line = new THREE.Line(lineGeometry, lineMaterial)
        scene.add(line)
        lines.push(line)
        currentPoint = point
        timeStepSinceLast = 1
      }
    } else {
      currentPoint = point
    }

    if (drawing) 
      setTimeout(getCurrentCoordinate, frametime)
    else
      currentPoint = null
  })
}

