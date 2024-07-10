var keyPressed;

var dl = {
    helloLabel:null,
    sprite:null,
    spriteDino:null,
    gameState: "mainMenu",
    show: false,
    init:function () 
    {
        //////////////////////////////
        // 1. super init first
        var size = cc.director.getWinSize();
        this._super();
        // cc.log("onKeyPressed");
        this.gameState = "mainMenu";
        cc.log(this.gameState);
        if ('keyboard' in cc.sys.capabilities)
            {
                var keyboardListener =
                {
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function(key, event)
                    {
                        keyPressed = key;
                    }
                };
                cc.eventManager.addListener(keyboardListener, this);
            }

        // this.removeChild(this.sprite);
        cc.spriteFrameCache.addSpriteFrames(gameOverPos, gameOver);
        this.sprite = new cc.Sprite("#track.png");
        this.spriteCloud = new cc.Sprite("#cloud.png");
        cc.spriteFrameCache.addSpriteFrames(dinoPos, dino);
        this.spriteDino = new cc.Sprite("#dino_duck_1.png");
        //cc.log("MyLayer - init");
        foo();
        this.Label(size);
        this.backGroundAtStart();
        this.createDino(this.spriteDino);
        this.gameStart();
        // get screen size
        // add "Helloworld" splash screen"
        
    },
    gameStart: function()
    {
        this.sprite.setVisible(false); 
        this.spriteCloud.setVisible(false); 
        this.spriteDino.setVisible(false);
    },
    changeStateToRunning: function()
    {
        this.gameState = "running";
        this.spriteDino.setVisible(true); 
        this.spriteCloud.setVisible(true);
        this.sprite.setVisible(true);
        cc.log("changeStateToRunning");
    },

    Label:function(size)
    {
        /////////////////////////////
        // 2. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = new cc.LabelTTF("Press A to start", "Impact", 38);
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

    },
    createDino: function(spriteDino)
    {
        spriteDino.setPosition(200, 200);
        spriteDino.setAnchorPoint(0.5,0.5);
        this.spriteDino.setVisible(false);
        this.addChild(spriteDino, 1);
    },
    onEnter: function()
    {
        this._super();
        // cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
    },
    update: function(dt)
    {
        if (keyPressed == 65)
        {
            if (this.gameState == "mainMenu")
            {
                this.changeStateToRunning();
            }
            
            //show = true;
            //dl.visibleAtStart(show,this.sprite,this.spriteCloud,this.spriteDino);
        }

        //this.show = false;
        if (this.gameState == "mainMenu")
        {

        }
        else
        {

        }
    },

};
// function gameStart(gameState)
// {
//     if ('keyboard' in cc.sys.capabilities)
//         {
//             var keyboardListener =
//             {
//                 event: cc.EventListener.KEYBOARD,
//                 onKeyPressed: function(key, event)
//                 {
//                     if (key == 32)
//                     {
//                         return gameState = "running";
//                     }
//                 }
//             };
//             cc.eventManager.addListener(keyboardListener, this);
//         }
// }
var dinoLayer = cc.Layer.extend(dl);

var dinoScene = cc.Scene.extend({
    onEnter:function () 
    {
        // 1. super init first
        this._super();
        // 2. new layer
        var layer = new dinoLayer();
        // 3. init layer
        layer.init();
        // 4. add to scene
        this.addChild(layer);
        // cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
        // cc.log("Node Parent: " + dino.parent);
    }
});
    