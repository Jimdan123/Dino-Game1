
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
            // cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
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
        // cc.log("sprite onTouchesEnded.. ");
        if (myRole == UserJob.host)
        {
            target.setOpacity(255);
            var dinoLayer = target.getParent();

            dinoLayer.gameStart();
            dinoLayer.userInteraction = gameState.gameStart;
            dinoLayer.sendToServer(gameState.gameStart);
        }
        //Reset zOrder and the display sequence will change
    }
});

var dl = cc.Layer.extend({
    startDuration: 0.5, 
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
    trackSpeed: 9.5/ 0.017,
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
    userInteraction: "Active", 
    init:function () 
    {
        // connectToMyServer();
        this.tmpScore = 0;
        this.sizeWidth =  cc.director.getWinSize().width; 
        this.sizeHeight = cc.director.getWinSize().height;
        //////////////////////////////
        // 1. super init first
        this._super();
        this.downKeyPressed = false;
        this.gameState = "mainMenu";
        // cc.log(this.gameState);
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
        // setInterval(() =>{this.score += 1},50);

        cc.spriteFrameCache.addSpriteFrames(gameOverPos, gameOver);


        this.spriteTrack1 = new cc.Sprite("#track.png");
        this.spriteTrack1.setAnchorPoint(0.5, 0.5);
        this.spriteTrack1.setPosition(this.sizeWidth / 2, 165);
        this.spriteTrack1.setVisible(false);
        this.addChild(this.spriteTrack1, 1);

        this.spriteGameOver = new cc.Sprite("#game_over.png");
        this.spriteGameOver.setVisible(false);
        this.spriteGameOver.setPosition(this.sizeWidth /2, this.sizeHeight / 1.5);
        this.addChild(this.spriteGameOver, 20);

        this.spriteReset = new cc.Sprite("#reset.png");
        this.spriteReset.setVisible(false);
        cc.eventManager.addListener(listener1, this.spriteReset);
        this.spriteReset.setPosition(this.sizeWidth / 2, this.sizeHeight / 2);
        this.addChild(this.spriteReset, 20);

        this.spriteTrack2 = new cc.Sprite("#track.png");
        this.spriteTrack2.setAnchorPoint(0.5, 0.5);
        this.spriteTrack2.setVisible(false);
        this.spriteTrack2.setPosition((this.sizeWidth / 2) + this.spriteTrack1.getContentSize().width, 165);
        this.addChild(this.spriteTrack2, 1);

        this.spriteTrack3 = new cc.Sprite("#track.png"); 
        this.spriteTrack3.setAnchorPoint(0,0); 
        this.spriteTrack3.setVisible(false); 
        this.spriteTrack3.setPosition(0, 150);
        this.addChild(this.spriteTrack3,0);

        this.helloLabel = new cc.LabelTTF("Press any key to start", "Outlined", 38);
        this.helloLabel.setFontFillColor(cc.color(105,105,105));
        this.helloLabel.setPosition(this.sizeWidth / 2, this.sizeHeight / 2);
        this.addChild(this.helloLabel,3);

        cc.spriteFrameCache.addSpriteFrames(dinoPos, dino);
        this.spriteDino = new cc.Sprite("#dino_jump.png");
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
        this.addChild(this.spriteBird, 1);
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

        this.addChild(this.spriteCloud1, -1);
        this.addChild(this.spriteCloud2, -1);
        this.addChild(this.spriteCloud3, -1); 
        
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
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function() { 
            cc.log("Pause");
            cc.director.pause();
            this.userInteraction = gameState.windowClose; 
            this.sendToServer(gameState.windowClose, time);
        }.bind(this));
    
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function() {
            cc.log("Resume");
            cc.director.resume();
            this.userInteraction = gameState.windowOpen; 
            this.sendToServer(gameState.windowOpen, time);

        }.bind(this));

         
        
        this.theNumber(givenNumbers);
        // get screen size
        // add "Helloworld" splash screen"

        this.cactusCooldown = this.cactusSpawnInterval ;
        this.birdCooldown = this.birdSpawnInterval ;
        this.schedule(this.tick, 2);

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
    distance: 1,
    cooldown: 5, 
    tick: function()
    {

        // if(this.cooldown >= 5)
        // {
        //     var cactusType = Math.floor(Math.random() * 6) + 1; // Random cactus type between 1 and 6

        //     this.spawnCactus(cactusType); 
        //     this.cooldown = 0;
        //     this.userInteraction = spawning.cactus; 
        //     this.sendToServer(spawning.cactus, cactusType);
        // }
    //     this.cactusCooldown -= 0.1;
    //     if (this.cactusCooldown  <= 0)
    //     {
    //         this.cactusCooldown = this.cactusSpawnInterval + Math.random() * 0.5;
    //         if (Math.random() > 0.3) {
    //             this.spawnCactus();
    //         }
    //         else {
    //             this.spawnBird();
    //         }
    //     }
    },

    turningDelayTrue: function()
    {
        this.delay = true;
    },

    warmingUp: function()
    {
        this.gameState = "warmUp";

        // cc.log("warmingUP");

        this.spriteDino.stopAllActions();
        // var jumpMotion = this.buildJumpAction(0.7);
        // var seqAction = cc.sequence(cc.callFunc(this.changingToWarmUp, this));
        //this.spriteDino.runAction(seqAction);

        this.dinoState = "jump";
        this.jump();    
    },

    changingToWarmUp: function()
    {
        // cc.log("changingToWarmUp");
        this.hideMainMenuObj();

        //dino run
        this.run();

        //this.gameStart();
        this.movingAtStart();

        // cc.log(this.gameState);
    },

    movingAtStart: function() 
    {
        // cc.log(this.startDuration);
        this.spriteTrack3.setVisible(true);
        var moving = cc.MoveTo.create(this.startDuration,cc.p(this.sizeWidth, 200));
       
        var movingMotion = cc.sequence(moving,cc.callFunc(this.endMoving, this));

        // cc.log("movingAtStart");

        this.start.runAction(movingMotion);
    },
    
    endMoving: function()
    {
        // cc.log("endMoving 1");
        this.removeChild(this.start);
        // cc.log("endMoving 2");
        var scaling = cc.scaleTo(0.5, 1, 1);
        // cc.log("endMoving 3");
        var scaleMotion = cc.sequence(scaling,cc.callFunc(this.gameStart,this));

        // cc.log("endMoving 4");

        this.runAction(scaleMotion);
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
         this.spriteDino.setPosition(100,200);

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
        this.spriteTrack3.setVisible(false);
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
        // if (this.gameState == "mainMenu")
        // {
        //     this.blinkAction();
        // }

        if (this.gameState == "gameOver") 
        {
            this.userInteraction = this.gameState;
            this.sendToServer(this.userInteraction);
            return;
        }

        if (this.gameState == "mainMenu")
        {
            if(myRole == UserJob.host )
            {
                this.warmingUp();
                this.userInteraction = changingDinoStateForUser.warmingUp;
                // cc.log(changingDinoStateForUser.warmingUp);
                this.sendToServer(this.userInteraction);
            }
        }
        else if (this.gameState == "running")
        {
            if (myRole == UserJob.host)
            {
                if (key === cc.KEY.space) 
                {
                    if (this.dinoState === "run") 
                    {
                        this.dinoState = "jump";
                        this.jump();
                        this.spriteDino.setSpriteFrame("dino_jump.png");
                        this.userInteraction = changingDinoStateForUser.jump;
                        this.sendToServer(this.userInteraction);
                    }
                    
                    // cc.log("Key space pressed");
                }
                else if (key === cc.KEY.down) 
                {
                    cc.log("DownPressed" + this.downKeyPressed);
                    this.downKeyPressed = true;
        
                    if (this.dinoState === "run")
                    {
                        // cc.log("duck");
                        this.dinoState = "duck";
                        this.duck();
                        this.userInteraction = changingDinoStateForUser.duck;
                        this.sendToServer(this.userInteraction);
                    }
                    else if (this.dinoState === "jump") {
                        this.userInteraction = changingDinoStateForUser.cancelJump;
                        // print("co Jump");
                        this.cancelJump();
                        this.sendToServer(this.userInteraction);
                    }
                    
                    // cc.log("Key down pressed");
                }
            }
            else if (myRole == UserJob.guest)
            {
                if(key == cc.KEY["["])
                {
                    // this.isAutoSpawn = false;
                    if(this.cooldown >= 5)
                    {
                        var cactusType = Math.floor(Math.random() * 6) + 1; // Random cactus type between 1 and 6

                        this.spawnCactus(cactusType); 
                        this.cooldown = 0;
                        this.userInteraction = spawning.cactus; 
                        this.sendToServer(spawning.cactus, cactusType);
                    }
                }
                else if(key == cc.KEY["]"])
                { 
                    if (this.cooldown >= 5)
                    {
                        // var birdHeight = 202 + Math.random() * 150;
                        var birdHeight = 202;
                        //cc.log("Guest birdHeight = " + birdHeight);
                        this.birdHeight = birdHeight;
                        //this.birdHorizontalDistance = 
                        this.spawnBird(); 
                        this.userInteraction = spawning.bird; 
                        this.cooldown = 0;
                        this.sendToServer(spawning.bird, birdHeight);
                    }
                }
            }
           
        }

        // cc.log("this.userinteratciom" + this.userInteraction)
            
        //sendMessageInGameRoom(this.userInteraction);
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
        else  if (key === cc.KEY.down) 
        {
            this.downKeyPressed = false; 
            this.userInteraction = changingDinoStateForUser.keyReleased;
            if(this.gameState == "gameOver") return;
            
            if (this.dinoState == "duck")
            {
                this.dinoState = "run";
                this.run();
                this.userInteraction = changingDinoStateForUser.running;
            }
            this.sendToServer(this.userInteraction);

            // cc.log("Key down released");
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
        // this.animBlink = new cc.Animation();
        // this.animeBlink.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("dino_start.png"));
        // this.animeBlink.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("dino_jump.png"));
        // this.animeBlink.setDelayPerUnit(Math.random());
        
    },

//    calcNormalJumpDuration: function()
//    {
//         return 2*Math.sqrt((2*this.jumpHeight) / 3000);
//    },

    // buildJumpAction: function(timeToJump)
    // {
    //     //cc.log("TimeToJump = " + timeToJump);

    //     var jumpAnimate = cc.animate(this.animJump);
        
    //     var jumpUp = cc.moveBy(timeToJump/2, cc.p(0, this.jumpHeight)).easing(cc.easeInOut(1));

    //     var jumpDown = cc.moveBy(timeToJump/2, cc.p(0, -this.jumpHeight)).easing(cc.easeSineIn(1.0));

    //     var jumpMotion = cc.sequence(jumpAnimate, jumpUp, jumpDown);
    
    //     return jumpMotion;
    // },

    dinoV0: 0,
    dinoG: 3000,
    playSpeed: 1,
    dinoVcacelJump: 1200,

    setPlaySpeed: function (numbers)
    {
        this.playSpeed = numbers;
    },

    blinkAction: function()
    {
        this.spriteDino.runAction(cc.animate(this.animBlink));
    },

    startJumpTime: 0,
    buildJumpFx: function()
    {
        this.startJumpTime = Date.now();

        this.dinoV0 = 1200;

        return cc.animate(this.animJump);
    },

    timeStartJump: 0,

    jump: function() {
        this.spriteDino.stopAllActions();

        this.timeStartJump = Date.now();

        //var jumpMotion = this.buildJumpAction(jumpDuration);

        //var seqAction = cc.sequence(jumpMotion, cc.callFunc(this.endJump, this));
       
        //this.spriteDino.runAction(seqAction);

        this.spriteDino.runAction(this.buildJumpFx());
    },

    cancelJump: function() 
    {
        this.dinoState = "cancelJump";
        //var timeToJump = Math.sqrt((2*(this.spriteDino.getPositionY() - 200)) / 18000);
        // cc.log(timeToJump);  
        //this.spriteDino.stopAllActions();
        //do cao hien tại suy ra thời gian chạm đất
        //var jumpDown = cc.moveTo(timeToJump, cc.p(100, 200));
        // var AfterJump = cc.callFunc(function() {
        //     if (!this.downKeyPressed) { 
        //         this.dinoState = "run"; 
        //         this.run();
        //     } 
        //     else {
        //         this.dinoState = "duck";
        //         this.duck(); 
        //     }
        // }, this);
        // cc.log("DownKeyPressed: " + this.downKeyPressed);
        // this.spriteDino.runAction(cc.sequence(jumpDown, AfterJump));
    },
    
    endCancelJump : function()
    {
        if (!this.downKeyPressed) 
        { 
            this.dinoState = "run"; 
            this.run();
        } 
        else 
        {
            this.dinoState = "duck";
            this.duck(); 
        }
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

    moveTrack: function(speed, dt) {
        this.spriteTrack1.x -= speed* dt;
        this.spriteTrack2.x -= speed* dt;
    
        if (this.spriteTrack1.x < -this.spriteTrack1.getContentSize().width / 2) {
            this.spriteTrack1.x = this.spriteTrack2.x + this.spriteTrack2.getContentSize().width;
        }
    
        if (this.spriteTrack2.x < -this.spriteTrack2.getContentSize().width / 2) {
            this.spriteTrack2.x = this.spriteTrack1.x + this.spriteTrack1.getContentSize().width;
        }
    },

    spawnCactusDY: 200,

    //cactusSpawnTime
    spawnCactus: function(cactusType) 
    {
        if (this.gameState != "running") return;
        // var cactusType = Math.floor(Math.random() * 6) + 1;
       
        var cactusSpriteFrameName = "cactus_" + cactusType + ".png";
        var cactusSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(cactusSpriteFrameName));
        
        cactusSprite.setAnchorPoint(0.5, 0);

        cactusSprite.setPosition(cc.director.getWinSize().width, 
                                cc.director.getWinSize().height + this.spawnCactusDY);

        this.cacti.push(cactusSprite);

        this.addChild(cactusSprite);

    },

    distanceToSpawnCactus: 15 / 0.017,
    // count: 0,

    setDistanceToSpawnCactus: function(delay)
    {
        var distance = cc.director.getWinSize().height + this.spawnCactusDY - 155;
        var totalTime = (distance/ (15/ 0.017)) * 1000; 
        var guestTime  = totalTime  - delay; 
        var dropSpeed = distance *1000/ guestTime;
        //var time = size/(this.distanceToSpawnCactus * tmp) - delay;
        //cc.log ("setDistanceToSpawnCactus - time: " + time);
        this.distanceToSpawnCactus = dropSpeed;
        //cc.log ("setDistanceToSpawnCactus - distanceToSpawnCactus: " + this.distanceToSpawnCactus);
    },

    moveCactus: function(speed, dt) {

        for (var i = this.cacti.length - 1; i >= 0; i--) 
        {
            var spriteCactus = this.cacti[i];
            if (spriteCactus.y <= 155)
            {
                spriteCactus.x -= speed * dt;
                // this.count = 0;
            }
            else 
            {
                // this.count += 0.017;
                // cc.log(this.count);
                spriteCactus.y -= this.distanceToSpawnCactus * dt;

                if (spriteCactus.y < 155)
                {
                    spriteCactus.y = 155;
                }
            }

            if (spriteCactus.x < -spriteCactus.getContentSize().width) 
            {
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

    birdDistanceDrop: 5,
    birdDropSpeedY: 5/0.017,
    birdDistance: 500,
    birdHeight: 0, 
    birdHorizontalDistance: 5,
    birdDropSpeedX: 5/0.017,

    setBird: function(height,delay)
    {
        cc.log ("delay = " + delay);
        cc.log("height = " + height);
        this.birdHeight  = height;

        var distance = this.birdDistance;
        
        var totalTimeDrop = (distance / (5/0.017)) * 1000;
        cc.log("totalTimeDrop = " + totalTimeDrop);
        // cc.log ("totalTime")
        var guestTimeDrop = (totalTimeDrop  - delay); 
        cc.log("guestTimeDrop = " + guestTimeDrop); 
        var dropSpeed  = distance*1000/ guestTimeDrop;
        cc.log("Drop Speed = " + dropSpeed);
        this.birdDropSpeedY = dropSpeed;

        this.birdDropSpeedX = (5/0.017)*totalTimeDrop/guestTimeDrop;

        //cc.log(distance / dropSpeed);
    },

    widthBird: 500,

    spawnBird: function() {
        if (this.gameState != "running") return;
        
        var size = cc.director.getWinSize();
        if (this.spriteBird.x >= -100) {
            return;
        }
        this.spriteBird.setVisible(true);
        this.spriteBird.setPosition(size.width + this.spriteBird.getContentSize().width, this.birdHeight + this.birdDistance);
        
       
        // this.spriteBird.runAction(cc.sequence(birdFlyAction, removeBird));
    },


    // createCloud: function(xPosition) {
    //     // var size = cc.director.getWinSize();
    //     // var cloudSprite = new cc.Sprite("#cloud.png");
    //     // var cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
    
    //     // cloudSprite.setPosition(xPosition, cloudHeight);
    //     // this.addChild(cloudSprite);   
    
    //     // return cloudSprite;

    moveBird: function(speed, dt) {
        // var birdAnimation = new cc.Animation(this.birdFrames, 0.2);
        // var birdAnimate = cc.animate(birdAnimation).repeatForever();
        // var timeToDropX = 

        //this.birdHorizontalDistance = (cc.director.getWinSize().width + this.spriteBird.getContentSize().width )/ (this.birdDistance / this.birdDistanceDrop) * dt;

        if (this.spriteBird.y  > this.birdHeight) 
        {
            //this.spriteBird.y -= vy*dt;
            this.spriteBird.y -= this.birdDropSpeedY * dt;
            // cc.log("dtMobe  = " + dt);
            //this.spriteBird.y -= this.birdDistanceDrop;
            //this.birdDistanceDrop += (this.birdDistance * dt);
            //cc.log("spireBirdY = " + this.spriteBird.y);
            // this.birdDistance -= this.birdDistanceDrop;

            this.spriteBird.x -= this.birdDropSpeedX * dt;
            //cc.log("spireBirdX = " + this.spriteBird.x);


            /*
            if (this.spriteBird.x <= cc.director.getWinSize().width)
            {
                this.spriteBird.x = cc.director.getWinSize().width + this.spriteBird.getContentSize().width;
            }
                */

            if (this.spriteBird.y <= this.birdHeight)
            {
                this.spriteBird.y = this.birdHeight;
            }
        }
        else
        {
            this.spriteBird.x -= speed * dt;
        }



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
            if (cc.rectIntersectsRect(dinoBox, cactus.getBoundingBox()) 
                                && myRole == "Host") 
            {
                this.gameOver();
            }
        });

        this.birds.forEach((bird) => {
            if (bird.isVisible() && cc.rectIntersectsRect(dinoBox, bird.getBoundingBox())
                                && myRole == "Host") 
            {
                this.gameOver();
            }
        });
    },

    gameOver: function() 
    {
        this.gameState = "gameOver";
        this.cloudSpeed = 50;
        this.trackSpeed = 9.5/ 0.017;
        this.cactusSpeed = 1/0.017; 
        this.birdDropSpeedX = 5/0.017; 
        this.birdDropSpeedY = 5/0.017;
        this.cooldown = 5;
        this.currentTime = 0;
        // this.pauseTarget(this.spawnCactus); 
        //this.unscheduleUpdate();
        // this.cactusSpawnInterval = 1;
        this.cacti.forEach(cactus => cactus.pause());
        this.birds.forEach(bird => bird.pause());
        this.spriteDino.pause();
        this.spriteCloud1.pause(); 
        this.spriteCloud2.pause(); 
        this.spriteCloud3.pause();
        this.spriteDino.setSpriteFrame("dino_dead.png");
        // cc.log('Game Over!');
        // Restart Here KHANG
        this.spriteGameOver.setVisible(true);
        this.spriteReset.setVisible(true);

        if (myRole == UserJob.host)
        {
            this.userInteraction = gameState.gameOver;
            this.sendToServer(this.score.toString());
        }
    },

    // velocityTrack: 1.1/ 0.017, 

    increaseGameSpeed: function() 
    {
        //var x = this.velocityTrack * dt; 
        this.trackSpeed *= 1.1; 
        // this.cactusSpeed = this.cactusSpeed * (1 / x); 
        // this.birdSpeed *= 1.1; 
        // this.cactusSpawnInterval = Math.max(this.cactusSpawnInterval * 0.825, 0.4);  
    },

    currentTime: 0, 
    
    update: function(dt)
    {
        // cc.log(dt);
        //this.gameTime += dt;

        // dy += v0*dt;
        // v0 -= g*dt;
        // cc.log(dt);
        this.currentTime += dt;
        time += (dt * 1000);
        // this.givenNumbers = this.changingNumber(this.givenNumbers);
        // cc.log (this.cooldown);
        if (this.cooldown <= 5)
        {
            if (myRole == UserJob.guest)
            {
                this.cooldown += dt; 
                // cc.log(this.cooldown); 
            }
        }

        if (this.gameState == "running")
        {
            if ( this.currentTime >= 0.1)
            {
                this.score += 1; 
                // cc.log(this.score);  
                this.currentTime = 0;
                this.theNumber(this.score); 
            }
            if (this.dinoState == "jump")
            {

                this.spriteDino.y += this.dinoV0*dt * this.playSpeed;
                this.dinoV0 -= this.dinoG*dt *this.playSpeed;

                if (this.dinoV0 <= 0 && this.startJumpTime > 0)
                {
                    var timeToTop = Date.now() - this.startJumpTime; 
                    cc.log("DurationGetToTop = " + timeToTop);
                    this.startJumpTime = 0;
                    this.playSpeed = 1;
                }
                if (this.spriteDino.y <= 200)
                {
                    this.spriteDino.y = 200;

                    this.endJump();

                    // cc.log("Jump duration = " + (Date.now() - this.timeStartJump));
                }
            }
            else if (this.dinoState == "cancelJump")
            {
                this.spriteDino.y -= this.dinoVcacelJump *dt; 

                if (this.spriteDino.y <= 200)
                {
                    this.spriteDino.y = 200;

                    this.endCancelJump();

                    //cc.log("Jump duration = " + (Date.now() - this.timeStartJump));
                }
            }

            // this.schedule(this.spawnCactus, this.cactusSpawnInterval);
            // this.schedule(this.spawnBird, this.birdSpawnInterval);
            this.moveBird(this.trackSpeed, dt);
            this.moveTrack(this.trackSpeed, dt);
            this.moveCactus(this.trackSpeed, dt);
            this.updateClouds(dt);
            this.hitBox();
            //this.theNumber(this.score += 1); 
            if (this.score % 125 == 0 && this.score != this.lastScore && this.score <= 1000) {
                this.increaseGameSpeed();
                this.lastScore = this.score;  
            }
            // setTimeout(this.score += 1, 2000);
            // this.score += 1;

        }
        else if(this.gameState == "warmUp")
        {
            // this.
            if (this.dinoState == "jump")
            {
                this.spriteDino.y += this.dinoV0*dt * this.playSpeed;
                this.dinoV0 -= this.dinoG*dt *this.playSpeed;

                if (this.dinoV0 <= 0 && this.startJumpTime > 0)
                    {
                        var timeToTop = Date.now() - this.startJumpTime; 
                        cc.log("DurationGetToTop = " + timeToTop);
                        this.startJumpTime = 0;
                        this.playSpeed = 1;
                    }
                if (this.spriteDino.y <= 200)
                {
                    this.spriteDino.y = 200;

                    this.endJump();
                    this.changingToWarmUp();

                    cc.log("Jump duration = " + (Date.now() - this.timeStartJump));
                }
            }

        }
      
    },
    
    sendToServer: function(message, moreInfo)
    {
        // cc.log("sendToServer - this.userInteraction = " + this.userInteraction);
        switch(this.userInteraction)
        {
            case gameState.gameOver: 
                sendResultToUser(message);
                break;

            case spawning.bird: 
                cc.log("Bird: " + message + "; " + "BirdHeight: " + moreInfo);
                sendMessageToSpawnStuff(message,moreInfo);
                break; 

            case spawning.cactus: 
                cc.log("Cactus: " + message + "; " + "CatusType: " + moreInfo);
                sendMessageToSpawnStuff(message,moreInfo);
                break; 

            case gameState.windowOpen: 
                // cc.log("windowOpen: " + message + "; " + "time: " + moreInfo);
                sendWindowToUser(message,moreInfo); 
                break; 
            
            case gameState.windowClose: 
                // cc.log("windowClose: " + message + "; " + "time: " + moreInfo);
                sendWindowToUser(message, moreInfo);
                break;

            default: 
                cc.log("Message:" + message);
                sendMessageInGameRoom(message);
        }
        // if (moreInfo)
        //     sendMessageToSpawnStuff(message,moreInfo);
        // else
        //     sendMessageInGameRoom(message);
    },

});

var myDinoLayerInst;

var dinoScene = cc.Scene.extend({
    onEnter:function () 
    {
        // 1. super init first
        this._super();

        var backgroundLayer = new cc.LayerColor(cc.color(255, 255, 255, 255)); // RGBA for white
        this.addChild(backgroundLayer, -1);

        // 2. new layer
        myDinoLayerInst = new dl();
        // 3. init layer
        myDinoLayerInst.init();
        // layer.setScale(0.2,0.2);
        // 4. add to scene
        this.addChild(myDinoLayerInst);
        // layer.gameState = "running"
        //cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
        //cc.log("Node Parent: " + dino.parent);
    }
});

cc.director.runScene(new dinoScene());

//cc.director.getRunningScene()
    