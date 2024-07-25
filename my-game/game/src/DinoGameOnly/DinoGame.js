

var dl = cc.Layer.extend({
    helloLabel:null,
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
    jumpHeight: 260,
    jumpDuration: 0.5, 
    gameState: "init",
    dinoState: "run",
    press: false,
    score: 0,
    size : cc.director.getWinSize(),
    pause: [],
    init:function () 
    {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.downKeyPressed = false;
        this.gameState = "mainMenu";
        cc.log(this.gameState);
        this.cacti = [];
        this.birds = [];
        var givenNumbers = 0; 
        var scaleLength = 0.5; 
        var scaleWidth = 0.5    ; 
        var posX = 700; 
        var posY = 450;
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
                            ld_inst.changeStateToRunning();
                            ld_inst.press = true;
                        }
                    }
                };
                cc.eventManager.addListener(keyboardListener, this);
            }
        cc.spriteFrameCache.addSpriteFrames(numberPos, number);
        this.allDigits = new Array(6); 
        for (var i = 0; i < 6; i++)
        {
            this.allDigits[i] = new cc.Sprite("#number_0.png");
            this.allDigits[i].setPosition(posX,posY); 
            this.allDigits[i].setScale(scaleLength,scaleWidth); 
            this.addChild(this.allDigits[i],10);
            posX += 15;
        }
