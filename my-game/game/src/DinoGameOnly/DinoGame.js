
var dl = cc.Layer.extend({
    helloLabel:null,
    sprite:null,
    spriteDino:null,
    jumpHeight: 200,
    jumpDuration: 0.3, 
    gameState: "init",
    dinoState: "run",
    init:function () 
    {
        //////////////////////////////
        // 1. super init first
        this._super();
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
        this.spriteDino.stopAllActions();
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight));
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight));
        var jumpMotion = cc.sequence(jumpUp, jumpDown, cc.callFunc(this.endJump, this));
        this.spriteDino.runAction(cc.animate(this.animJump));
        this.spriteDino.runAction(jumpMotion);
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
        cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
    },

    update: function(dt)
    {
        /*
        if (this.dinoState === "runInit") {
            this.run();
            this.dinoState = "run"
        }
        else if (this.dinoState === "jump") {
            this.jump();
        }
        else if (this.dinoState === "duck") {
            this.duck();
        }
        */
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

        //cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
        //cc.log("Node Parent: " + dino.parent);
    }
});

cc.director.runScene(new dinoScene());
    