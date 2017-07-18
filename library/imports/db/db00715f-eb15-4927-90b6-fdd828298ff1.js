"use strict";
cc._RF.push(module, 'db007Ff6xVJJ5C2/dgoKY/x', 'start');
// Script/start.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this.node.on('touchstart', function () {
            cc.director.loadScene("mainScene");
        });
    }
});

cc._RF.pop();