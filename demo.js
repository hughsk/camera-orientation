var perspective = require('gl-mat4/perspective')
var icosphere = require('icosphere')
var Geom = require('gl-geometry')
var Shader = require('gl-shader')
var glslify = require('glslify')
var fit = require('canvas-fit')

var canvas = document.body.appendChild(document.createElement('canvas'))
var gl = require('gl-context')(canvas, render)

var proj = new Float32Array(16)
var Camera = require('./')
var camera = Camera()

var sphere = Geom(gl).attr('position', icosphere(2))
var shader = Shader(gl
  , glslify('./demo.vert')
  , glslify('./demo.frag')
)

function render () {
  var width = canvas.width
  var height = canvas.height

  gl.viewport(0, 0, width, height)
  gl.disable(gl.CULL_FACE)
  gl.disable(gl.DEPTH_TEST)

  sphere.bind(shader)
  shader.uniforms.proj = perspective(proj, Math.PI / 4, width / height, 0.1, 5)
  shader.uniforms.view = camera.tick()
  sphere.draw()
}

window.addEventListener('resize', fit(canvas), false)
