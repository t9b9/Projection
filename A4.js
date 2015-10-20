/**
 * UBC CPSC 314, Vjan2015
 * Assignment 4 Template
 */
 


// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}
 

var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(10,15,40);
camera.lookAt(scene.position); 
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxisHelper(5) ;
scene.add(worldFrame);

// FLOOR WITH CHECKERBOARD 
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);
var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);
floor.parent = worldFrame;

// BASIC LIGHTING
var ambientLight = new THREE.AmbientLight( 0x5f5f5f );
scene.add( ambientLight );

var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(70,100,70);
scene.add(pointLight);    

// TODO: DEFINE SHADER FILES

//////----------------------------------------------------BASIC TEXTURING-------------------------------------------------//////
var bGeom = new THREE.OctahedronGeometry(1, 1, 1);

// TODO: REPLACE THIS with a ShaderMaterial for basic texturing. Add
// necessary shader files to glsl directory. If you want, you can add
// Phong shading using your code from Assignment 3
var bMaterial      = new THREE.ShaderMaterial({
   uniforms: {
     gravelTexture: {type: "t", value: THREE.ImageUtils.loadTexture( 'gravel-rocks-texture.jpg' )},
   },
});	

var octShaderFiles = [
  'glsl/oct.vs.glsl',
  'glsl/oct.fs.glsl',
];

new THREE.SourceLoader().load(octShaderFiles, function(shaders) {
  bMaterial.vertexShader = shaders['glsl/oct.vs.glsl'];
  bMaterial.fragmentShader = shaders['glsl/oct.fs.glsl'];
  bMaterial.needsUpdate = true;
})	
		  
// Define Mesh, position it appropriately, and add to scene
var bMesh = new THREE.Mesh(bGeom, bMaterial);

bMesh.position.set(-2.5, 2.5, 2.5);
bMesh.parent = worldFrame;
scene.add(bMesh);


////////------------------------dynamic cube map--------------------------------------------------------///
var cubeCamera = new THREE.CubeCamera( 1, 100, 256 );
cubeCamera.position.set(0,2.5,0);
//cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
scene.add( cubeCamera );

var shpere = new THREE.SphereGeometry(1,32,32);

//Create car
//var chromeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: cubeCamera.renderTarget } );
var sphere = new THREE.SphereGeometry(1, 32, 32);
var sphereMaterial = new THREE.MeshLambertMaterial({
  envMap: cubeCamera.renderTarget
});
var sph = new THREE.Mesh(shpere, sphereMaterial);


sph.parent = worldFrame;
sph.position.set(0, 2.5, 0);
scene.add(sph);
//////-----------------------------------------------------------REFLECTION MAPS-----------------------------------------------------------//////
var rGeom = new THREE.SphereGeometry(1, 32, 32);

// TODO: Load cube environment map using THREE.ImageUtils.loadTextureCube
// set Texure.format  THREE.RGBFormat;
/* var textures = [
  'images/cubemap_debug/ground.png',
  'images/cubemap_debug/left.png',
  'images/cubemap_debug/middle.png',
  'images/cubemap_debug/right1.png',
  'images/cubemap_debug/right2.png',
  'images/cubemap_debug/sky.png'
]; */



var textures = [
  'images/cubemap_real/cube1.png',
  'images/cubemap_real/cube2.png',
  'images/cubemap_real/cube3.png',
  'images/cubemap_real/cube4.png',
  'images/cubemap_real/cube5.png',
  'images/cubemap_real/cube6.png'
];
var cubemap = THREE.ImageUtils.loadTextureCube(textures);
cubemap.format = THREE.RGBFormat;


// TODO: Add environment map to the Three.js material

var rMat = new THREE.MeshLambertMaterial({
  envMap: cubemap
});


//var rMat = new THREE.MeshBasicMaterial();
var rMesh = new THREE.Mesh(rGeom, rMat);

rMesh.position.set(0, 2.5, 2.5);
rMesh.parent = worldFrame;
scene.add(rMesh);






//////-----------------------------------------------------------PROJECTOR MAPS----------------------------------------------------- //////

// Geometry
var pGeom = new THREE.SphereGeometry(1,32,32);
var pMPos = new THREE.Vector3(2.5,2.5,2.5); //Mesh position in world
var pPPos = new THREE.Vector3(2.5,2.5,10); //Projector position in world

