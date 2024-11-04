//import * as THREE from 'three';
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

//set scene
const scene= new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;//enable shadow

document.body.appendChild(renderer.domElement);

//MARK the center
const markGeometry = new THREE.BoxGeometry( 10, 10, 10 ); 
const markMaterial = new THREE.MeshBasicMaterial( {color: 0x00ffaa} ); 
const centerMark = new THREE.Mesh( markGeometry, markMaterial ); 
centerMark.position.set(0,0,0);
scene.add(centerMark);

//GROUND
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(8000, 3500),
    new THREE.MeshStandardMaterial({ color: 0xffffff})
);
ground.rotation.x = -Math.PI / 2; 
ground.position.y = -20;
ground.receiveShadow = true; 
scene.add(ground);

//scene.fog = new THREE.Fog(0xf1f1f1, 1000, 1500);

//sky
const color1 = new THREE.Color(0xffffff); // Start color
const color2 = new THREE.Color(0x5d2727); // End color

const numberOfColors = 100; // Number of colors in the gradient
const colors = new Uint8Array(numberOfColors * 3); // 3 values (r, g, b) per color

// Generate gradient colors
for (let i = 0; i < numberOfColors; i++) {
    const color = color1.clone().lerp(color2, i / numberOfColors);
    colors.set([color.r * 255, color.g * 255, color.b * 255], i * 3);
}

// Create a texture from the colors array
// const gradientTexture = new THREE.DataTexture(colors, 1, numberOfColors, THREE.RGBFormat);
// gradientTexture.needsUpdate = true;

// Create a plane and apply the texture
// const backgroundMaterial = new THREE.MeshStandardMaterial({ map: gradientTexture });
// const backplane = new THREE.Mesh(new THREE.PlaneGeometry(8000, 2000), backgroundMaterial);
// backplane.position.z = -500; // Move behind other objects
// backplane.position.y = +980; // Move behind other objects
// scene.add(backplane);





//mark the rootbone
const geometry = new THREE.BoxGeometry(40, 40, 40);  // Size of the cube
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });  // Green color
const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);



//LOAD STAGE ELEMENTS
const blueelixirLoader = new FBXLoader();
let blueelixir;
blueelixirLoader.load('asset/mayablack_logo.fbx', function (fbxCharacter) {
    blueelixir = fbxCharacter;
    scene.add(blueelixir);

});  

// const silverclawLoader = new FBXLoader();
// let silverclaw;
// silverclawLoader.load('asset/mayasilver_claws.fbx', function (fbxCharacter) {
//     silverclaw = fbxCharacter;
//     scene.add(silverclaw);
// });  

const blackclawLoader = new FBXLoader();
let blackclaw;
blackclawLoader.load('asset/clawblack.fbx', function (fbxCharacter) {
    blackclaw = fbxCharacter;
    blackclaw.position.x-=80;
    scene.add(blackclaw);
    console.log(blackclaw.position);

    // blackclaw.traverse((child) => {
    //     if (child.isMesh) {
    //         child.castShadow = true;    // Allow the object to cast shadows
    //         child.receiveShadow = true; // Allow the object to receive shadows
    //     }
    // });
  //  blackclaw.castShadow = true; // Character will cast shadows

    const spotLight = new THREE.SpotLight(0xffffff);

    //SHADOW Setting
    spotLight.castShadow = true; // Enable shadows for this light
    spotLight.shadow.mapSize.width = 1024; // Shadow map resolution
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 0.4; // Shadow camera settings
    spotLight.shadow.camera.far = 400;
    spotLight.shadow.radius = 4;
   // spotLight.shadow.bias = -0.001;

    spotLight.angle = Math.PI / 7; // Controls the cone's spread angle
    spotLight.distance = 500; // Maximum range of the spotlight
    spotLight.penumbra = 0.5;
    // spotLight.position.set(-300, 300, 550); // Position the light above and in front of the model
    spotLight.position.set(-100, 300, 550);
    const clawTarget = new THREE.Object3D(); 
    clawTarget.position.set(-220, 40, 340); // Set the target position here (e.g., the origin)
    scene.add( clawTarget);
    spotLight.target = clawTarget; // Make the light point at the model
    scene.add(spotLight);
    spotLight.target.updateMatrixWorld();
    const spotLightHelper = new THREE.SpotLightHelper(spotLight,1);
    scene.add(spotLightHelper);
    spotLightHelper.update();
});  

