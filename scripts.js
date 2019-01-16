var scene = new THREE.Scene();
scene.background = new THREE.Color( 'silver' );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

camera.position.z = 200;

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.campingFactor = 0.25;
controls.enableZoom = true;
controls.minDistance = 100;
controls.maxDistance = 500;
controls.enablePan = false;
controls.enableRotate = false;

var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);
 
var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);
 
var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();
 
scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);


var head;


var mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('/rhs31.github.io/assets/');
mtlLoader.setPath('/rhs31.github.io/assets/');
mtlLoader.load('BestHead.mtl', function (materials) {
  
    materials.preload(); 
    

    var objLoader = new THREE.OBJLoader();
    materials.flatShading = true;
    objLoader.setMaterials(materials);
    objLoader.setPath('/rhs31.github.io/assets/');
    objLoader.load('BestHead.obj', function (object) {
        console.log(object);
        head = object.children[0];//this SHOULD be a mesh
        console.log(head);
        scene.add(object);
        object.position.y -= 60;
        
        /*
        console.log(typeof object);
        
        geometry = object.geometry;
        material = object.material;


        //head = new THREE.Mesh( geometry, material );  
        head = object.Parent;
        console.log("head is" + typeof head);
        */
 
    });
});

/*
function onDocumentMouseMove( event ) {
                mouseX = ( event.clientX - windowHalfX );
                mouseY = ( event.clientY - windowHalfY );
            }
*/



window.addEventListener( 'resize', onWindowResize, false );

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

}

var target = new THREE.Vector3();

var mouseX = 0, mouseY = 0;



 document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );

}
var followingCursor = true;

var animate = function animate() {
	requestAnimationFrame( animate );
    
    target.x += ( mouseX - target.x ) * .02;
    target.y += ( - mouseY - target.y ) * .02;
    target.z = camera.position.z; // assuming the camera is located at ( 0, 0, z );
    if(followingCursor)
    {    
        if( head )
            head.lookAt( target );
    }
    controls.update();
    renderer.render( scene, camera );

};

var modeButtons = document.querySelectorAll(".mode");

function setUpModeButtons()
{
    for(var i = 0; i < modeButtons.length; i++)
    {
        modeButtons[i].addEventListener("click", function()
        {
            modeButtons[0].classList.remove("selected");
            modeButtons[1].classList.remove("selected");
            this.classList.add("selected");
            if (this.textContent === "Follow Cursor")
            {
                controls.reset();
                controls.enableRotate = false;
                followingCursor = true;
                controls.update();
            }
            else if (this.textContent === "Click & Drag")
            {
                controls.reset();
                head.rotation.set(0, 0, 0);
                controls.enableRotate = true;
                followingCursor = false;
                controls.update();
            }
        });
    }
}
setUpModeButtons();
animate();