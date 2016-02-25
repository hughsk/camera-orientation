var mat4FromQuat = require('gl-mat4/fromQuat')
var quatMultiply = require('gl-quat/multiply')
var quatInvert = require('gl-quat/invert')
var mat4 = require('gl-mat4')

module.exports = Camera

var offsetQuat = new Float32Array([-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)])
var scratchQuat = new Float32Array(4)
var radians = Math.PI / 180

var debug = document.body.appendChild(document.createElement('div'))
debug.style.padding = '1rem'
debug.style.position = 'absolute'
debug.style.top = 0
debug.style.left = 0
debug.style.color = '#fff'
debug.style.fontFamily = 'monospace'
debug.style.whiteSpace = 'pre'
debug.style.innerHTML = 'waiting for input'
debug.style.zIndex = 9999

function Camera (origin) {
  var orientation = new Float32Array(4)
  var camera = Object.create(null)
  var dirty = true

  orientation[3] = getOrientation()

  camera.origin = origin || new Float32Array(3)
  camera.matrix = new Float32Array(16)
  camera.disposed = false
  camera.direction = new Float32Array(3)
  camera.quaternion = new Float32Array(4)

  camera.view = view
  camera.tick = tick
  camera.dispose = dispose

  window.addEventListener('deviceorientation', deviceOrientation, false)
  window.addEventListener('orientationchange', orientationChange, false)
  console.log(screen.orientation.angle)

  return camera

  function tick () {
    if (!dirty) return view()

    //
    // Creates a quaternion from the orientation angles
    // http://w3c.github.io/deviceorientation/spec-source-orientation.html
    //
    var x = -orientation[1] / 2
    var z = -orientation[0] / 2
    var y = -orientation[2] / 2

    var cx = Math.cos(x)
    var cy = Math.cos(y)
    var cz = Math.cos(z)
    var sx = Math.sin(x)
    var sy = Math.sin(y)
    var sz = Math.sin(z)

    camera.quaternion[0] = sx * cy * cz + cx * sy * sz
    camera.quaternion[1] = cx * sy * cz - sx * cy * sz
    camera.quaternion[2] = cx * cy * sz - sx * sy * cz
    camera.quaternion[3] = cx * cy * cz + sx * sy * sz

    //
    // Another one for handling screen orientation (i.e. if you rotate the
    // device and it switches between portrait/landscape/upside-down)
    //
    // var half = orientation[3] * 2
    // var sin = Math.sin(half)
    // var cos = Math.cos(half)
    //
    // scratchQuat[2] = cos
    // scratchQuat[1] = sin
    var half = 0 // Math.sin(Date.now() / 1000) * Math.PI / -4 // orientation[3] / 2
    var sin = Math.sin(half)
    var cos = Math.cos(half)

    scratchQuat[2] = cos
    scratchQuat[3] = sin

    //
    // Combine the above quaternion rotations, including one to
    // prop the camera into the correct position, then convert them
    // into a 4x4 view matrix
    //
    quatMultiply(camera.quaternion, camera.quaternion, offsetQuat)
    quatMultiply(camera.quaternion, camera.quaternion, scratchQuat)
    mat4FromQuat(camera.matrix, camera.quaternion)

    return view()
  }

  function view () {
    return camera.matrix
  }

  function dispose () {
    window.removeEventListener('deviceorientation', deviceOrientation, false)
    window.removeEventListener('orientationchange', orientationChange, false)
  }

  function deviceOrientation (e) {
    dirty = true
    orientation[0] = e.alpha * radians
    orientation[1] = e.beta * radians
    orientation[2] = e.gamma * radians
  }

  function orientationChange (e) {
    dirty = true
    orientation[3] = getOrientation()
  }
}

function getOrientation () {
  return (screen.orientation ? screen.orientation.angle : window.orientation || 0) * radians
}