const greencatLoader = new FBXLoader();
let greencat;
greencatLoader.load('asset/catgreen.fbx', function (fbxCharacter) {
    greencat = fbxCharacter;
    greencat.position.x+=220;
    greencat.position.z-=150;
    greencat.scale.set(1.2,1.2,1.2);
    scene.add(greencat);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.angle = Math.PI / 6; // Controls the cone's spread angle
spotLight.distance = 800; // Maximum range of the spotlight
spotLight.penumbra = 0.5;
    spotLight.position.set(450, 700, -100); // Position the light above and in front of the model
    const clawTarget = new THREE.Object3D(); 
    clawTarget.position.set(350, 0, -400); // Set the target position here (e.g., the origin)
    scene.add( clawTarget);
    spotLight.target = clawTarget; // Make the light point at the model
    // spotLight.target = greencat;
    scene.add(spotLight);
    spotLight.target.updateMatrixWorld();
    const spotLightHelper = new THREE.SpotLightHelper(spotLight,1);
    //scene.add(spotLightHelper);
    spotLightHelper.update();

});  
const blackcatLoader = new FBXLoader();
let blackcat;
blackcatLoader.load('asset/catblack.fbx', function (fbxCharacter) {
blackcat = fbxCharacter;
blackcat.position.x-=200;
blackcat.position.z+=790;
blackcat.position.y-=60;
blackcat.rotation.y = Math.PI / 2;
scene.add(blackcat);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.angle = Math.PI / 10; // Controls the cone's spread angle
spotLight.distance = 800; // Maximum range of the spotlight
spotLight.penumbra = 0.5;
spotLight.position.set(-100,600, 900); // Position the light above and in front of the model
const lightTarget = new THREE.Object3D(); 
lightTarget.position.set(-300, 300, 700); // Set the target position here (e.g., the origin)
scene.add( lightTarget);
spotLight.target = lightTarget; // Make the light point at the model
scene.add(spotLight);
spotLight.target.updateMatrixWorld();
const spotLightHelper = new THREE.SpotLightHelper(spotLight,1);
//scene.add(spotLightHelper);
spotLightHelper.update();

});  

const neonwugongLoader = new FBXLoader();
let neonwugong;
neonwugongLoader.load('asset/wugongblack.fbx', function (fbxCharacter) {
    neonwugong = fbxCharacter;
    neonwugong.position.z+=180;
    neonwugong.position.x-=20;
    neonwugong.position.y-=100;
    //neonwugong.scale.set(1.2,1.2,1.2);
    scene.add(neonwugong);
});  

const pinkframeLoader = new FBXLoader();
let pinkframe;
pinkframeLoader.load('asset/blackframe.fbx', function (fbxCharacter) {
    pinkframe = fbxCharacter;
    pinkframe.position.x += 210;
    pinkframe.position.y -= 520;
    pinkframe.position.z += 80;
    pinkframe.scale.set(2, 2, 2);
    scene.add(pinkframe);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.angle = Math.PI / 6; // Controls the cone's spread angle
    spotLight.distance = 800; // Maximum range of the spotlight
    spotLight.penumbra = 0.5;
    spotLight.position.set(0,700, 400); // Position the light above and in front of the model
    const lightTarget = new THREE.Object3D(); 
    lightTarget.position.set(0, 200, 0); // Set the target position here (e.g., the origin)
    scene.add( lightTarget);
    spotLight.target = lightTarget; // Make the light point at the model
    scene.add(spotLight);
    spotLight.target.updateMatrixWorld();
    const spotLightHelper = new THREE.SpotLightHelper(spotLight,1);
    //scene.add(spotLightHelper);
    spotLightHelper.update();

    
});  
// const silvertotemLoader = new FBXLoader();
// let silvertotem;
// silvertotemLoader.load('asset/mayasilver_totem.fbx', function (fbxCharacter) {
//     silvertotem = fbxCharacter;
//     scene.add(silvertotem);
// });  
const blacktotemLoader = new FBXLoader();
let blacktotem;
blacktotemLoader.load('asset/totemblack.fbx', function (fbxCharacter) {
    blacktotem = fbxCharacter;
    blacktotem.position.y+=70;
    scene.add(blacktotem);
});  





//LOAD 3D TEXT: open call
const openCallLoader = new FBXLoader();
let openCall;
const textLight = new THREE.PointLight(0xffffff, 3, 500); 
const textLightHelper = new THREE.PointLightHelper(textLight, 10); 

