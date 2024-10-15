//import * as THREE from 'three';
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

//set scene
const scene= new THREE.Scene();
const sizes=(window.innerWidth,window.innerHeight);
const near=0.1;
const far=3000;


//set camera
const camera= new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight,near,far);
camera.position.set(0, 0, 400);
scene.add(camera);

//set renderer
const renderer = new THREE.WebGLRenderer({alpha:true}); 
renderer.setClearColor(0x000000); // Set backgroxsund color to black
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
document.body.appendChild(renderer.domElement);

//mark the rootbone
const geometry = new THREE.BoxGeometry(40, 40, 40);  // Size of the cube
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });  // Green color
const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);









//set load
    const fbxLoader = new FBXLoader();
    let character;
    let rootBone;
  
    const rootPosition = new THREE.Vector3();
    const rootStart = new THREE.Vector3();
    let shouldCapturePosition = false;

    let mixer;
    let animations={};
    let clipLoaded=0;
    let clipNumber=2;
    const xchange=0;
    const ychange=0;
    const zchange=0;

    fbxLoader.load('asset/rig_cyborg_t.fbx', function (fbxCharacter) {
        character = fbxCharacter;
        scene.add(character);
        console.log(character);
      
        rootBone = character.getObjectByName('mixamorigHips');
        rootBone.updateMatrixWorld(true);  
        rootBone.getWorldPosition(rootStart);
        console.log("rootbone start point:",rootStart);   ///get the start position of the root bone

            mixer = new THREE.AnimationMixer(character);

//LOAD WALKING
            fbxLoader.load('asset/Catwalk Walk Forward_inplace.fbx', function (fbxAnimation) {
                const walkAnimation = fbxAnimation.animations[0];
                animations.walk = mixer.clipAction(walkAnimation);
                clipLoaded++;
                console.log(clipLoaded);
            

        //load stopping AND TURNING
            fbxLoader.load('asset/stopTurnUpdate2.fbx', function (fbxAnimation) {
                const stopTurnAnimation = fbxAnimation.animations[0];
                animations.stopTurn = mixer.clipAction(stopTurnAnimation);
                clipLoaded++;
                console.log(clipLoaded);
            
                if(clipLoaded==clipNumber){
                 playSequence();
                }
              
            });
        }); 
    });  



    

  function playSequence(){

        animations.walk.setLoop(THREE.LoopRepeat, 2);
        animations.walk.play();
        console.log("walking");
     

   animations.walk.getMixer().addEventListener('finished',function walkToStopTurn() {
 
         animations.walk.stop();
         console.log("walking end");
         animations.walk.reset();

         animations.stopTurn.setLoop(THREE.LoopRepeat, 1);
         animations.stopTurn.play();
         console.log("STOP playing");

    animations.walk.getMixer().removeEventListener('finished',walkToStopTurn);

    // });
   
    animations.stopTurn.getMixer().addEventListener('finished', function turnToWalk() {
        animations.stopTurn.stop();
        animations.stopTurn.reset();
        console.log("TURN end");
        animations.walk.setLoop(THREE.LoopRepeat, 2);
        animations.walk.play();
        console.log("walking AGAIN");
        animations.stopTurn.getMixer().removeEventListener('finished',turnToWalk);
        playSequence();
    });
   
});

}

    
    
//ORBIT controls
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0,0, 1000 );
controls.update();


//set lighting
const light = new THREE.AmbientLight( 0x404040,3 ); // soft white light
scene.add( light );
const followLight = new THREE.PointLight(0xffffff, 10, 300);  // Color, intensity, and distance
followLight.position.set(0, 10, 0);  // Set initial position above the character (adjust as needed)
scene.add(followLight);  // Add the light to the scene

// Add a helper to visualize the light (optional)
const lightHelper = new THREE.PointLightHelper(followLight, 1);  // Adjust size of the helper
scene.add(lightHelper);


//move forward while walking
let clock = new THREE.Clock();  // Create a clock to track delta time
let walkspeed = 0;  // Adjust this value to control how fast the character moves forward

//ANIMATE
function animate(){
requestAnimationFrame(animate);
controls.update();


if (mixer) {
     let delta = clock.getDelta();  // Get the time passed since the last frame
     mixer.update(delta); 
     //character.position.z+=walkspeed;
     followLight.position.set(character.position.z); 

     rootBone.getWorldPosition(rootPosition); // Extract world position of the root bone
     cube.position.copy(rootPosition);
     
    }
    if (shouldCapturePosition) {

    }
   
renderer.render(scene, camera);

}


animate();

