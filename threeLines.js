const MOVEMENT_SCALE = 0.1;

var controls, renderer, camera, scene, lines, pointer, mouseDown, currentPoint, origin, framerate, frametime, lineMaterial, pointer, glRenderer
var pointOffMaterial, pointOnMaterial, extrudeMaterial
var coordinatesUrl = 'http://localhost:8080/'
var timeStepSinceLast = 1
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
      render()
      lines = []
    } else if (e.keyCode == 32) {
      drawing = !drawing
      if (drawing)
        getCurrentCoordinate()
    } else if (e.keyCode == 86) {
      toggleVR()
    } else if (e.keyCode == 69){
      var extrudeGeometry = new THREE.ExtrudeGeometry(lines, {
        amount: 10
      });
      var extruded = new Mesh(extrudeGeometry, extrudeMaterial)
      scene.add(extruded)
      render()
    }
  })
})

function init () {
  framerate = 10
  frametime = 1000/framerate

  glRenderer = new THREE.WebGLRenderer();
  glRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(glRenderer.domElement);
  renderer = glRenderer

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

  pointOffMaterial = new THREE.PointCloudMaterial({
      color: 0xff0000,
      size: 5,
      sizeAttenuation: false,
  });

  pointOnMaterial = new THREE.PointCloudMaterial({
      color: 0x00ff00,
      size: 5,
      sizeAttenuation: false,
  });

  mouseDown = false;
  currentPoint = null;


  lines = [];

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

  var extrudeMaterial = new THREE.MeshBasicMaterial();

  pointer = [0,0,0]
  var pointGeometry = new THREE.Geometry()
  pointGeometry.vertices.push(new THREE.Vector3(0,0,0))
  pointer = new THREE.Points(pointGeometry, pointOnMaterial)
  scene.add(pointer)
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
    var point = new THREE.Vector3(coordinates[0], -coordinates[2], coordinates[1])
    var pointGeometry = new THREE.Geometry()
    pointGeometry.vertices.push(point)
    pointer.geometry = pointGeometry

    if (currentPoint) {
      var velocity = currentPoint.distanceTo(point) / (timeStepSinceLast / framerate)
      if (velocity > 40) {
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

    if (drawing){
      setTimeout(getCurrentCoordinate, frametime)
      pointer.material = pointOnMaterial
    }
    else{
      currentPoint = null
      pointer.material = pointOffMaterial
    }
  })
}

function toggleVR () {
  var screen = window.screen
  glRenderer.setSize(screen.width, screen.height)
  glRenderer.setPixelRatio(window.devicePixelRatio)
  effect = new THREE.StereoEffect(glRenderer)
  effect.eyeSeparation = 3
  effect.setSize(screen.width, screen.height)
  // effect.setSize(canvas.width(), $(window).height())

  // effect.setSize(screen.width, screen.height)
  renderer = effect
  camera.position.set(0, 0, 100)
  var elem = glRenderer.domElement
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  }
}
