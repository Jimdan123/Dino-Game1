
var dl = cc.Layer.extend({
    helloLabel:null,
    sprite:null,
    spriteDino:null,
    spriteDinoJump:null,
    jumpHeight: 200,
    jumpDuration: 0.3, 
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
        this.sprite = new cc.Sprite("#track.png");
        this.spriteCloud = new cc.Sprite("#cloud.png");
        // cc.spriteFrameCache.addSpriteFrames(dinoPos, dino);
        // this.spriteDino = new cc.Sprite("#dino_duck_1.png");
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
        this.sprite.setVisible(false); 
        this.spriteCloud.setVisible(false); 
        this.spriteDino.setVisible(false);
        // this.allDigits.setVisible(false);
        for(var i = 0; i < this.allDigits.length; i++)
        {
            this.allDigits[i].setVisible(false);
        }
    },
    changeStateToRunning: function()
    {
        this.helloLabel.setVisible(false);
        this.gameState = "running";
        this.spriteDino.setVisible(true); 
        this.spriteCloud.setVisible(true);
        this.sprite.setVisible(true);
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
        this.sprite.setAnchorPoint(0.5, 0.5);
        this.sprite.setPosition(100,100);
        this.sprite.setScale(2.5, 2.5);
        this.sprite.setVisible(false);
        this.spriteCloud.setVisible(false);
        this.addChild(this.spriteCloud, 1);
        this.addChild(this.sprite, 0);

        this.gameOn();
    },
        
    gameOn: function()
    {
        cc.spriteFrameCache.addSpriteFrames(dinoPos, dino);
        this.spriteDino = new cc.Sprite("#dino_jump.png"); 
        this.spriteDino.setPosition(200, 200);
        this.spriteDino.setAnchorPoint(0.5,0.5); 
        this.addChild(this.spriteDino, 0);
        // Setup animation
        this.setupDino();

        // Run by default
        this.run();

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
        // this.spriteDino.stopAllActions();
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight));
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight));
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

    update: function(dt)
    {
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
    