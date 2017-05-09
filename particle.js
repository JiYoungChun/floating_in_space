function Particle(position, radius, range, strength) {
  VerletParticle2D.call(this,position);
  this.r= radius;
  this.or = radius;
 this.newBubble;
  this.color = color(255,255,255);
  this.isSpecialBubble = false;

  physics.addParticle(this);
  physics.addBehavior(new AttractionBehavior(this, range, strength,0.01));


  // Override the display method
  this.display = function(){
    noFill();

    if(!this.isSpecialBubble)
    {
      image(bubble,this.x-this.r,this.y-this.r,this.r*2,this.r*2);
    }
   // ellipse(this.x,this.y,this.r*2,this.r*2);
  }

  this.updateSpecialBubble = function(handX, handy, dist)
  {
    image(bubble,handX-this.r,handy-this.r,dist*2,dist*2);
    this.r = dist;
    this.x = handX;
    this.y = handy;
  }

  // this.clap = function(px,py)
  // {
   
  //  //particless.push(new Particle(new Vec2D(centerHandsX,centerHandsY),distHANDS/2,1,-0.1));

  // }

  //   this.unclap = function()
  // {
  //   this.r = this.or;
  //  // this.color = color(255,255,255);
  // }

  this.turnIntoSpecialBubble = function()
  {
    this.isSpecialBubble = true;
  }

  this.turnIntoRegularBubble = function()
  {
    this.isSpecialBubble = false;
  }
}

// Inherit from the parent class
Particle.prototype = Object.create(VerletParticle2D.prototype);
Particle.prototype.constructor = Particle;