// this.highScore = new Array(6);
        // for (var i = 0; i < 6; i++)
        // {
        //     this.highScore[i] = new cc.Sprite("#number_0.png");
        //     this.highScore[i].setPosition(700,200); 
        //     this.highScore[i].setScale(scaleLength,scaleWidth); 
        //     this.addChild(this.highScore[i],10);
        //     posX += 20;
        // }
        // this.removeChild(this.sprite);
        cc.spriteFrameCache.addSpriteFrames(gameOverPos, gameOver);

        this.spriteTrack1 = new cc.Sprite("#track.png");
        this.spriteTrack1.setAnchorPoint(0.5, 0.5);
        this.spriteTrack1.setPosition(this.size.width / 2, 165);
        this.addChild(this.spriteTrack1, 0);

        this.spriteGameOver = new cc.Sprite("#game_over.png");
        this.spriteReset = new cc.Sprite("#reset.png");
        this.spriteGameOver.setVisible(false);
        // this.spriteGameOver.setAnchorPoint(0.5, 0.5);
        this.spriteGameOver.setPosition(400, 400);
        this.addChild(this.spriteGameOver, 0);

        this.spriteReset.setVisible(false);
        // this.spriteGameOver.setAnchorPoint(0.5, 0.5);
        this.spriteReset.setPosition(400, 300);
        this.addChild(this.spriteReset, 0);
         
        this.spriteTrack2 = new cc.Sprite("#track.png");
        this.spriteTrack2.setAnchorPoint(0.5, 0.5);
        this.spriteTrack2.setPosition((this.size.width / 2) + this.spriteTrack1.getContentSize().width, 165);
        this.addChild(this.spriteTrack2, 0);
        this.helloLabel = new cc.LabelTTF("Press any key to start", "Impact", 38);

        cc.spriteFrameCache.addSpriteFrames(dinoPos, dino);
        this.spriteDino = new cc.Sprite("#dino_jump.png");
        this.spriteDino.setPosition(200, 200);
        this.spriteDino.setAnchorPoint(0.5,0.5); 
        this.addChild(this.spriteDino, 0);

        cc.spriteFrameCache.addSpriteFrames(birdPos, bird);
        this.spriteBird = new cc.Sprite("#bird_1.png");
        cc.spriteFrameCache.addSpriteFrames(cactusPos, cactus);
        this.spriteCactus = new cc.Sprite("#cactus_1.png");
        
        this.spriteCloud1 = new cc.Sprite("#cloud.png"); 
        this.spriteCloud2 = new cc.Sprite("#cloud.png");
        this.spriteCloud3 = new cc.Sprite("#cloud.png"); 
        var cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
        this.spriteCloud1.setPosition(this.size.width / 3,cloudHeight);
        cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
        this.spriteCloud2.setPosition(this.size.width / 3 * 2, cloudHeight);
        cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
        this.spriteCloud3.setPosition(this.size.width,cloudHeight);

        this.addChild(this.spriteCloud1,0);
        this.addChild(this.spriteCloud2,0);
        this.addChild(this.spriteCloud3,0); 
        
        //cc.log("MyLayer - init");
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
        // get screen size
        //var size = cc.director.getWinSize();
        foo();
        // this.Label(size);
        this.backGroundAtStart();
        this.gameStart();
        cc.log(this.gameState);
        this.theNumber(givenNumbers);
        // get screen size
        // add "Helloworld" splash screen"
        
    },
    theNumber: function(givenNumbers)
    {
        // while (true){cc.log(this.gameState);}
        for (var i = 5; i > -1; i--)
        {
            var tmp = givenNumbers % 10;  
            var frameName = "number_" +  tmp + ".png";
            this.allDigits[i].setSpriteFrame(frameName);
            givenNumbers = parseInt(givenNumbers / 10);
        }
    },
    // gameMenu:function() 
    // {
    //     this.Label();
    //     // if(onKeyPressed)
    //     // this.gameState = "running"; 
    //     // this.gameStart();

    // },
    gameStart: function()
    {
        // if (this.gameState == "mainMenu")
        // {
        //     this.gameMenu();
        //     return;
        // }
        this.spriteTrack1.setVisible(false); 
        this.unschedule(this.spawnBird);
        this.unschedule(this.spawnCactus);
        this.spriteTrack2.setVisible(false);
        this.spriteCloud1.setVisible(false); 
        this.spriteCloud2.setVisible(false);
        this.spriteCloud3.setVisible(false);
        this.spriteDino.setVisible(false);
        this.score = 0;
        this.spriteDino.setPosition(200,200);
        for(var i = 0; i < this.cacti.length; i++)
        {
            this.cacti[i].removeFromParent();
        }
        for(var i = 0; i < this.allDigits.length; i++)
        {
            this.allDigits[i].setVisible(false);    
        }
        for(var i = 0; i < this.birds.length; i++)
        {
            this.birds[i].removeFromParent(); 
        }
        this.cacti = [];
        this.birds = [];
        // this.scheduleUpdate();
        this.spriteDino.setVisible(false);
        this.dinoState = "";
        // Setup animation
        this.setupDino();
        this.run();
        this.cacti.forEach(cactus => cactus.resume());
        this.birds.forEach(bird => bird.resume());
        // Run by default
        // this.spriteDino.resume();
        this.changeStateToRunning();

    },
    changeStateToRunning: function()
    {
        this.scheduleUpdate();
        this.helloLabel.setVisible(false);
        this.gameState = "running";
        this.dinoState = "run";
        this.spriteDino.setVisible(true); 
        this.spriteCloud1.setVisible(true);
        this.spriteCloud2.setVisible(true);
        this.spriteCloud3.setVisible(true);
        this.spriteTrack1.setVisible(true);
        this.spriteTrack2.setVisible(true);
        this.spriteGameOver.setVisible(false);
        this.spriteReset.setVisible(false);
        cc.log("changeStateToRunning");
        for(var i = 0; i < this.allDigits.length; i++)
        {
            this.allDigits[i].setVisible(true);
        }
    },

    Label:function(size)
    {
        /////////////////////////////
        // 2. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        // position the label on the center of the screen
        this.helloLabel.setPosition(this.size.width / 2, this.size.height - 40);
        // add the label as a child to this layer

        // this.gameStart();
    },
    backGroundAtStart: function() 
    {
        this.spriteTrack1.setVisible(false); 
        this.spriteTrack2.setVisible(false);
        this.spriteCloud1.setVisible(false);
        this.spriteCloud2.setVisible(false);
        this.spriteCloud3.setVisible(false);

    },
        

    onKeyPressed: function(key)
    {
        // Jump
        if (this.gameState == "gameOver") 
        {
            if(key == cc.KEY.b)
                this.gameStart();
            return;
        }

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
        else if (key === cc.KEY.s) 
        {
            this.downKeyPressed = true;
            if (this.dinoState === "run")
            {
                this.dinoState = "duck";
                this.duck();
            }

            else if (this.dinoState === "jump") {
                print("co Jump");
                this.cancelJump();
            }
            
            cc.log("Key down pressed");
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
                //this.spriteDino.moveTo(200, 200);
                //this.dinoState = "run";
                //this.run();
                cc.log("Run after Jump");
            }
            cc.log("Key space released");

            if (this.dinoState == "run") {
                cc.log("Running");
            }
            
        }
        else if (key === cc.KEY.s) 
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


    setupDino: function() {
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
        
    },

    jump: function() {
        this.spriteDino.stopAllActions();

        var jumpAnimate = cc.animate(this.animJump);

        var jumpUp = cc.moveBy(this.jumpDuration * 0.5, cc.p(0, this.jumpHeight)).easing(cc.easeOut(2.0));

        var jumpDown = cc.moveBy(this.jumpDuration * 1, cc.p(0, -this.jumpHeight)).easing(cc.easeIn(2.0));

        var jumpMotion = cc.sequence(jumpAnimate, jumpUp, jumpDown, cc.callFunc(this.endJump, this));
    
        this.spriteDino.runAction(jumpMotion);
        this.spriteDino.runAction(cc.animate(this.animJump));
    },

    cancelJump: function() {
        this.spriteDino.stopAllActions();
        var timeToJump = Math.sqrt((2*(this.spriteDino.posY - 200))/4.8);
        // print(timeToJump);
        //do cao hien tại suy ra thời gian chạm đất
        var jumpDown = cc.moveTo(timeToJump, cc.p(200, 200));
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

    spawnCactus: function() 
    {
        if (this.gameState != "running") return;

        var cactusType = Math.floor(Math.random() * 6) + 1; // Random cactus type between 1 and 6
        var cactusSpriteFrameName = "cactus_" + cactusType + ".png";
        var cactusSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(cactusSpriteFrameName));
        
        cactusSprite.setAnchorPoint(0.5, 0);
        cactusSprite.setPosition(cc.director.getWinSize().width + cactusSprite.getContentSize().width, 160); 

        this.cacti.push(cactusSprite);
        this.addChild(cactusSprite);
    
        var moveAction = cc.moveTo(2.75, cc.p(-cactusSprite.getContentSize().width, 160)); // Move across the screen in 4 seconds
        var cleanupAction = cc.callFunc(function() {
            cactusSprite.removeFromParent();
            this.cacti.splice(this.cacti.indexOf(cactusSprite), 1);
        }, this);
    
        cactusSprite.runAction(cc.sequence(moveAction, cleanupAction));
    },
    

    spawnBird: function() {
        if (this.gameState != "running") return;
        
        var size = cc.director.getWinSize();
        var birdHeight = 195 + Math.random() * 180;
        this.spriteBird.setPosition(size.width + this.spriteBird.getContentSize().width, birdHeight);
        this.addChild(this.spriteBird);
        this.birds.push(this.spriteBird);

        var birdFrames = [];
        birdFrames.push(cc.spriteFrameCache.getSpriteFrame("bird_1.png"));
        birdFrames.push(cc.spriteFrameCache.getSpriteFrame("bird_2.png"));
        var birdAnimation = new cc.Animation(birdFrames, 0.2);
        var birdAnimate = cc.animate(birdAnimation).repeatForever();

        var birdSpeed = 300; 
        var birdFlyAction = cc.moveTo(size.width / birdSpeed, cc.p(-this.spriteBird.getContentSize().width, birdHeight));
        var removeBird = cc.callFunc(function() {
            this.spriteBird.removeFromParent();
            this.birds.splice(this.birds.indexOf(this.spriteBird), 1);
        }, this);

        this.spriteBird.runAction(birdAnimate);
        this.spriteBird.runAction(cc.sequence(birdFlyAction, removeBird));
    },

    // createCloud: function(xPosition) {
    //     // var size = cc.director.getWinSize();
    //     // var cloudSprite = new cc.Sprite("#cloud.png");
    //     // var cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
    
    //     // cloudSprite.setPosition(xPosition, cloudHeight);
    //     // this.addChild(cloudSprite);
    
    //     // return cloudSprite;
    // },

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
                cc.log("cactus");
            }
        });

        this.birds.forEach((bird) => {
            if (cc.rectIntersectsRect(dinoBox, bird.getBoundingBox())) {
                this.gameOver();
            }
        });
    },

    gameOver: function() 
    {
        this.gameState = "gameOver";
       
        // this.pauseTarget(this.spawnCactus); 
        this.unscheduleUpdate();
        this.cacti.forEach(cactus => cactus.pause());
        this.birds.forEach(bird => bird.pause());
        this.spriteDino.pause();
        this.spriteCloud1.pause(); 
        this.spriteCloud2.pause(); 
        this.spriteCloud3.pause();
        cc.log('Game Over!');
        // Restart Here KHANG
        this.spriteGameOver.setVisible(true);
        this.spriteReset.setVisible(true);
    },

    update: function(dt)
    {
        cc.log("update()");
        
        // this.givenNumbers = this.changingNumber(this.givenNumbers);
        if(this.gameState == "running")
        {
            cc.log("this.gameState == running");
            this.schedule(this.spawnCactus, 2.5);
            this.schedule(this.spawnBird, 7);
            this.moveTrack(12);
            this.updateClouds(dt);
            this.hitBox();
            this.theNumber(this.score += 1); 
        }
      
        // cc.log(this.givenNumbers);
        // this.theNumber(this.givenNumbers);
    },

    

});

var dinoScene = cc.Scene.extend({
    onEnter:function () 
    {
        // 1. super init first
        this._super();
         // 2. new layer
        var layer = new dl();
        // 3. init layer
        layer.init();
        // 4. add to scene
        this.addChild(layer);
        // layer.gameState = "running"
        //cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
        //cc.log("Node Parent: " + dino.parent);
    }
});

cc.director.runScene(new dinoScene());
    