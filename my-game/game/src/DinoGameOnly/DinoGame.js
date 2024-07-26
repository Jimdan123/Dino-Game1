
// Create a single touch event listener and write the callback code
var listener1 = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
    swallowTouches: true,
    //onTouchBegan event callback function
    onTouchBegan: function (touch, event) { 
        // event.getCurrentTarget() returns the *listener's* sceneGraphPriority node.   
        var target = event.getCurrentTarget();  

        //Get the position of the current point relative to the button
        var locationInNode = target.convertToNodeSpace(touch.getLocation());    
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        //Check the click area
        if (cc.rectContainsPoint(rect, locationInNode)) {       
            cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
            target.opacity = 180;
            return true;
        }
        //cc.log("touch");
        
        return false;
    },
    //Trigger when moving touch
  
    //Process the touch end event
    onTouchEnded: function (touch, event) {         
        var target = event.getCurrentTarget();
        cc.log("sprite onTouchesEnded.. ");
        target.setOpacity(255);
        target.getParent().gameStart();
        //Reset zOrder and the display sequence will change
    }
});

var dl = cc.Layer.extend({
    startDuration: 0.8, 
    helloLabel:null,
    tmpScore: null,
    sprite:null,
    spriteDino:null,
    spriteDinoJump:null,
    spriteBird: null,
    spriteCactus: null,
    spriteCloud1: null,
    spriteCloud2: null,
    spriteCloud3: null,
    cloudMinHeight: 280,
    cloudMaxHeight: 380,
    cloudSpeed: 50,
    trackSpeed: 9.5,
    cactusSpeed: 1,
    jumpHeight: 190,
    jumpDuration: 0.44, 
    cactusSpawnInterval: 1,
    gameState: "init",
    dinoState: "run",
    press: false,
    score: 0,
    lastScore: 0,
    sizeWidth: null,
    sizeHeight: null,
    delay: true,
    delayValue: 10000,
    init:function () 
    {
        this.tmpScore = 0;
        this.sizeWidth =  cc.director.getWinSize().width; 
        this.sizeHeight = cc.director.getWinSize().height;
        //////////////////////////////
        // 1. super init first
        this._super();
        this.downKeyPressed = false;
        this.gameState = "mainMenu";
        cc.log(this.gameState);
        this.cacti = [];
        this.birds = [];
        var givenNumbers = 0; 
        var scaleLength = 0.7; 
        var scaleWidth = 0.7; 

        var posX = this.sizeWidth - 150; 
        var posY = this.sizeHeight / 1.2;

        var highScoreX = posX - 200; 
        var highScoreY = posY;
        var highScoreScaleLength = 0.7; 
        var highScoreScaleWidth = 0.7; 
        /*
        if ('keyboard' in cc.sys.capabilities)
            {
                var keyboardListener =
                {
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function(key, event)
                    {
                        var ld_inst = event.getCurrentTarget();
                        if (ld_inst.press == false)
                        {
                            ld_inst.gameStart();
                            ld_inst.press = true;
                        }
                    }
                };
                cc.eventManager.addListener(keyboardListener, this);
            }
        */
        cc.spriteFrameCache.addSpriteFrames(numberPos, number);
        this.allDigits = new Array(6); 
        for (var i = 0; i < 6; i++)
        {
            this.allDigits[i] = new cc.Sprite("#number_0.png");
            this.allDigits[i].setPosition(posX,posY); 
            this.allDigits[i].setVisible(false);
            this.allDigits[i].setScale(scaleLength,scaleWidth); 
            this.addChild(this.allDigits[i],1);
            posX += 20;
        }

        this.highScore = new Array(6);  
        for (var i = 0; i < 6; i++)
        {
            this.highScore[i] = new cc.Sprite("#number_0.png");
            this.highScore[i].setPosition(highScoreX,highScoreY); 
            this.highScore[i].setScale(highScoreScaleLength,highScoreScaleWidth);
            this.highScore[i].setVisible(false);
            this.highScore[i].setScale(scaleLength,scaleWidth); 
            this.addChild(this.highScore[i],1);
            highScoreX += 20;
        }
        cc.spriteFrameCache.addSpriteFrames(gameOverPos, gameOver);


        this.spriteTrack1 = new cc.Sprite("#track.png");
        this.spriteTrack1.setAnchorPoint(0.5, 0.5);
        this.spriteTrack1.setPosition(this.sizeWidth / 2, 165);
        this.spriteTrack1.setVisible(false);
        this.addChild(this.spriteTrack1, 1);

        this.spriteGameOver = new cc.Sprite("#game_over.png");
        this.spriteGameOver.setVisible(false);
        this.spriteGameOver.setPosition(this.sizeWidth /2, this.sizeHeight / 1.5);
        this.addChild(this.spriteGameOver, 3);

        this.spriteReset = new cc.Sprite("#reset.png");
        this.spriteReset.setVisible(false);
        cc.eventManager.addListener(listener1, this.spriteReset);
        this.spriteReset.setPosition(this.sizeWidth / 2, this.sizeHeight / 2);
        this.addChild(this.spriteReset, 3);

        this.spriteTrack2 = new cc.Sprite("#track.png");
        this.spriteTrack2.setAnchorPoint(0.5, 0.5);
        this.spriteTrack2.setVisible(false);
        this.spriteTrack2.setPosition((this.sizeWidth / 2) + this.spriteTrack1.getContentSize().width, 165);
        this.addChild(this.spriteTrack2, 1);

        this.helloLabel = new cc.LabelTTF("Press any key to start", "Outlined", 38);
        this.helloLabel.setFontFillColor(cc.color(105,105,105));
        this.helloLabel.setPosition(this.sizeWidth / 2, this.sizeHeight / 2);
        this.addChild(this.helloLabel,3);

        cc.spriteFrameCache.addSpriteFrames(dinoPos, dino);
        this.spriteDino = new cc.Sprite("#dino_start.png");
        //this.spriteDino.setPosition(55, 200);
        this.spriteDino.setAnchorPoint(0.5,0.5); 
        this.setupDinoAnim();
        this.resetDino();
        this.addChild(this.spriteDino, 10);

        cc.spriteFrameCache.addSpriteFrames(birdPos, bird);
        this.spriteBird = new cc.Sprite("#bird_1.png");
        this.birdFrames = [];
        this.birdFrames.push(cc.spriteFrameCache.getSpriteFrame("bird_1.png"));
        this.birdFrames.push(cc.spriteFrameCache.getSpriteFrame("bird_2.png"));
        var birdAnimation = new cc.Animation(this.birdFrames, 0.2);
        var birdAnimate = cc.animate(birdAnimation).repeatForever();
        this.spriteBird.runAction(birdAnimate);
        this.addChild(this.spriteBird);
        this.spriteBird.setVisible(false);
        this.birds.push(this.spriteBird);

        cc.spriteFrameCache.addSpriteFrames(cactusPos, cactus);
        this.spriteCactus = new cc.Sprite("#cactus_1.png");
        
        this.spriteCloud1 = new cc.Sprite("#cloud.png"); 
        this.spriteCloud2 = new cc.Sprite("#cloud.png");
        this.spriteCloud3 = new cc.Sprite("#cloud.png"); 
    
        var cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
        this.spriteCloud1.setPosition(this.sizeWidth / 3,cloudHeight);
        cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
        this.spriteCloud2.setPosition(this.sizeWidth / 3 * 2, cloudHeight);
        cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
        this.spriteCloud3.setPosition(this.sizeWidth,cloudHeight);

        this.spriteCloud1.setVisible(false); 
        this.spriteCloud2.setVisible(false); 
        this.spriteCloud3.setVisible(false);

        this.addChild(this.spriteCloud1,1);
        this.addChild(this.spriteCloud2,1);
        this.addChild(this.spriteCloud3,1); 
        
        this.start = new cc.Sprite("White.jpg");
        this.start.setAnchorPoint(0,0);
        this.start.setPosition(0,0); 
        this.start.setScale(10,1);   
        this.addChild(this.start,2); 

        if ('keyboard' in cc.sys.capabilities) {
            var keyboardListener = {
                event: cc.EventListener.KEYBOARD, 

                onKeyPressed: function(key, event) 
                {
                    var t = event.getCurrentTarget();
                    t.onKeyPressed(key);
                },

                onKeyReleased: function(key, event) 
                {
                    var t = event.getCurrentTarget();
                    t.onKeyReleased(key);
                }
            };
            cc.eventManager.addListener(keyboardListener, this);
        } 

        
        this.theNumber(givenNumbers);
        // get screen size
        // add "Helloworld" splash screen"

        this.cactusCooldown = this.cactusSpawnInterval ;
        this.birdCooldown = this.birdSpawnInterval ;
        this.schedule(this.tick, 0.1);

        this.setupMainMenuState();
        
    },

    setupMainMenuState: function()
    {
        this.gameState = "mainMenu";
        this.showMainMenuObj();

        this.setScale(0.5, 0.5);
    },

    gameTime: 0,
    //cactusCooldown: 0,
    lastCactusTime: 0,
    birdCooldown: 0,
    distance: 1,
    tick: function()
    {
        this.cactusCooldown -= 0.1;
        if (this.cactusCooldown  <= 0)
        {
            this.cactusCooldown = this.cactusSpawnInterval + Math.random() * 0.5;
            if (Math.random() > 0.3) {
                this.spawnCactus();
            }
            else {
                this.spawnBird();
            }
        }
    },

    turningDelayTrue: function()
    {
        this.delay = true;
    },

    warmingUp: function()
    {
        this.gameState = "warmUp";

        cc.log("warmingUP");

        this.spriteDino.stopAllActions();
        var jumpMotion = this.buildJumpAction();
        var seqAction = cc.sequence(jumpMotion, cc.callFunc(this.changingToWarmUp, this));
        this.spriteDino.runAction(seqAction);

    },

    changingToWarmUp: function()
    {
        cc.log("changingToWarmUp");
        this.hideMainMenuObj();

        //dino run
        this.run();

        //this.gameStart();
        this.movingAtStart();

        // cc.log(this.gameState);
    },

    movingAtStart: function() 
    {
        cc.log(this.startDuration);

        var moving = cc.MoveTo.create(this.startDuration,cc.p(this.sizeWidth, 200));
       
        var movingMotion = cc.sequence(moving,cc.callFunc(this.endMoving, this));

        cc.log("movingAtStart");

        this.start.runAction(movingMotion);
    },
    
    endMoving: function()
    {
        cc.log("endMoving 1");
        this.removeChild(this.start);
        cc.log("endMoving 2");
        var scaling = cc.scaleTo(2, 1, 1);
        cc.log("endMoving 3");
        var scaleMotion = cc.sequence(scaling, cc.callFunc(this.endScaling, this));

        cc.log("endMoving 4");

        this.runAction(scaleMotion);
    },

    endScaling: function()
    {
        this.gameStart();
    },

    theNumber: function(givenNumbers)
    {
        // while (true){cc.log(this.gameState);}
        if(this.gameState == "gameOver") 
        {
            for (var i = 5; i > -1; i--)
            {
                var tmp = givenNumbers % 10;  
                var frameName = "number_" +  tmp + ".png";
                this.highScore[i].setSpriteFrame(frameName);
                givenNumbers = parseInt(givenNumbers / 10);
            }
        }
        for (var i = 5; i > -1; i--)
        {
            var tmp = givenNumbers % 10;  
            var frameName = "number_" +  tmp + ".png";
            this.allDigits[i].setSpriteFrame(frameName);
            givenNumbers = parseInt(givenNumbers / 10);
        }
    },

    hideGameObjects: function()
    {
        this.spriteTrack1.setVisible(false); 
        this.spriteTrack2.setVisible(false);
        this.spriteCloud1.setVisible(false); 
        this.spriteCloud2.setVisible(false);
        this.spriteCloud3.setVisible(false);
        //this.spriteDino.setVisible(false);
      
    },

    cleanEntities: function()
    {
        for(var i = 0; i < this.cacti.length; i++)
        {
            this.cacti[i].removeFromParent();
        }
        this.cacti = [];
        
        for(var i = 0; i < this.birds.length; i++)
        {
            this.birds[i].setVisible(false); 
        }
    },

    resetDino: function()
    {
         this.spriteDino.setPosition(55,200);

         this.dinoState = "";
    },

    showGameObjects: function()
    {
        this.spriteTrack1.setVisible(true);
        this.spriteTrack2.setVisible(true);

        this.spriteCloud1.setVisible(true);
        this.spriteCloud2.setVisible(true);
        this.spriteCloud3.setVisible(true);
       
    },

    hideScore: function()
    {
        for(var i = 0; i < this.allDigits.length; i++)
        {
            this.allDigits[i].setVisible(false);   
            this.highScore[i].setVisible(false); 
        }
    },

    showScore: function()
    {
        for(var i = 0; i < this.allDigits.length; i++)
        {
            this.allDigits[i].setVisible(true);
            this.highScore[i].setVisible(true);
        }
    },

    showMainMenuObj: function()
    {
        this.helloLabel.setVisible(true);
    },

    hideMainMenuObj: function()
    {
        this.helloLabel.setVisible(false);
    },

    showResultMenuObj: function()
    {
        this.spriteGameOver.setVisible(true);
        this.spriteReset.setVisible(true);
    },

    hideResultMenuObj: function()
    {
        this.spriteGameOver.setVisible(false);
        this.spriteReset.setVisible(false);
    },

    //change game state To Running
    gameStart: function()
    {
        this.gameState = "running";

        this.hideMainMenuObj();

        //cleanup old game
        this.hideResultMenuObj();
        this.cleanEntities();
        this.resetDino();

        this.score = 0;
        this.showScore();
        setInterval(() =>{this.score += 1},50);

        this.showGameObjects();
        this.cacti.forEach(cactus => cactus.resume());
        this.birds.forEach(bird => bird.resume());

         //run dino anim
        this.dinoState = "run";
        this.run();

        //demo scale screen
        /*
        this.setScale(0.2,0.2);
        var actionScale = cc.scaleTo(2,1,1);
        this.runAction(actionScale);
        */
    },
        
    achievement: function()
    {
        // if(this.tmpScore + 100 == this.score) 
        // {
        //     for ()
        // }
    },

    onKeyPressed: function(key)
    {
        // Jump
        if (this.gameState == "gameOver") return;

        if (this.gameState == "mainMenu")
        {
            this.warmingUp();
        }
        else if (this.gameState == "running")
        {
            if (key === cc.KEY.space) 
            {
                if (this.dinoState === "run") 
                {
                    this.dinoState = "jump";
                    this.jump();
                    this.spriteDino.setSpriteFrame("dino_jump.png");
                }
    
                cc.log("Key space pressed");
            }
            else if (key === cc.KEY.down) 
            {
                this.downKeyPressed = true;
    
                if (this.dinoState === "run")
                {
                    this.dinoState = "duck";
                    this.duck();
                }
                else if (this.dinoState === "jump") {
                    // print("co Jump");
                    this.cancelJump();
                }
                
                cc.log("Key down pressed");
            }
        }
        
        // else 
        // { 
        //     this.dinoState = "run";
        //     cc.log(this.gameState);
        // }
    },

    onKeyReleased: function(key)
    {
        if (key === cc.KEY.space) 
        {   
            if (this.dinoState == "jump") {
                // this.spriteDino.moveTo(200, 200);
                // this.dinoState = "run";
                // this.run();
                cc.log("Run after Jump");
            }
            cc.log("Key space released");

            if (this.dinoState == "run") {
                cc.log("Running");
            }
            
        }
        else if (key === cc.KEY.down) 
        {
            this.downKeyPressed = false; 
            if(this.gameState == "gameOver") return;
            
            if (this.dinoState != "jump")
            {
                this.dinoState = "run";
                this.run();
            }
        
            cc.log("Key down released");
        }
    },

    setupDinoAnim: function() {
        // Run animation
        this.animRun = new cc.Animation();
        for (var i = 1; i <= 2; i++) {
            var frameName = "dino_run_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(frameName);
            this.animRun.addSpriteFrame(frame); 
        }
        this.animRun.setDelayPerUnit(0.1);

        this.animJump = new cc.Animation(); 
        this.animJump.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("dino_jump.png"));
        
        // Duck animation
        this.animDuck = new cc.Animation();
        for (var i = 1; i <= 2; i++) {
            var frameName = "dino_duck_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(frameName);
            this.animDuck.addSpriteFrame(frame); 
        }
        this.animDuck.setDelayPerUnit(0.1);
        this.animDuck.setLoops(999999);

        
        //ani blinking eye to do list
        
    },

    buildJumpAction: function()
    {
        var jumpAnimate = cc.animate(this.animJump);

        var jumpUp = cc.moveBy(this.jumpDuration * 0.5, cc.p(0, this.jumpHeight)).easing(cc.easeOut(2.0));

        var jumpDown = cc.moveBy(this.jumpDuration * 1, cc.p(0, -this.jumpHeight)).easing(cc.easeIn(2.0));

        var jumpMotion = cc.sequence(jumpAnimate, jumpUp, jumpDown);
    
        return jumpMotion;
    },

    jump: function() {
        this.spriteDino.stopAllActions();

        var jumpMotion = this.buildJumpAction();

        var seqAction = cc.sequence(jumpMotion, cc.callFunc(this.endJump, this));
       
        this.spriteDino.runAction(seqAction);
        //this.spriteDino.runAction(cc.animate(this.animJump));
    },

    cancelJump: function() {
        var timeToJump = Math.sqrt((2*(this.spriteDino.getPositionY() - 200)) / 18000);
        cc.log(timeToJump);  
        this.spriteDino.stopAllActions();
        //do cao hien tại suy ra thời gian chạm đất
        var jumpDown = cc.moveTo(timeToJump, cc.p(55, 200));
        var AfterJump = cc.callFunc(function() {
            if (!this.downKeyPressed) { 
                this.dinoState = "run"; 
                this.run();
            } 
            else {
                this.dinoState = "duck";
                this.duck(); 
            }
        }, this);
    
        this.spriteDino.runAction(cc.sequence(jumpDown, AfterJump));
    },
    

    endJump: function() {
        // cc.log(this.spriteDino.getPosition());
        this.dinoState = "run";
        this.run();
    },

    duck: function() 
    {
        this.spriteDino.stopAllActions();
        this.spriteDino.runAction(cc.animate(this.animDuck));
    },

    run: function() 
    {
        this.spriteDino.stopAllActions();
        this.spriteDino.runAction(cc.repeatForever(cc.animate(this.animRun))); 
    },

    onEnter: function()
    {
        this._super();
        // cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
    },

    moveTrack: function(speed) {
        this.spriteTrack1.x -= speed;
        this.spriteTrack2.x -= speed;
    
        if (this.spriteTrack1.x < -this.spriteTrack1.getContentSize().width / 2) {
            this.spriteTrack1.x = this.spriteTrack2.x + this.spriteTrack2.getContentSize().width;
        }
    
        if (this.spriteTrack2.x < -this.spriteTrack2.getContentSize().width / 2) {
            this.spriteTrack2.x = this.spriteTrack1.x + this.spriteTrack1.getContentSize().width;
        }
    },

    //cactusSpawnTime
    spawnCactus: function() 
    {
        if (this.gameState != "running") return;

        var cactusType = Math.floor(Math.random() * 6) + 1; // Random cactus type between 1 and 6
        var cactusSpriteFrameName = "cactus_" + cactusType + ".png";
        var cactusSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(cactusSpriteFrameName));
        
        cactusSprite.setAnchorPoint(0.5, 0);
        cactusSprite.setPosition(cc.director.getWinSize().width + cactusSprite.getContentSize().width, 155); 

        this.cacti.push(cactusSprite);
        this.addChild(cactusSprite);

    },
    moveCactus: function(speed) {

        for (var i = this.cacti.length - 1; i >= 0; i--) {
            var spriteCactus = this.cacti[i];
            spriteCactus.x -= speed;
            if (spriteCactus.x < -spriteCactus.getContentSize().width) {
                spriteCactus.removeFromParent();

                //this.cacti.splice(this.cacti.indexOf(spriteCactus), 0);
                this.cacti.splice(i, 1);
            }
        }

        // this.spriteTrack1.x -= speed;
        // this.spriteTrack2.x -= speed;
    
        // if (this.spriteTrack1.x < -this.spriteTrack1.getContentSize().width / 2) {
        //     this.spriteTrack1.x = this.spriteTrack2.x + this.spriteTrack2.getContentSize().width;
        // }
    
        // if (this.spriteTrack2.x < -this.spriteTrack2.getContentSize().width / 2) {
        //     this.spriteTrack2.x = this.spriteTrack1.x + this.spriteTrack1.getContentSize().width;
        // }
    },

    spawnBird: function() {
        if (this.gameState != "running") return;
        
        var size = cc.director.getWinSize();
        var birdHeight = 210 + Math.random() * 150;
        if (this.spriteBird.x >= -100) {
            return;
        }
        this.spriteBird.setVisible(true);
        this.spriteBird.setPosition(size.width + this.spriteBird.getContentSize().width + 200, birdHeight);
        
       
        // this.spriteBird.runAction(cc.sequence(birdFlyAction, removeBird));
    },

    // createCloud: function(xPosition) {
    //     // var size = cc.director.getWinSize();
    //     // var cloudSprite = new cc.Sprite("#cloud.png");
    //     // var cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
    
    //     // cloudSprite.setPosition(xPosition, cloudHeight);
    //     // this.addChild(cloudSprite);   
    
    //     // return cloudSprite;

    moveBird: function(speed) {
        // var birdAnimation = new cc.Animation(this.birdFrames, 0.2);
        // var birdAnimate = cc.animate(birdAnimation).repeatForever();
        this.spriteBird.x -= speed * 1.3 ;



    },

    moveCloud: function(cloudSprite, dt) {

        var size = cc.director.getWinSize();
    
        cloudSprite.setPositionX(cloudSprite.getPositionX() - this.cloudSpeed * dt);
    
        if (cloudSprite.getPositionX() < -cloudSprite.getContentSize().width) {
            var cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
            cloudSprite.setPositionX(size.width + cloudSprite.getContentSize().width);
            cloudSprite.setPositionY(cloudHeight);
        }
    },

    updateClouds: function(dt) {
    
        this.moveCloud(this.spriteCloud1, dt);
        this.moveCloud(this.spriteCloud2, dt);
        this.moveCloud(this.spriteCloud3, dt);
    },

    hitBox: function() {
        var dinoBox = this.spriteDino.getBoundingBox();

        this.cacti.forEach((cactus) => {
            if (cc.rectIntersectsRect(dinoBox, cactus.getBoundingBox())) {
                this.gameOver();
            }
        });

        this.birds.forEach((bird) => {
            if (bird.isVisible() && cc.rectIntersectsRect(dinoBox, bird.getBoundingBox())) {
                this.gameOver();
            }
        });
    },

    gameOver: function() 
    {
        this.gameState = "gameOver";
        this.cloudSpeed = 50;
        this.trackSpeed = 9.5;
        this.cactusSpeed = 1; 
        // this.pauseTarget(this.spawnCactus); 
        //this.unscheduleUpdate();
        this.cacti.forEach(cactus => cactus.pause());
        this.birds.forEach(bird => bird.pause());
        this.spriteDino.pause();
        this.spriteCloud1.pause(); 
        this.spriteCloud2.pause(); 
        this.spriteCloud3.pause();
        this.spriteDino.setSpriteFrame("dino_dead.png");
        cc.log('Game Over!');
        // Restart Here KHANG
        this.spriteGameOver.setVisible(true);
        this.spriteReset.setVisible(true);
    },

    increaseGameSpeed: function() {
        var x = 1.1; 
        this.trackSpeed *= x; 
        // this.cactusSpeed = this.cactusSpeed * (1 / x); 
        // this.birdSpeed *= 1.1; 
        this.cactusSpawnInterval = Math.max(this.cactusSpawnInterval * 0.9, 0.44);  
    },
    
    update: function(dt)
    {

        //this.gameTime += dt;

        // dy += v0*dt;
        // v0 -= g*dt;
        
        // this.givenNumbers = this.changingNumber(this.givenNumbers);
        if(this.gameState == "running")
        {
            //this.schedule(this.spawnCactus, this.cactusSpawnInterval);
            //this.schedule(this.spawnBird, this.birdSpawnInterval);
            this.moveBird(this.trackSpeed);
            this.moveTrack(this.trackSpeed);
            this.moveCactus(this.trackSpeed);
            this.updateClouds(dt);
            this.hitBox();
            //this.theNumber(this.score += 1); 
            if (this.score % 50 == 0 && this.score != this.lastScore && this.score <= 350) {
                this.increaseGameSpeed();
                this.lastScore = this.score;  
            }
            // setTimeout(this.score += 1, 2000);
            this.theNumber(this.score);
            // this.score += 1;

        }
        else if(this.gameState == "warmUp")
        {
            // this.

        }
      
    },
     

});

var dinoScene = cc.Scene.extend({
    onEnter:function () 
    {
        // 1. super init first
        this._super();

        var backgroundLayer = new cc.LayerColor(cc.color(255, 255, 255, 255)); // RGBA for white
        this.addChild(backgroundLayer, -1);

         // 2. new layer
        var layer = new dl();
        // 3. init layer
        layer.init();
        // layer.setScale(0.2,0.2);
        // 4. add to scene
        this.addChild(layer);
        // layer.gameState = "running"
        //cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
        //cc.log("Node Parent: " + dino.parent);
    }
});

cc.director.runScene(new dinoScene());
    