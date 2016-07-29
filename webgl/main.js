// vars
var gl;
var c;
var horizAspect = 480.0/640.0;

// functions
function start(){
  c = document.getElementById('c');
  gl = initgl(c);
  if(gl){
    gl.clearColor(0,0,0,1);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
function initgl(canvas){
  gl = null;
  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  } catch(e){}
  if(!gl){
    alert("webgl is not supported in your browser");
	gl = null;
  }
  return gl;
}
function initshaders(){
  var frag = getShader(gl,"shader-fs");
  var vert = getShader(gl,"shader-vs");
  
  shaderProgram = gl.createProgram();
  gl.attatchShader(shaderProgram,vert);
  gl.attatchShader(shaderProgram,frag);
  gl.linkProgram(shaderProgram);
  
  if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
	return null;
  }
  
  gl.useProgram(shaderProgram);
  
  vertPos = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertPos);
}
function getShader(gl, id){
  var shaderScript, source, child, shader;
  
  shaderScript = document.getElementById(id);
  
  if(!shaderScript){
    return null;
  }
  
  while(child){
    if(child.nodeType == child.TEXT_NODE){
	  source += child.textContent;
	}
	child = child.nextSibling;
  }
  
  if(shaderScript.type == "x-shader/x-fragment"){
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if(shaderScript.type = "x-shader/x-vertex"){
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
  
  gl.shaderSource(shader,source);
  gl.compileShader(shader);
  
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
	return null;
  }
  
  return shader;
}
function initBuffers() {
  squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  
  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}
window.onload = start;