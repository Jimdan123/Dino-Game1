
var dl = cc.Layer.extend({
    helloLabel:null,
    sprite:null,
    spriteDino:null,
    spriteDinoJump:null,
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
        var scaleLength = 1; 
        var scaleWidth = 1; 
        var posX = 600; 
        var posY = 350;
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
            posX += 30;
        }
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

        this.spriteCloud = new cc.Sprite("#cloud.png");
        cc.spriteFrameCache.addSpriteFrames(dinoPos, dino);
        this.spriteDino = new cc.Sprite("#dino_duck_1.png");
        cc.spriteFrameCache.addSpriteFrames(birdPos, bird);
        this.spriteBird = new cc.Sprite("#bird_1.png");
        cc.spriteFrameCache.addSpriteFrames(cactusPos, cactus);
        this.spriteCactus = new cc.Sprite("#cactus_1.png");
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
        this.spriteCloud.setVisible(false); 
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
        
        // Setup animation
        this.setupDino();
        this.schedule(this.spawnCactus, 2);

        // Run by default
        this.run();

    },
    changeStateToRunning: function()
    {
        this.helloLabel.setVisible(false);
        this.gameState = "running";
        this.spriteDino.setVisible(true); 
        this.spriteCloud.setVisible(true);
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
        this.spriteCloud.setPosition(100, 300);
        this.spriteTrack1.setVisible(false); 
        this.spriteTrack2.setVisible(true);
        this.spriteCloud.setVisible(false);
        this.addChild(this.spriteCloud, 1);
        this.addChild(this.spriteTrack1, 0);
        this.addChild(this.spriteTrack2, 0);

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

        var jumpDown = cc.moveBy(this.jumpDuration * 1.5, cc.p(0, -this.jumpHeight)).easing(cc.easeIn(2.0));

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
    
        var moveAction = cc.moveTo(4, cc.p(-cactusSprite.getContentSize().width, 160)); // Move across the screen in 4 seconds
        var cleanupAction = cc.callFunc(function() {
            cactusSprite.removeFromParent();
        }, this);
    
        cactusSprite.runAction(cc.sequence(moveAction, cleanupAction));
    },
    

    spawnBird: function() {

    },

    update: function(dt)
    {
       this.moveTrack(8);

        // this.givenNumbers = this.changingNumber(this.givenNumbers);
        if(this.gameState == "running")
        {
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
    