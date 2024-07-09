var MyLayer = cc.Layer.extend(
{
    helloLabel:null,
    sprite:null,
    init:function () 
    {
        //////////////////////////////
        // 1. super init first
        this._super();

        //cc.log("MyLayer - init");
        foo();
        // get screen size
        var size = cc.director.getWinSize();

        /////////////////////////////
        // 2. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = new cc.LabelTTF("Hello World", "Impact", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(size.width / 2, size.height - 40);
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        // add "Helloworld" splash screen"
        this.sprite = new cc.Sprite(s_HelloWorld);
        this.sprite.setAnchorPoint(0.5, 0.5);
        this.sprite.setPosition(size.width / 2, size.height / 2);
        this.sprite.setScale(size.height / this.sprite.getContentSize().height);
        this.addChild(this.sprite, 0);

    },
    onEnter: function()
    {
        this._super();
        cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
    },
    update: function(dt)
    {
        cc.log ("MyLayer - onEnter()" + dt);
    },
});

var MyScene = cc.Scene.extend({
    onEnter:function () 
    {
        // 1. super init first
        this._super();
       
        // 2. new layer
        var layer = new MyLayer();

        // 3. init layer
        layer.init();

        // 4. add to scene
        this.addChild(layer);
        cc.log("MyLayer - onEnter()");
        this.scheduleUpdate();
    }
});
