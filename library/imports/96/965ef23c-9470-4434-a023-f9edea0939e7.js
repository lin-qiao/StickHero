"use strict";
cc._RF.push(module, '965efI8lHBENKAj+e3qCTnn', 'gameover');
// Script/gameover.js

"use strict";

cc.Class({
  extends: cc.Component,

  properties: {
    score: {
      default: null,
      type: cc.Label
    },
    button: {
      default: null,
      type: cc.Button
    }
  },

  // use this for initialization
  onLoad: function onLoad() {
    var main = cc.find("Canvas/main").getComponent(require("main"));
    this.score.string = '得分：' + main.score;
    this.button.node.on('touchstart', function () {
      cc.director.loadScene("mainScene");
    }, this);
  }
});

cc._RF.pop();