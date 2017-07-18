"use strict";
cc._RF.push(module, 'fa5adQNwXdNC4VnP7f91oMf', 'canvas');
// Script/canvas.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        var main = cc.find("Canvas/main").getComponent(require("main"));
        this.node.once('touchstart', main.longerAction, main);
        this.node.once('touchend', main.removeAction, main);
    }

});

cc._RF.pop();