// TODO: Construct Projector's  "View" matrix, using Matrix4.lookAt. 
// Don't forget the translation component of the matrix!
var matrix4 = new THREE.Matrix4();
var up = pPPos.sub(pMPos).normalize();
var vMatrix = matrix4.lookAt(pPPos, pMPos, new THREE.Vector3(0, 1, 0 ));
//console.info(vMatrix.elements);

//camera world frame
vMatrix.set(1, 0, 0, -2.5,   
			0, 1, 0, -2.5,   
			0, 0, 1, -10,  
			0, 0, 0, 1);
//vMatrix.multiplyMatrices (wf, vMatrix);

console.info(vMatrix.elements);

//--------------------------------------------------------------------------------
/* //view point in world frame
var wf = new THREE.Matrix4().set(1, 0, 0, 2.5,   0, 1, 0, 2.5,   0, 0, 1, 10,  0, 0, 0, 1);
vMatrix.multiplyMatrices (wf, vMatrix);
console.info(vMatrix.elements); */

/* //width 1106 , height 1105
var w = 1106;
var h = 1105;

//view port transform matrix
var vpMatrix = new THREE.Matrix4().set(w/2, 0, 0, (w-1)/2,   0, h/2, 0, (h-1)/2,   0, 0, 1/2, 1/2,  0, 0, 0, 1); */


var box = new THREE.BoxGeometry(8, 8, 8);
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var cube = new THREE.Mesh(box, material);
//cube.setMatrix(tc);
//scene.add(cube);
//--------------------------------------------------------------------------------

// TODO: Construct Projector's "Projection" matrix
// Create the projection matrix in texture space
var matrix40 =  new THREE.Matrix4();
var pMatrix = matrix40.makePerspective(10, 1, 500, 501);
console.info(pMatrix.elements);
var translationMatrix = new THREE.Matrix4().set(1, 0, 0, 0.5,
												0, 1, 0, 0.5,
												0, 0, 1, 0.5,  
												0, 0, 0, 1); 

var scalerMatrix = new THREE.Matrix4().set(0.5, 0, 0, 0,
										   0, 0.5, 0, 0,
										   0, 0,   1, 0,  
										   0, 0,   0, 1); 

var tsMatrix = new THREE.Matrix4().multiplyMatrices(translationMatrix, scalerMatrix);									   
pMatrix.multiplyMatrices (tsMatrix, pMatrix);

console.info(pMatrix.elements);

// TODO: REPLACE the following line with a ShaderMaterial, pass texture and
// projector related matrices to the vertex shader
//var pMat = new THREE.MeshBasicMaterial();
var logoTexture = THREE.ImageUtils.loadTexture('logoUBC.jpg');
var pMaterial      = new THREE.ShaderMaterial({
   uniforms: {
     logoTexture: {type: "t", value: logoTexture},
	 vMatrix  : { type: "m4", value: vMatrix},
	 pMatrix  : { type: "m4", value: pMatrix},
	 //vpMatrix : { type: "m4", value: vpMatrix},
   },
});	

var proShaderFiles = [
  'glsl/pro.vs.glsl',
  'glsl/pro.fs.glsl',
];

new THREE.SourceLoader().load(proShaderFiles, function(shaders) {
  pMaterial.vertexShader = shaders['glsl/pro.vs.glsl'];
  pMaterial.fragmentShader = shaders['glsl/pro.fs.glsl'];
  pMaterial.needsUpdate = true;
})	


var pMesh = new THREE.Mesh(pGeom, pMaterial);
pMesh.position.set(pMPos.x,pMPos.y,pMPos.z);
pMesh.parent = worldFrame;
scene.add(pMesh);

var counter = 0;

// SETUP UPDATE CALL-BACK
function update() {
  counter += .01;
  var sin = Math.sin(counter);
  var cos = Math.cos(counter);
  requestAnimationFrame(update);
  cubeCamera.position.z = sin * 7;
  sph.position.z = sin * 7;
  cubeCamera.position.x = cos * 7;
  sph.position.x = cos * 7;
  sph.visible = false;
  cubeCamera.updateCubeMap(renderer, scene);
  sph.visible = true;



  renderer.render(scene, camera);
}

update();
