var MyLayer = cc.Layer.extend({

    helloLabel:null,

    cmdLabel:null,

    keyLogger: "",
   
    init:function () 
    {
        //////////////////////////////
        // 1. super init first
        this._super();

        //cc.log("MyLayer - init");
        
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

        this.cmdLabel = new cc.LabelTTF(">_", "Impact", 30);
        this.cmdLabel.setPosition((size.width / 2) - 90, size.height - 100);
        this.cmdLabel.setAnchorPoint(0, 1);
        this.addChild(this.cmdLabel);

        //setup keyboard input
        this.keyLogger = "";
        if ('keyboard' in cc.sys.capabilities) {
            var keyboardListener = {
                event: cc.EventListener.KEYBOARD, 

                onKeyPressed: function(key, event) 
                {
                    var t = event.getCurrentTarget();
                    t.onKeyPressed(key);
                }
            };
            cc.eventManager.addListener(keyboardListener, this);
        } 

    },

    onKeyPressed: function(key)
    {
        // simple CLI (command-line interface)

        if (key == cc.KEY.space || 
            (key >= cc.KEY["0"] && key <= cc.KEY["9"]))
        {
            this.keyLogger += String.fromCharCode(key);
        }
        else if (key >= cc.KEY.a && key <= cc.KEY.z)
        {
            //to lowercase
            this.keyLogger += String.fromCharCode(key + 32);
        }
        else if (key == cc.KEY.Delete || key == cc.KEY.backspace)
        {
            if (this.keyLogger.length > 0)
            {
                this.keyLogger = this.keyLogger.substring(0, this.keyLogger.length - 1);
            }
        }
        else if (key == cc.KEY.enter)
        {
            cc.log('>' + this.keyLogger);

            this.onCommandLine(this.keyLogger.split(' '));

            //reset cmd line content
            this.keyLogger = "";
        }

        //show cmd
        this.cmdLabel.setString(this.keyLogger.length == 0 ? ">_" : '>' + this.keyLogger);
    },

    onCommandLine: function(args)
    {
        switch (args[0])
        {
            case "1":
                {
                    connectToMyServer();
                }
                break;

            case "2":
                {
                    sendInt8(0);
                }
                break;
                
            case "3": 
                {
                    sendInt16(32767);
                }
                break;
            
            case "4": 
                {
                    sendInt16Array([0,1234,255]);
                }
                break;

            case "newuser":
                {
                    sendNewUserReq(args[1], args[2]);
                }
                break;

            case "login":
                {
                    sendLogin(args[1],args[2]);
                }
                break;

            case "changepass":
                {
                    sendReqChangePass(args[1]);
                }
                break;
            
            case "logout": 
                {
                    sendReqLogout();
                    break;
                }

            case "pm":
                {
                    sendReqMessage(args[1], args[2]);
                }
                break;

            case "create": 
                {
                    sendCreateGameroomrq(args[1], args[2]);
                    break;
                }

            case "e": 
                {
                    sendMessageInGameRoom(args[1]);
                    break;
                }

            case "join": 
                {
                    sendReqToJoinGameRoom(args[1], args[2]); //join dày dử, server trả về host hay guest
                    break;
                }

            case "run": 
                {
                    // cc.log(role);
                    cc.log(myRole);
                    if(myRole == "Host")
                        sendReqToRunDinoGame();
                    break;
                }
            
            case "room": 
                {
                    if(idRoom != null)
                        sendReqRoomInfo();
                    break;
                }
            
            case "user":
                {
                    sendUserInfo();
                    break;
                }
            
        }
    }

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
    }
});
