var dog, dog1, HappyDog;
var database, dogref;
var foodS;
var bg;
var feed, addFood, fedTime, lastFed, foodO;

function preload() {
    dog1 = loadImage("dogImg.png");
    HappyDog = loadImage("dogImg1.png");
    bg = loadImage("field.png");
}

function setup(){
    database = firebase.database();
    createCanvas(1000,500);
    dog = createSprite(900,300,50,100);
    dog.addImage(dog1);
    dog.scale=0.3;

    dogref = database.ref("food");
    dogref.on("value",readStock,showError);

    feed=createButton("Feed Padfoot");
    feed.position(700,95);
    feed.mousePressed(feedPadfoot);

    addFood=createButton("Add food");
    addFood.position(820,95);
    addFood.mousePressed(increaseFood);

    timeRef=database.ref("fedTime");
    timeRef.on("value",function(data){
        lastFed=data.val();
    });

    food=new Food();    
}

function draw(){
    background(bg);
    food.display();

    textFont("Comic Sans MS");
    fill("red");
    textSize(20);
    text("Food Remaining: "+foodS,150,100);
    text("Press the up arrow to feed Padfoot.",100,50);

    if(lastFed>=12) {
        text("Last fed at: "+lastFed%12+" p.m.",750,50);
    } else if (lastFed===0) {
        text("Last fed at: 12 a.m.",750,50);
    } else {
        text("Last fed at: "+lastFed+" a.m.",750,50);
    }
    drawSprites();
}
function readStock(data) {
    foodS = data.val();
}
function showError() {
    console.log("Cannot read the values from the database.");
}
function feedPadfoot() {
    dog.addImage(HappyDog);
    dog.x=850;
    if (foodS>=1) {
    foodS-=1;
    }
    food.updateStock(foodS);
    updateHour(hour());
}
function increaseFood() {
    dog.addImage(dog1);
    if (foodS<20) {
    foodS+=1;
    }
    food.updateStock(foodS);
}
function getHour(data) {
    lastFed=data.val();
}
function updateHour(lastFedTime) {
    database.ref("/").update({fedTime:lastFedTime});
}