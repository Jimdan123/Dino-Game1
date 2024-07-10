
// init game
cc.game.onStart = function() {

    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
    {
        document.body.removeChild(document.getElementById("cocosLoading"));
    }
        
    var designSize = cc.size(1000, 400);
    //var screenSize = cc.view.getFrameSize();

    // set resource path
    cc.loader.resPath = "res";
    
    cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);

    //load resources
    cc.LoaderScene.preload(g_resources, function () {

        // if load resources success, run this scene
        cc.director.runScene(new dinoScene());

    }, this);
};

// run game
cc.game.run();