openCallLoader.load('asset/ocsilver.fbx', function (fbxCharacter) {
    openCall = fbxCharacter;
    openCall.position.set(camera.position.x,camera.position.y,camera.position.z-300);
    scene.add(openCall);
    // const textLight = new THREE.PointLight(0xffffff, 3, 500);  // Color, intensity, and distance

textLight.position.set(openCall.position.x+70, openCall.position.y+20, openCall.position.z+130);  // Set initial position above the character (adjust as needed)
//scene.add(textLight);  // Add the light to the scene
// const textLightHelper = new THREE.PointLightHelper(textLight, 10);  // Adjust size of the helper
//scene.add(textLightHelper);
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
let initialPosition = new THREE.Vector3();
let initialQuaternion = new THREE.Quaternion();
let isTransitioning = false; // New variable to manage transition state


//load character
    fbxLoader.load('asset/rig_cyborg_t.fbx', function (fbxCharacter) {
        character = fbxCharacter;
        //character.castShadow = true; 
        character.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;    // Allow the object to cast shadows
                child.receiveShadow = true; // Allow the object to receive shadows
            }
        });

        character.getWorldPosition(initialPosition);
        character.getWorldQuaternion(initialQuaternion); //get the initial location

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
         animations.walk.reset();
         isWalkingOut=false;
         console.log("walking end");
        //  animations.walk.reset();

         animations.stopTurn.setLoop(THREE.LoopRepeat, 1);
         animations.stopTurn.play();
         console.log("STOP playing");

    animations.walk.getMixer().removeEventListener('finished',walkToStopTurn);

    // });
 
    
    animations.stopTurn.getMixer().addEventListener('finished', function turnToWalkBack() {
        isTransitioning = true; // Set transition state
        character.visible = false; 

        const finalRootPosition = new THREE.Vector3();
        const finalRootQuaternion = new THREE.Quaternion();
        rootBone.getWorldPosition(finalRootPosition);
        rootBone.getWorldQuaternion(finalRootQuaternion);

        animations.stopTurn.stop();
        animations.stopTurn.reset();

        setTimeout(() => {
             //character.position.set(finalRootPosition.x, character.position.y, finalRootPosition.z);
            character.position.x = finalRootPosition.x;
            character.position.z = finalRootPosition.z;
            character.quaternion.copy(finalRootQuaternion);
    
            // Reset and prepare to play the walk animation
            animations.walk.reset();
            animations.walk.setLoop(THREE.LoopRepeat, 2);
            
            character.visible = true; 
            console.log("walking AGAIN");
            isTransitioning = false; // Reset transition state
        }, 50); // Delay time in milliseconds; adjust as needed

        isWalkingBack = true; 
        animations.walk.play();
    
        console.log("walking AGAIN");
        animations.stopTurn.getMixer().removeEventListener('finished',turnToWalkBack);
    
    // });

    animations.walk.getMixer().addEventListener('finished', function endRound() {


        isWalkingBack = false;
        animations.walk.stop();
         animations.walk.reset();
        character.position.copy(initialPosition);
        character.quaternion.copy(initialQuaternion);
   
        animations.walk.getMixer().removeEventListener('finished',endRound);
        playSequence();
        
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

// const frameLight = new THREE.PointLight(0xffffff, 4, 300);  // Color, intensity, and distance
// frameLight.position.set(-70, 460, 220);  // Set initial position above the character (adjust as needed)
// scene.add(frameLight);  // Add the light to the scene
// const frameLightHelper = new THREE.PointLightHelper(frameLight, 10);  // Adjust size of the helper
// scene.add(frameLightHelper);

// const followLight = new THREE.SpotLight(0xffffff);
// const followLightHelper = new THREE.SpotLightHelper(followLight,1);
// //light following character
// if(character){
// followLight.angle = Math.PI / 6; // Controls the cone's spread angle
// followLight.distance = 500; // Maximum range of the spotlight
// followLight.penumbra = 0.5;
// followLight.position.set(0, 0, 1000); // Position the light above and in front of the model
// followLight.target = character; // Make the light point at the model
// followLight.target.updateMatrixWorld(); 
// scene.add(followLight);
// scene.add(followLightHelper);
// followLightHelper.update();
// }

//move forward while walking
let clock = new THREE.Clock();  // Create a clock to track delta time
let walkspeed = 2;  // Adjust this value to control how fast the character moves forward



//ANIMATE
function animate(){
requestAnimationFrame(animate);
controls.update();
//followLightHelper.update();

if (mixer) {
     let delta = clock.getDelta();  // Get the time passed since the last frame
     mixer.update(delta); 
    
     if (isWalkingOut) {
        // Move the character forward in the direction it is facing
        const forward = new THREE.Vector3(0, 0, 1); // Forward vector in local space
        forward.applyQuaternion(character.quaternion); // Transform the forward vector to world space
        character.position.addScaledVector(forward, walkspeed); // Move the character forward
    }
    if (isWalkingBack) {
       //  character.position.z-=walkspeed;
         const backward = new THREE.Vector3(0, 0, 1); // Backward vector in local space
         backward.applyQuaternion(character.quaternion); // Transform to world space
         character.position.addScaledVector(backward, walkspeed); // Move character backward
    }
    }
  
    if (openCall && textLight) {

        const time = clock.getElapsedTime();
        const amplitude = 200; // Distance the light will move left and right
        const speed = 2; // Speed of the motion
       // textLight.position.x = openCall.position.x + Math.sin(time * speed) * amplitude;
        textLightHelper.update();
    }
renderer.render(scene, camera);
}

animate();

