var Layer = cc.Layer.extend(
{
    Label:null,
    sprite:null,
    spriteCow:null,
    spriteNumbers:null,
    init:function () 
    {
        //////////////////////////////
        // 1. super init first
        this._super();
        var size = cc.director.getWinSize();
        var givenNumbers = 999999; 
        var scaleLength = 0.4; 
        var scaleWidth = 0.4; 
        var posX = 200; 
        var posY = 700;
        //cc.log("MyLayer - init");
        foo();
        // get screen size
        /////////////////////////////
        // 2. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.theLabel(size);
        this.theSpriteCow(size);
        this.theSpriteCowAndCrown(size);
        this.horse();
        // this.eventKeyboard();
        this.theNumber(givenNumbers,posX,posY,scaleLength,scaleWidth);
    },
    onEnter: function()
    {
        this._super();
        //cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
    },
    update: function(dt)
    {
        //cc.log ("MyLayer - onEnter()" + dt);
    },
    // eventKeyboard: function ()
    // {
    //     if ('keyboard' in cc.sys.capabilities)
    //         {
    //             var keyboardListener =
    //             {
    //                 event: cc.EventListener.KEYBOARD,
    //                 onKeyPressed: function(key, event)
    //                 {
    //                     if(key == 32)
    //                     {
    //                         cc.log("onKeyPressed - key = " + key);
    //                     }
    //                 },
    //                 onKeyReleased: function(key,event)
    //                 {
    //                     if(key == 32)
    //                         cc.log ("onKeyReleased - key = " + key);
    //                 }
    //             };
    //             cc.eventManager.addListener(keyboardListener, this);
    //         }
    // },
    horse: function()
    {
        cc.spriteFrameCache.addSpriteFrames(horsePos, horse); 
        var spriteRaceHorse = new cc.Sprite("#race_horse_movie_1.png"); 
        spriteRaceHorse.setPosition(200,500);
        this.addChild(spriteRaceHorse);
        var animInfo = new cc.Animation();
        for(var i = 1; i <= 15; i++)
        {
            var frameName = "race_horse_movie_" +  i + ".png";
            animInfo.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(frameName)); 
        }
        animInfo.setDelayPerUnit(0.1); 

        animInfo.setLoops(10); 
        var action = cc.animate(animInfo); 
        spriteRaceHorse.runAction(action);
    },
    theLabel: function(size)
    {
        this.Label = new cc.LabelTTF("First Game", "Impact", 38);
        // position the label on the center of the screen
        this.Label.setPosition(size.width / 2, size.height - 40);
        // add the label as a child to this layer
        this.addChild(this.Label, 5);
        // add "Helloworld" splash screen"
    },
    theNumber: function(givenNumbers,posX,posY,scaleLength,scaleWidth)
    {
        cc.spriteFrameCache.addSpriteFrames(numberPos, number);
        const allDigits = new Array(6);  
        for (var i = 0; i < 6; i++)
        {
            allDigits[i] = new cc.Sprite("#number_0.png");
            allDigits[i].setPosition(posX,posY); 
            allDigits[i].setScale(scaleLength,scaleWidth); 
            this.addChild(allDigits[i]);
            posX += 13;
        }
        for (var i = 0; i < 6; i++)
        {
            var tmp = givenNumbers % 10;  
            var frameName = "number_" +  tmp + ".png";
            allDigits[i].setSpriteFrame(frameName);
            givenNumbers = parseInt(givenNumbers / 10);
        }
        if ('keyboard' in cc.sys.capabilities)
            {
                var keyboardListener =
                {
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function(key, event)
                    {
                       
                        cc.log(key -= 48);
                        cc.log("onKeyPressed - key = " + key);
                    },
                    onKeyReleased: function(key,event)
                    {
                        if(key == 32)
                            cc.log ("onKeyReleased - key = " + key);
                    }
                };
                cc.eventManager.addListener(keyboardListener, this);
            }
            
    },
    theSpriteCow: function(size)
    {
        var valPositionx = 200;
        var valPositiony = 200; 
        var multiplayer  = 0.5; 
        var angle = 30;
        this.sprite = new cc.Sprite(cowPicture);
        this.sprite.setAnchorPoint(0.5, 0.5);
        // this.sprite.setPosition(size.width / 2, size.height / 2);
        this.sprite.setPosition(valPositionx, valPositiony);
        this.sprite.setScale(multiplayer); 
        this.sprite.setRotation(angle);
        // this.sprite.setScale(size.height / this.sprite.getContentSize().height);
        this.addChild(this.sprite, 0);
    },
    theSpriteCowAndCrown: function(size)
    {
        //var size = cc.director.getWinSize();
        var duration = 2;
        var x2 = 220; 
        var y2 = 500; 
        cc.spriteFrameCache.addSpriteFrames(CowAndCrowingPos, CowAndCrowing);
        this.spriteCow = new cc.Sprite("#helmet.png");
        this.spriteCow.setAnchorPoint(0.5, 0.5); 
        // this.spriteCow.setScale (0.3);
        this.spriteCow.setPosition(size.width / 2, size.height / 2); 
        this.addChild(this.spriteCow, 0);

        var actionMove = cc.moveTo(duration, x2, y2);
        var actionRotate = cc.rotateTo(duration, 90);

        var spawn = cc.spawn(actionMove, actionRotate);

        this.spriteCow.runAction(spawn);
    }

});

var KhangScene = cc.Scene.extend({
    onEnter:function () 
    {
        // 1. super init first
        this._super();
       
        // 2. new layer
        var layer = new Layer();

        // 3. init layer
        layer.init();
        // 4. add to scene
        this.addChild(layer);
        //cc.log("MyLayer - onEnter()");
        //this.scheduleUpdate();
    }
});
