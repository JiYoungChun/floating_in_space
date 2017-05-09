// Body object
var Body = function (body) {
  // Create body with id, joints and ts.
  this.id = body.trackingId;
  this.attractorLeft = new Particle(new Vec2D(width/2, height/2), 1/3, width/3, 0.1);
  //this.attractorRight = new Particle(new Vec2D(width/2, height/2), 1/3, width/3, 0.2); 

  this.specialBubble;
  this.isBubbleCreated = false;

  // Local functio for creating Joint objects
  var createJoints = function () {
    var joints = [];
    for (var j = 0; j < body.joints.length; j++) {
      joints[j] = new Joint(j, body.joints[j]);
    }
    return joints;
  }
  var joints = createJoints();
  var ts = Date.now();

  // Update body joint and ts data
  this.update = function (body) {
    for (var j = 0; j < body.joints.length; j++) {
      joints[j].update(body.joints[j]);
      ts = Date.now();
    }
  }

  // Returns joint object for specified joint
  this.getJoint = function (joint) {
    return joints[joint];
  }

  // Returns position vector for specified joint
  this.getPosition = function (joint) {
    //console.log(this.joints[joint].pos);
    return joints[joint].pos;
  }

  // Check to see if body has been updated in last 5 seconds
  this.isDead = function () {
    return Date.now() - ts > DEATH_TH

    //kill attractors
  }
   this.setAttractorToLH = function(lhX, lhY)
  {
     this.attractorLeft.display();
     this.attractorLeft.set(lhX,lhY);

  }

}