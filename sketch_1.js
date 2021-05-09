// define variables here so they are available to all functions
let all_stickmen = [];
let at_attn = 0;
let timer = 0;
const HEAD_SIZE = 10;


function setup() {
  // put setup code here
  createCanvas(400, 400);
  fill(0);
  all_stickmen.push(new dancing_stickman(200, 200));
  at_attn = all_stickmen.length - 1;
  // settings
  frameRate(10);
  //noLoop(); // should be the last line. Stops draw() function from being cont called
}

function draw() {
  // put drawing code here

  //user inputs
  if (keyIsPressed == true && all_stickmen.length > 0) {  //dangerous if at_attn has died
    all_stickmen[at_attn].move();
  }

  //background
  fill (255);
  rect(0, 0, width, height)

  update();

  for (let i = 0; i < all_stickmen.length; i++) {
    all_stickmen[i].display();
  }

  //BUTTONS
  //background block for number of stickmen
  fill(220);
  rect(0, 0, 80, 35);
  fill(0);
  text("Score: " + all_stickmen.length, 10, 20);

  //add random button - calls random new stickman constructor
  fill(220);
  rect (width - 80, 0, 80, 35);
  fill(0);
  text("Random", width - 60, 20);
  
}

function hitbox(i) {
  return collidePointPoint(mouseX, mouseY, all_stickmen[i].pos.x, all_stickmen[i].pos.y, HEAD_SIZE);
}

function find_collision(x_in, y_in, j) {
  //for now only head collisions
  if (collideCircleCircle(x_in, y_in, HEAD_SIZE, all_stickmen[j].pos.x, all_stickmen[j].pos.y, HEAD_SIZE)) {
    return true;
  }
  /*if (Math.hypot(all_stickmen[i].pos.x - all_stickmen[j].pos.x, all_stickmen[i].pos.y - all_stickmen[j].pos.y) < HEAD_SIZE) {
    return true;
    //head collision
  }*/
  //if (Math.dist(all_stickmen[i].pos.x - (all_stickmen[j].pos.x + /*left_arm_dx*/), all_stickmen[i].pos.y  - (all_stickmen[j].pos.y + /*left_arm_dy*/))) {
    //head_i to left_arm_j collision
  //}
  return false;
}


//puts clicked stickman at attention or creates new stickman
function mouseClicked() {
  if (mouseX > width - 80 && mouseY < 35) {
    all_stickmen.push(new dancing_stickman(random(width), random(height)));
    at_attn = all_stickmen.length - 1;
    return true;
  }
  let found = false;
  for (let i = 0; i < all_stickmen.length; i++) {
    //possibly replace below with a hitbox function
    if (hitbox(i)) {
      at_attn = i;
      found = true;
      return false;//?
    }    
  }
  if (!(found)) {
    all_stickmen.push(new dancing_stickman(mouseX, mouseY));
    at_attn = all_stickmen.length - 1;
    //make new stickman
  }
}

/*function keyPressed() {
  //see equivalent - 2nd item in draw() function
}*/


function update() {
  for (let i = 0; i < all_stickmen.length; i++) {
    all_stickmen[i].jolt(i);
    //hopefully order collisions and carry out each, then can just kill and return
  }

  for (let i = 0; i < all_stickmen.length; i++) {
    if ((all_stickmen[i].pos.x < 0 || all_stickmen[i].pos.x > width)
      || (all_stickmen[i].pos.y < 0 || all_stickmen[i].pos.y > width)) {//somehow this is killing all if original is killed
      all_stickmen.splice(i, 1);
      at_attn = all_stickmen.length - 1;
    }
  }
   
}

class dancing_stickman {
  constructor(x_in, y_in) {
    this.pos = createVector(x_in, y_in); //head position
    this.vel = createVector(0, 0);
    this.frame = 0;

    //joint representations
    this.chest = this.pos.copy();
    this.chest.add(0, (4/3*HEAD_SIZE));//initial position

    this.left_elbow = this.chest.copy();
    this.right_elbow = this.chest.copy();
    this.left_elbow.add((-2/3*HEAD_SIZE), 0);
    this.right_elbow.add((2/3*HEAD_SIZE), 0);

    this.left_hand = this.left_elbow.copy();
    this.right_hand = this.right_elbow.copy();
    this.left_hand.add(-HEAD_SIZE, -HEAD_SIZE);
    this.right_hand.add(HEAD_SIZE, -HEAD_SIZE); 

    this.pelvis = this.pos.copy();
    this.pelvis.add(0, (8/3*HEAD_SIZE));

    this.left_knee = this.pos.copy();
    this.right_knee = this.pos.copy();
    this.left_knee.add((-2/3*HEAD_SIZE), 4*HEAD_SIZE);
    this.right_knee.add((2/3*HEAD_SIZE), 4*HEAD_SIZE);

    this.left_foot = this.left_knee.copy();
    this.right_foot = this.right_knee.copy();
    this.left_foot.add(0, HEAD_SIZE);
    this.right_foot.add(0, HEAD_SIZE);

    this
  }

