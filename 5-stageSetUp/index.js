//import * as THREE from 'three';
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

//set scene
const scene= new THREE.Scene();
scene.background = new THREE.Color(0x5e5e5e);
const sizes=(window.innerWidth,window.innerHeight);
const near=0.1;
const far=3000;


//set camera
const camera= new THREE.PerspectiveCamera(100, window.innerWidth/window.innerHeight,near,far);
camera.position.set(0, 0, 300);
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



//LOAD STAGE ELEMENTS
const blueelixirLoader = new FBXLoader();
let blueelixir;
blueelixirLoader.load('asset/blueelixir.fbx', function (fbxCharacter) {
    blueelixir = fbxCharacter;
    scene.add(blueelixir);
    //console.log(blueelixir);
});  
const goldclawLoader = new FBXLoader();
let goldclaw;
goldclawLoader.load('asset/goldclaw.fbx', function (fbxCharacter) {
    goldclaw = fbxCharacter;
    scene.add(goldclaw);
    //console.log(goldclaw);
});  
const greencatLoader = new FBXLoader();
let greencat;
greencatLoader.load('asset/greencat.fbx', function (fbxCharacter) {
    greencat = fbxCharacter;
    scene.add(greencat);
    //console.log(greencat);
});  
const neonwugongLoader = new FBXLoader();
let neonwugong;
neonwugongLoader.load('asset/neonwugong.fbx', function (fbxCharacter) {
    neonwugong = fbxCharacter;
    scene.add(neonwugong);
    //console.log(neonwugong);
});  
const pinkframeLoader = new FBXLoader();
let pinkframe;
pinkframeLoader.load('asset/blackframe.fbx', function (fbxCharacter) {
    pinkframe = fbxCharacter;
    scene.add(pinkframe);
    //console.log(pinkframe);
});  
const silvertotemLoader = new FBXLoader();
let silvertotem;
silvertotemLoader.load('asset/silvertotem.fbx', function (fbxCharacter) {
    silvertotem = fbxCharacter;
    scene.add(silvertotem);
    //console.log(silvertotem);
});  



//LOAD 3D TEXT: open call
const openCallLoader = new FBXLoader();
let openCall;
const textLight = new THREE.PointLight(0xffffff, 3, 500); 
const textLightHelper = new THREE.PointLightHelper(textLight, 10); 

openCallLoader.load('asset/opencall-text.fbx', function (fbxCharacter) {
    openCall = fbxCharacter;
    openCall.position.set(camera.position.x,camera.position.y,camera.position.z-300);
    scene.add(openCall);
    // const textLight = new THREE.PointLight(0xffffff, 3, 500);  // Color, intensity, and distance

textLight.position.set(openCall.position.x+70, openCall.position.y+20, openCall.position.z+130);  // Set initial position above the character (adjust as needed)
scene.add(textLight);  // Add the light to the scene
// const textLightHelper = new THREE.PointLightHelper(textLight, 10);  // Adjust size of the helper
scene.add(textLightHelper);
});  


// Add a helper to visualize the light (optional)
// const textLightHelper = new THREE.PointLightHelper(textLight, 10);  // Adjust size of the helper
// scene.add(textLightHelper);




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
let isWalkingOut=false;
let isWalkingBack=false;


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
            fbxLoader.load('asset/stopTurnWide8.fbx', function (fbxAnimation) {
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
        isWalkingOut=true;
        console.log("walking");
     

   animations.walk.getMixer().addEventListener('finished',function walkToStopTurn() {
 
         animations.walk.stop();
         isWalkingOut=false;
         console.log("walking end");
         animations.walk.reset();

         animations.stopTurn.setLoop(THREE.LoopRepeat, 1);
         animations.stopTurn.play();
         console.log("STOP playing");

    animations.walk.getMixer().removeEventListener('finished',walkToStopTurn);

    // });


    animations.stopTurn.getMixer().addEventListener('finished', function turnToWalkBack() {
   
        const finalRootPosition = new THREE.Vector3();
        const finalRootQuaternion = new THREE.Quaternion();
        rootBone.getWorldPosition(finalRootPosition);
        rootBone.getWorldQuaternion(finalRootQuaternion);
       
        character.position.set(finalRootPosition.x, character.position.y, finalRootPosition.z);
        character.quaternion.copy(finalRootQuaternion);


        animations.stopTurn.stop();
        animations.stopTurn.reset();
        animations.walk.setLoop(THREE.LoopRepeat, 2);
        animations.walk.play();
        isWalkingBack = true; // Resume walking from the new position
        console.log("walking AGAIN");
        animations.stopTurn.getMixer().removeEventListener('finished',turnToWalkBack);
    
    // });

    animations.walk.getMixer().addEventListener('finished', function endRound() {
        isWalkingBack = false;
        // playSequence();
        animations.walk.getMixer().removeEventListener('finished',endRound);
    });

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
const followLight = new THREE.PointLight(0xffffff, 4, 300);  // Color, intensity, and distance
followLight.position.set(-70, 460, 220);  // Set initial position above the character (adjust as needed)
scene.add(followLight);  // Add the light to the scene

// Add a helper to visualize the light (optional)
const lightHelper = new THREE.PointLightHelper(followLight, 10);  // Adjust size of the helper
scene.add(lightHelper);


//move forward while walking
let clock = new THREE.Clock();  // Create a clock to track delta time
let walkspeed = 2;  // Adjust this value to control how fast the character moves forward







//ANIMATE
function animate(){
requestAnimationFrame(animate);
controls.update();


if (mixer) {
     let delta = clock.getDelta();  // Get the time passed since the last frame
     mixer.update(delta); 
    
     if (isWalkingOut) {
        // Move the character forward in the direction it is facing
        const forward = new THREE.Vector3(0, 0, 1); // Forward vector in local space
        forward.applyQuaternion(character.quaternion); // Transform the forward vector to world space
        character.position.addScaledVector(forward, walkspeed); // Move the character forward
        console.log(character.position.z);
    }
    if (isWalkingBack) {
        // Move the character forward in the direction it is facing
        // const forward = new THREE.Vector3(0, 0, 1); // Forward vector in local space
        // forward.applyQuaternion(character.quaternion); // Transform the forward vector to world space
        // character.position.addScaledVector(forward, walkspeed); // Move the character forward
        // console.log(character.position.z);
         character.position.z-=walkspeed;
    }
     //character.position.z+=walkspeed;
     //followLight.position.set(character.position.z); 

     //rootBone.getWorldPosition(rootPosition); // Extract world position of the root bone
     //cube.position.copy(rootPosition);
     
    }
    // if (shouldCapturePosition) {
    //     rootBone.getWorldPosition(rootPosition);
    //     console.log("rootPosition-captured");
    //     console.log(rootPosition);
    // }
    if (openCall && textLight) {

        const time = clock.getElapsedTime();
        const amplitude = 200; // Distance the light will move left and right
        const speed = 2; // Speed of the motion
        textLight.position.x = openCall.position.x + Math.sin(time * speed) * amplitude;

        // You might also want to update the light helper's position
        textLightHelper.update();
    }

renderer.render(scene, camera);

}


animate();

