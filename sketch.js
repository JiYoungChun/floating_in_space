/*
Kinect code from 
Mimi Yin NYU-ITP
Drawing skeleton joints and bones.
 */
var physics
var specialParticles = [];
var particless = [];
var particlesss = [];
var attractor;
var bubbleRadius;

var kinectron = null;

var bm = new BodyManager();
var DEATH_TH = 1000;
var bubble;
var song;
var backgroundSound;

function preload() {
    bubble = loadImage("/assets/bubble1.png");
    song = loadSound("/assets/sound.wav");
    backgroundSound = loadSound("/assets/bSound.mp3");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    backgroundSound.play();

    // Define and create an instance of kinectron
    kinectron = new Kinectron("172.16.222.213");
    // Connect with application over peer
    kinectron.makeConnection();
    // Request all tracked bodies and pass data to your callback
    kinectron.startTrackedBodies(bodyTracked);

    // console.log(kinectron);
    physics = new VerletPhysics2D();
    physics.setDrag(0.01);
    particless = [];

    for (var i = 0; i < 300; i++) {
        particless.push(new Particle(new Vec2D(random(width), random(height)), random(1, 30), 20, -0.1));
    }
    for (var j = 0; j < 300; j++) {
        particlesss.push(new Particle(new Vec2D(random(width), random(height)), random(3, 15), 20, -0.1));
    }

    // Set the world's bounding box
    physics.setWorldBounds(new Rect(0, 0, width, height));
    setInterval(function() {
        location.reload();
    }, 120000);

}

function draw() {
    physics.update();
    background(0);

    drawParticles();
    updateJoints();
}

function drawParticles()
{
    for (var j = 0; j < specialParticles.length; j++) {
        specialParticles[j].display();
    }

    for (var i = 0; i < particless.length; i++) {
        particless[i].display();
    }

    for (var i = 0; i < particlesss.length; i++) {
        particlesss[i].display();
    }
}

function updateJoints()
{
  var bodies = bm.getBodies();
  if (bodies.length > 0) {
        var body = bodies[0];
        var jointLeft = bodies[0].getJoint(kinectron.HANDLEFT);
        var jointRight = bodies[0].getJoint(kinectron.HANDRIGHT);
        var speedLeftHand = jointLeft.speed * 100;
        var screenPosR = getPosOnScreen(jointRight.pos);
        var rightHandX = screenPosR.x;
        var rightHandY = screenPosR.y;

        fill(0, 255, 0);
        ellipse(rightHandX, rightHandY, 100, 100);

        var screenPosL = getPosOnScreen(jointLeft.pos)
        var leftHandX = screenPosL.x;
        var leftHandY = screenPosL.y;

        body.setAttractorToLH(leftHandX, leftHandY);

        stroke(255);
        strokeWeight(0);
        line(leftHandX, leftHandY, rightHandX, rightHandY);

        var distHANDS = dist(leftHandX, leftHandY, rightHandX, rightHandY);
        var centerHandsX = (leftHandX + rightHandX) / 2;
        var centerHandsY = (leftHandY + rightHandY) / 2;

        bubbleRadius = distHANDS / 2

        if (distHANDS < 35) {
            if (!body.isBubbleCreated) /// switch to create only one special bubble at a time
            {
                body.isBubbleCreated = true;
                body.specialBubble = new Particle(new Vec2D(centerHandsX, centerHandsY), bubbleR, 1, -0.3);
                body.specialBubble.turnIntoSpecialBubble();
            }
        }

        if (body.specialBubble != null) {
            if (distHANDS < 100) {
                body.specialBubble.updateSpecialBubble(centerHandsX, centerHandsY, distHANDS);
                playSound(speedLeftHand);
            } else {
                body.specialBubble.turnIntoRegularBubble();
                body.isBubbleCreated = false; //special bubble -> regular bubble

                var newRegularbubble = body.specialBubble;
                specialParticles.push(newRegularbubble);
                body.specialBubble = null;

            }
        }
    }
}

function getPosOnScreen(joint) {

    var vector = createVector(width - ((joint.x * width / 2) + width / 2), (-joint.y * width / 2) + height / 2);
    return vector;
}


function playSound(speedRate) {
    var rate = map(speedRate, 0, 20, 0, 1.5);
    var volume = map(speedRate, 0, 20, 0, 1);
    // song.setRate
    // song.rate()
    song.rate(rate);
    song.setVolume(volume); // 0-1 
    if (!song.isPlaying())
        song.play();
}



function bodyTracked(body) {
    var id = body.trackingId;
    // When there is a new body, add it
    if (!bm.contains(id)) bm.add(body);
    // Otherwise, update it
    else bm.update(body);
}