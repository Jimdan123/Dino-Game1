
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
    init:function () 
    {
        //////////////////////////////
        // 1. super init first
        var size = cc.director.getWinSize();
        this._super();
        // cc.log("onKeyPressed"); 
        this.gameState = "mainMenu";
        cc.log(this.gameState);
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
                            ld_inst.ld_inst == true;
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
        this.spriteTrack1.setPosition(size.width / 2, 165);
        this.addChild(this.spriteTrack1, 0);

        this.spriteTrack2 = new cc.Sprite("#track.png");
        this.spriteTrack2.setAnchorPoint(0.5, 0.5);
        this.spriteTrack2.setPosition((size.width / 2) + this.spriteTrack1.getContentSize().width, 165);
        this.addChild(this.spriteTrack2, 0);

        cc.spriteFrameCache.addSpriteFrames(dinoPos, dino);
        this.spriteDino = new cc.Sprite("#dino_duck_1.png");
        cc.spriteFrameCache.addSpriteFrames(birdPos, bird);
        this.spriteBird = new cc.Sprite("#bird_1.png");
        cc.spriteFrameCache.addSpriteFrames(cactusPos, cactus);
        this.spriteCactus = new cc.Sprite("#cactus_1.png");

        this.spriteCloud1 = this.createCloud(size.width / 3);
        this.spriteCloud2 = this.createCloud(size.width / 3 * 2);
        this.spriteCloud3 = this.createCloud(size.width);
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
        this.Label(size);
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
    gameStart: function()
    {
        this.spriteTrack1.setVisible(false); 
        this.spriteTrack2.setVisible(false);
        this.spriteCloud1.setVisible(false); 
        this.spriteCloud2.setVisible(false);
        this.spriteCloud3.setVisible(false);
        this.spriteDino.setVisible(false);
        // this.allDigits.setVisible(false);
        for(var i = 0; i < this.allDigits.length; i++)
        {
            this.allDigits[i].setVisible(false);
        }
        cc.spriteFrameCache.addSpriteFrames(dinoPos, dino);
        this.spriteDino = new cc.Sprite("#dino_jump.png"); 
        this.spriteDino.setPosition(200, 200);
        this.spriteDino.setAnchorPoint(0.5,0.5); 
        this.addChild(this.spriteDino, 0);
        this.spriteDino.setVisible(false);
        // Setup animation
        this.setupDino();

        // Run by default
        this.run();

    },
    changeStateToRunning: function()
    {
        this.helloLabel.setVisible(false);
        this.gameState = "running";
        this.spriteDino.setVisible(true); 
        this.spriteCloud1.setVisible(true);
        this.spriteCloud2.setVisible(true);
        this.spriteCloud3.setVisible(true);
        this.spriteTrack1.setVisible(true);
        this.spriteTrack2.setVisible(true);
        //this.spriteTrack1.setPosition(cc.director.getWinSize().width / 2, 165);
        //this.spriteTrack2.setPosition(cc.director.getWinSize().width + this.spriteTrack1.getContentSize().width / 2, 165);
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
        this.helloLabel = new cc.LabelTTF("Press any key to start", "Impact", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(size.width / 2, size.height - 40);
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);
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
        if (key === cc.KEY.space) 
        {
            if (this.dinoState == "run") 
            {
                this.dinoState = "jump";
                this.jump();
            }

            cc.log("Key space pressed");
        }
        else if (key === cc.KEY.down) 
        {
            if (this.dinoState == "run")
            {
                this.dinoState = "duck";
                this.duck();
            }

            else if (this.dinoState == "jump") {
                this.cancelJump();
            }
            
            cc.log("Key down pressed");
        }
        else 
        { 
            this.dinoState = "run";
            cc.log("run");
        }
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
        else if (key === cc.KEY.down) 
        {
            if (this.dinoState == "duck")
            {
                this.cancelJump();
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
         
        // Jump animation
        this.animJump = new cc.Animation(); 
        this.animJump.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame("dino_jump.png"));
        //this.animJump = cc.sequence(jumpUp, jumpDown);

        
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
    
        var jumpUp = cc.moveBy(this.jumpDuration * 0.5, cc.p(0, this.jumpHeight)).easing(cc.easeOut(2.0));

        var jumpDown = cc.moveBy(this.jumpDuration * 1, cc.p(0, -this.jumpHeight)).easing(cc.easeIn(2.0));

        var jumpMotion = cc.sequence(jumpUp, jumpDown, cc.callFunc(this.endJump, this));
    
        this.spriteDino.runAction(jumpMotion);
        this.spriteDino.runAction(cc.animate(this.animJump));
    },
    

    cancelJump: function() 
    {
        this.spriteDino.stopAllActions();

        this.dinoState = "vol"; 

        var lop = cc.moveTo(0.1, cc.p(200, 200));

        var a = cc.sequence(lop, cc.callFunc(this.duck, this));
        this.spriteDino.runAction(a);
        //var cancleMotion = cc.sequence(cc.moveTo(200, 200), cc.callFunc(this.duck), this);
        //this.spriteDino.runAction(cancleMotion);
       
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

    spawnCactus: function() {
        var cactusType = Math.floor(Math.random() * 6) + 1; // Random cactus type between 1 and 6
        var cactusSpriteFrameName = "cactus_" + cactusType + ".png";
        var cactusSprite = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(cactusSpriteFrameName));
        
        cactusSprite.setAnchorPoint(0.5, 0);
        cactusSprite.setPosition(cc.director.getWinSize().width + cactusSprite.getContentSize().width, 160); 
        
        this.addChild(cactusSprite);
    
        var moveAction = cc.moveTo(2.75, cc.p(-cactusSprite.getContentSize().width, 160)); // Move across the screen in 4 seconds
        var cleanupAction = cc.callFunc(function() {
            cactusSprite.removeFromParent();
        }, this);
    
        cactusSprite.runAction(cc.sequence(moveAction, cleanupAction));
    },
    

    spawnBird: function() {
        var size = cc.director.getWinSize();
        var birdHeight = 195 + Math.random() * 180; 
        this.spriteBird.setPosition(size.width + this.spriteBird.getContentSize().width, birdHeight);
        this.addChild(this.spriteBird);

        var birdFrames = [];
        birdFrames.push(cc.spriteFrameCache.getSpriteFrame("bird_1.png"));
        birdFrames.push(cc.spriteFrameCache.getSpriteFrame("bird_2.png"));
        var birdAnimation = new cc.Animation(birdFrames, 0.2);
        var birdAnimate = cc.animate(birdAnimation).repeatForever();

        var birdSpeed = 300; 
        var birdFlyAction = cc.moveTo(size.width / birdSpeed, cc.p(-this.spriteBird.getContentSize().width, birdHeight));
        var removeBird = cc.callFunc(function() {
            this.spriteBird.removeFromParent();
        }, this);

        this.spriteBird.runAction(birdAnimate);
        this.spriteBird.runAction(cc.sequence(birdFlyAction, removeBird));
    },

    createCloud: function(xPosition) {
        var size = cc.director.getWinSize();
        var cloudSprite = new cc.Sprite("#cloud.png");
        var cloudHeight = this.cloudMinHeight + Math.random() * (this.cloudMaxHeight - this.cloudMinHeight);
    
        cloudSprite.setPosition(xPosition, cloudHeight);
        this.addChild(cloudSprite);
    
        return cloudSprite;
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
    
    /* spawnCloud : function() {
        var size = cc.director.getWinSize();
        var cloudHeight = size.height / 2 + Math.random() * size.height / 4;
        this.spriteCloud.setPosition(size.width + this.spriteCloud.getContentSize().width, cloudHeight); 
        this.addChild(this.spriteCloud);

        var cloudSpeed = 50; 
        var cloudMove = cc.moveTo(size.width / cloudSpeed, cc.p(-this.spriteCloud.getContentSize().width, cloudHeight));
        var removeCloud = cc.callFunc(function() {
            this.spriteCloud.removeFromParent();
        }, this);

        this.spriteCloud.runAction(cc.sequence(cloudMove, removeCloud));
    }, */ 

    update: function(dt)
    {
        cc.log(dt);

        // this.givenNumbers = this.changingNumber(this.givenNumbers);
        if(this.gameState == "running")
        {
            this.schedule(this.spawnCactus, 2.5);
            this.schedule(this.spawnBird, 7);
            this.moveTrack(12);
            this.updateClouds(dt);
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
    