  //called by keyIsPressed in draw()
  move() {
    if (keyCode == UP_ARROW) {
      this.vel.sub(0, 1);    
    }
    if (keyCode == DOWN_ARROW) {
      this.vel.add(0, 1);
    }
    if (keyCode == LEFT_ARROW) {
      this.vel.sub(1, 0);
    }
    if (keyCode == RIGHT_ARROW) {
      this.vel.add(1, 0);
    }
    //find a way to make a kill (this stickman) button on keyboard
  }

  animate_joints() {
    //convert this to vector updates
    this.frame++;
    this.frame %= 10;
    this.chest.add(cos((this.frame * Math.PI) / (5)), 0);
    if (this.frame >2 && this.frame < 8) {
    this.left_elbow.add(-sin((this.frame * Math.PI) / (5)), (2 * cos((this.frame * Math.PI) / (5))));
    this.right_elbow.add(sin((this.frame * Math.PI) / (5)), (2 * cos((this.frame * Math.PI) / (5))));
    }
    else {
    this.left_elbow.add(sin((this.frame * Math.PI) / (5)), (2 * cos((this.frame * Math.PI) / (5))));
    this.right_elbow.add(-sin((this.frame * Math.PI) / (5)), (2 * cos((this.frame * Math.PI) / (5))));
    }
    this.left_hand.sub(0, HEAD_SIZE * cos((this.frame * Math.PI) / (5)));
    this.right_hand.sub(0, HEAD_SIZE * cos((this.frame * Math.PI) / (5)));
    this.pelvis.add((1.5 * cos((this.frame * Math.PI) / (5))), 0);
    this.left_knee.add(cos((this.frame * Math.PI) / (5)), 0);
    this.right_knee.add(cos((this.frame * Math.PI) / (5)), 0);
    this.left_foot.add(HEAD_SIZE * cos((this.frame * Math.PI) / (5)), 0);
    this.right_foot.add(HEAD_SIZE * cos((this.frame * Math.PI) / (5)), 0);

  }

  update_pos(vec) {
    this.pos.add(vec);
    this.chest.add(vec);
    this.left_elbow.add(vec);
    this.right_elbow.add(vec);
    this.left_hand.add(vec);
    this.right_hand.add(vec);
    this.pelvis.add(vec);
    this.left_knee.add(vec);
    this.right_knee.add(vec);
    this.left_foot.add(vec);
    this.right_foot.add(vec);
  }


  jolt(j) { //the frame-to-frame updater

    //update joint representations of this stickman in place
    this.animate_joints();

    for (let i = j + 1; i < all_stickmen.length; i++) {
      //go through once and assume an order of collisions
      if (this.pos.dist(all_stickmen[i].pos) < 6*HEAD_SIZE) {
        //check which collision is happening
        //or none
        //maybe only do head-to collisions instead of worrying about arm-to-arm etc

        //head-to-head collision
        if (collideCircleCircle(this.pos.x + this.vel.x, this.pos.y + this.vel.y, HEAD_SIZE, all_stickmen[i].pos.x, all_stickmen[i].pos.y, HEAD_SIZE)) {
          //swap velocities and keep going
          let temp = this.vel;
          this.vel = all_stickmen[i].vel;
          all_stickmen[i].vel = temp;
        }

        //head-to-hand
        //j left_hand to head collision
        else if (collideCircleCircle(all_stickmen[i].left_hand.x, all_stickmen[i].left_hand.y, HEAD_SIZE/3, this.pos.x, this.pos.y, HEAD_SIZE)) {
          let temp_1 = this.vel;
          let temp_2 = all_stickmen[i].vel;
          let hand_vel = createVector(0, HEAD_SIZE * cos((all_stickmen[i].frame * Math.PI) / (5))); //same as update
          this.vel = temp_2.add(hand_vel); //somehow not transferring hand velocity to y component
          all_stickmen[i].vel = temp_1.sub(hand_vel);
          //this.vel = other.vel + hand velocity
          //other.vel = this.vel - hand velocity 
        }
        //j right hand to head collision
        else if (collideCircleCircle(all_stickmen[i].right_hand.x, all_stickmen[i].right_hand.y, HEAD_SIZE/3, this.pos.x, this.pos.y, HEAD_SIZE)) {
          let temp_1 = this.vel;
          let temp_2 = all_stickmen[i].vel;
          let hand_vel = createVector(0, HEAD_SIZE * cos((all_stickmen[i].frame * Math.PI) / (5)));
          this.vel = temp_2.add(hand_vel);
          all_stickmen[i].vel = temp_1.sub(hand_vel);
          //console.log(hand_vel);
        }
        //j head to right hand
        else if (collideCircleCircle(this.right_hand.x, this.right_hand.y, HEAD_SIZE/3, all_stickmen[i].pos.x, all_stickmen[i].pos.y, HEAD_SIZE)) {
          let temp_1 = this.vel;
          let temp_2 = all_stickmen[i].vel;
          let hand_vel = createVector(0, HEAD_SIZE * cos((this.frame * Math.PI) / (5)));
          this.vel = temp_2.add(hand_vel);
          all_stickmen[i].vel = temp_1.sub(hand_vel);
        }
        //j head to left hand
        else if (collideCircleCircle(this.left_hand.x, this.left_hand.y, HEAD_SIZE/3, all_stickmen[i].pos.x, all_stickmen[i].pos.y, HEAD_SIZE)) {
          let temp_1 = this.vel;
          let temp_2 = all_stickmen[i].vel;
          let hand_vel = createVector(0, HEAD_SIZE * cos((this.frame * Math.PI) / (5)));
          this.vel = temp_2.add(hand_vel);
          all_stickmen[i].vel = temp_1.sub(hand_vel);
        }

        //foot-to-head
        //j left_foot to head
        else if (collideCircleCircle(all_stickmen[i].left_foot.x, all_stickmen[i].left_foot.y, HEAD_SIZE/3, this.pos.x, this.pos.y, HEAD_SIZE)) {
          let temp_1 = this.vel;
          let temp_2 = all_stickmen[i].vel;
          let foot_vel = createVector(HEAD_SIZE * cos((this.frame * Math.PI) / (5)), 0); //same as update
          this.vel = temp_2.add(foot_vel);
          all_stickmen[i].vel = temp_1.sub(foot_vel);
          //this.vel = other.vel + foot velocity
          //other.vel = this.vel - foot velocity 

        }
        //j right_foot to head
        else if (collideCircleCircle(all_stickmen[i].right_foot.x, all_stickmen[i].right_foot.y, HEAD_SIZE/3, this.pos.x, this.pos.y, HEAD_SIZE)) {
          let temp_1 = this.vel;
          let temp_2 = all_stickmen[i].vel;
          let foot_vel = createVector(HEAD_SIZE * cos((this.frame * Math.PI) / (5)), 0); //same as update
          this.vel = temp_2.add(foot_vel);
          all_stickmen[i].vel = temp_1.sub(foot_vel);

        }        
        //j head to right_foot
        else if (collideCircleCircle(this.right_foot.x, this.right_foot.y, HEAD_SIZE/3, all_stickmen[i].pos.x, all_stickmen[i].pos.y, HEAD_SIZE)) {
          let temp_1 = this.vel;
          let temp_2 = all_stickmen[i].vel;
          let foot_vel = createVector(HEAD_SIZE * cos((all_stickmen[i].frame * Math.PI) / (5)), 0); //same as update
          this.vel = temp_2.add(foot_vel);
          all_stickmen[i].vel = temp_1.sub(foot_vel);
        }
        //j head to left_foot
        else if (collideCircleCircle(this.left_foot.x, this.left_foot.y, HEAD_SIZE/3, all_stickmen[i].pos.x, all_stickmen[i].pos.y, HEAD_SIZE)) {
          let temp_1 = this.vel;
          let temp_2 = all_stickmen[i].vel;
          let foot_vel = createVector(HEAD_SIZE * cos((all_stickmen[i].frame * Math.PI) / (5)), 0); //same as update
          this.vel = temp_2.add(foot_vel);
          all_stickmen[i].vel = temp_1.sub(foot_vel);

        }

      }
      
    }
    //move all joints by vel
    this.update_pos(this.vel);
    this.vel.mult(0.9); //damping
  }

  //graphical representation of the dancing stickman
  //10 frames per cycle
  display() {
    //body
    line(this.pos.x, this.pos.y, this.chest.x, this.chest.y);
    line(this.chest.x, this.chest.y, this.pelvis.x, this.pelvis.y)
    //hips
    line(this.pelvis.x, this.pelvis.y, this.left_knee.x, this.left_knee.y);
    line(this.pelvis.x, this.pelvis.y, this.right_knee.x, this.right_knee.y);
    //lower legs
    line(this.left_knee.x, this.left_knee.y, this.left_foot.x, this.left_foot.y);
    line(this.right_knee.x, this.right_knee.y, this.right_foot.x, this.right_foot.y);
    //upper arms
    line(this.chest.x, this.chest.y, this.left_elbow.x, this.left_elbow.y);
    line(this.chest.x, this.chest.y, this.right_elbow.x, this.right_elbow.y);
    //lower arms
    line(this.left_elbow.x, this.left_elbow.y, this.left_hand.x, this.left_hand.y);
    line(this.right_elbow.x, this.right_elbow.y, this.right_hand.x, this.right_hand.y);
    //head
    fill(150, 255, 0);
    if (all_stickmen[at_attn].pos == this.pos) { //diff head color to indicate at_attn
      fill(255, 150, 0);
    }
    ellipse(this.pos.x, this.pos.y, HEAD_SIZE);
    fill(0);
    ellipse(this.right_hand.x, this.right_hand.y, HEAD_SIZE/3);
    ellipse(this.left_hand.x, this.left_hand.y, HEAD_SIZE/3);
    ellipse(this.right_foot.x, this.right_foot.y, HEAD_SIZE/3);
    ellipse(this.left_foot.x, this.left_foot.y, HEAD_SIZE/3);
  }
}