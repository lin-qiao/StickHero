require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"canvas":[function(require,module,exports){
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
},{"main":"main"}],"gameover":[function(require,module,exports){
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
},{"main":"main"}],"hero":[function(require,module,exports){
"use strict";
cc._RF.push(module, '5f5d1kYqaxEg7snzrtdTCcp', 'hero');
// Script/hero.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RF.pop();
},{}],"main":[function(require,module,exports){
"use strict";
cc._RF.push(module, '27c1aDNk8ZNvbEjC+eoleH0', 'main');
// Script/main.js

'use strict';

cc.Class({
  extends: cc.Component,

  properties: {
    square: { // 平台预制
      default: null,
      type: cc.Prefab
    },
    stick: { // 棍子预制
      default: null,
      type: cc.Prefab
    },
    hero: { // 英雄
      default: null,
      type: cc.Node
    },
    scoreLabel: { // 分数label
      default: null,
      type: cc.Label
    },
    highestLabel: { // 最高分
      default: null,
      type: cc.Label
    },
    gameOver: {
      default: null,
      type: cc.Node
    },
    spriteFrame: {
      default: [],
      type: cc.SpriteFrame
    },
    background: {
      default: null,
      type: cc.Sprite
    },
    score: 0, //分数
    highes: 0, //最高分
    oldSquareWidth: 150
  },
  // 创建平台
  createSquare: function createSquare() {
    // 实例化平台
    this.newSquare = cc.instantiate(this.square);
    this.node.addChild(this.newSquare);
    // 随机宽度
    var randomWidth = Math.floor(Math.random() * 100) + 50;
    this.newSquare.width = randomWidth;

    // 随机位置
    var randomDistance = Math.floor(Math.random() * 200) + 50;

    // 距离左边的距离
    this.oldSquareWidth = this.oldSquareWidth + randomDistance + randomWidth;

    var rightX = this.node.width / 2 + randomWidth - this.node.x;
    var x = this.oldSquareWidth - randomWidth / 2 - this.node.width / 2;
    var y = this.square.data.y;

    this.newSquare.setPosition(rightX, y);
    this.newSquare.runAction(cc.moveTo(0.5, cc.p(x, y)));
  },
  // 创建棍子
  createStick: function createStick() {
    // 实例化棍子
    this.newStick = cc.instantiate(this.stick);
    this.node.addChild(this.newStick);
    // 位置
    var x = this.hero.x + this.hero.width / 2 + this.stick.data.width / 2;
    var y = this.hero.y - this.hero.height / 2;
    this.newStick.setPosition(x, y);
  },
  // 伸长棍子
  longerStick: function longerStick() {
    this.stickHeight += 8;
    this.newStick.height = this.stickHeight;
  },
  // 触摸按下函数
  longerAction: function longerAction() {
    this.createStick();
    this.stickHeight = 0;
    // 定时器伸长棍子
    this.schedule(this.longerStick, 0.01);
    // 播放动画
    var anim = this.hero.getComponent(cc.Animation);
    anim.play('heroPush');
  },
  // 棍子掉落
  dropStick: function dropStick() {
    this.scheduleOnce(function () {
      // 棍子掉落
      this.newStick.stopAllActions();
      this.newStick.runAction(cc.rotateTo(.5, 180).easing(cc.easeIn(3)));

      // 英雄掉落
      var y = -this.node.height / 2 - this.hero.height;
      var x = this.hero.x;
      this.hero.stopAllActions();
      this.hero.runAction(cc.moveTo(.5, cc.p(x, y)).easing(cc.easeIn(3)));
    }, 0.5);
  },
  // 棍子搭在平台
  undueStick: function undueStick() {
    this.scheduleOnce(function () {
      // 向左移动视图
      this.node.stopAllActions();
      this.node.runAction(cc.moveBy(0.5, cc.p(-this.newSquare.getBoundingBoxToWorld().x, 0)));
      // 创建平台
      this.createSquare();
    }, 0.5);
  },

  // 触摸放开函数
  removeAction: function removeAction() {
    // 取消定时器
    this.unschedule(this.longerStick);
    // 播放英雄动画
    var anim = this.hero.getComponent(cc.Animation);
    anim.play('heroTick');
    // 棍子动画和回调函数
    this.scheduleOnce(function () {
      var stickAction = cc.sequence(cc.rotateTo(.5, 90).easing(cc.easeIn(3)), cc.callFunc(function () {
        // 棍子最远端X坐标
        var endStickX = this.newStick.x + this.newStick.height;
        // 平台开始X坐标
        var startSquareX = this.newSquare.x - this.newSquare.width / 2;
        // 平台结束x坐标
        var endSquareX = this.newSquare.x + this.newSquare.width / 2;
        if (endStickX >= startSquareX && endStickX <= endSquareX) {
          // 动画
          var x = endSquareX - this.newStick.width - this.hero.width / 2;
          var y = this.hero.y;
          this.hero.runAction(cc.moveTo(0.5, cc.p(x, y)));
          // 棍子搭在平台
          this.undueStick();
          // 增加分数
          this.score++;
          this.scoreLabel.string = '得分：' + this.score;
          // 绑定事件
          var canvas = cc.find("Canvas").getComponent(require("canvas"));
          this.scheduleOnce(function () {
            canvas.node.once('touchstart', this.longerAction, this);
            canvas.node.once('touchend', this.removeAction, this);
          }, 0.5);
        } else {
          // 动画
          var x = endStickX - this.hero.width / 2;
          var y = this.hero.y;
          this.hero.runAction(cc.moveTo(0.5, cc.p(x, y)));
          // 棍子掉落
          this.dropStick();
          // 判断是否为新的最高分
          if (this.highes < this.score) {
            cc.sys.localStorage.stickHero = this.score;
          }
          // gameOver
          this.gameOver.active = true;
        }
      }, this));
      this.newStick.runAction(stickAction);
    }, 0.2);
  },

  onLoad: function onLoad() {
    // 随机背景
    var n = Math.floor(Math.random() * 3);
    this.background.spriteFrame = this.spriteFrame[n];
    // 获取最高分
    if (cc.sys.localStorage.stickHero) {
      this.highes = cc.sys.localStorage.stickHero;
    }
    this.highestLabel.string = '最高分：' + this.highes;
    // 创建平台
    this.createSquare();
  }
});

cc._RF.pop();
},{"canvas":"canvas"}],"start":[function(require,module,exports){
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
},{}]},{},["canvas","gameover","hero","main","start"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvY2FudmFzLmpzIiwiYXNzZXRzL1NjcmlwdC9nYW1lb3Zlci5qcyIsImFzc2V0cy9TY3JpcHQvaGVyby5qcyIsImFzc2V0cy9TY3JpcHQvbWFpbi5qcyIsImFzc2V0cy9TY3JpcHQvc3RhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0k7O0FBRUE7O0FBR0E7QUFDQTtBQUNFO0FBQ0E7QUFDQTtBQUNEOztBQVhJOzs7Ozs7Ozs7O0FDQVQ7QUFDSTs7QUFFQTtBQUNHO0FBQ0U7QUFDQTtBQUZJO0FBSU47QUFDRTtBQUNBO0FBRks7QUFMRTs7QUFXWjtBQUNBO0FBQ0U7QUFDQTtBQUNDO0FBQ0U7QUFDRDtBQUNIO0FBckJJOzs7Ozs7Ozs7O0FDQVQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVlE7O0FBYVo7QUFDQTs7QUFqQks7Ozs7Ozs7Ozs7QUNBVDtBQUNFOztBQUVBO0FBQ0U7QUFDRTtBQUNBO0FBRks7QUFJUDtBQUNFO0FBQ0E7QUFGSTtBQUlOO0FBQ0U7QUFDQTtBQUZHO0FBSUw7QUFDRTtBQUNBO0FBRlM7QUFJWDtBQUNFO0FBQ0E7QUFGVztBQUliO0FBQ0U7QUFDQTtBQUZPO0FBSVQ7QUFDRTtBQUNBO0FBRlU7QUFJWjtBQUNFO0FBQ0E7QUFGUztBQUlYO0FBQ0E7QUFDQTtBQW5DVTtBQXFDWjtBQUNBO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNEO0FBQ0Q7QUFDQTtBQUNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Q7QUFDRDtBQUNBO0FBQ0U7QUFDQTtBQUVEO0FBQ0Q7QUFDQTtBQUNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUQ7QUFDRDtBQUNBO0FBQ0U7QUFDRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNEO0FBQ0Y7QUFDRDtBQUNBO0FBQ0U7QUFDRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRTtBQUdJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0U7QUFDQTtBQUNEO0FBQ0Y7QUFDQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0U7QUFDRDtBQUNEO0FBQ0E7QUFDRDtBQUNGO0FBRUg7QUFDRDtBQUNGOztBQUVEO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFO0FBQ0Q7QUFDRDtBQUNBO0FBQ0E7QUFDRDtBQW5MTTs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7O0FBSUE7QUFDQTtBQUNFO0FBQ0U7QUFDRDtBQUVGO0FBYkkiLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgbWFpbiA9IGNjLmZpbmQoXCJDYW52YXMvbWFpblwiKS5nZXRDb21wb25lbnQocmVxdWlyZShcIm1haW5cIikpO1xyXG4gICAgICB0aGlzLm5vZGUub25jZSgndG91Y2hzdGFydCcsbWFpbi5sb25nZXJBY3Rpb24sbWFpbik7XHJcbiAgICAgIHRoaXMubm9kZS5vbmNlKCd0b3VjaGVuZCcsbWFpbi5yZW1vdmVBY3Rpb24sbWFpbik7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXHJcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xyXG5cclxuICAgIC8vIH0sXHJcbn0pO1xyXG4iLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgc2NvcmU6e1xyXG4gICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgIHR5cGU6Y2MuTGFiZWxcclxuICAgICAgIH0sXHJcbiAgICAgICBidXR0b246e1xyXG4gICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgIHR5cGU6Y2MuQnV0dG9uXHJcbiAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBtYWluID0gY2MuZmluZChcIkNhbnZhcy9tYWluXCIpLmdldENvbXBvbmVudChyZXF1aXJlKFwibWFpblwiKSk7XHJcbiAgICAgIHRoaXMuc2NvcmUuc3RyaW5nID0gJ+W+l+WIhu+8micrIG1haW4uc2NvcmU7XHJcbiAgICAgICB0aGlzLmJ1dHRvbi5ub2RlLm9uKCd0b3VjaHN0YXJ0JyxmdW5jdGlvbigpe1xyXG4gICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJtYWluU2NlbmVcIik7XHJcbiAgICAgICB9LHRoaXMpXHJcbiAgICB9LFxyXG59KTtcclxuIiwiY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyBmb286IHtcclxuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XHJcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXHJcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIC8vIC4uLlxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcclxuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcblxyXG4gICAgLy8gfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gIHByb3BlcnRpZXM6IHtcclxuICAgIHNxdWFyZTp7ICAvLyDlubPlj7DpooTliLZcclxuICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICB0eXBlOmNjLlByZWZhYlxyXG4gICAgfSxcclxuICAgIHN0aWNrOnsgICAgLy8g5qON5a2Q6aKE5Yi2XHJcbiAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgdHlwZTpjYy5QcmVmYWJcclxuICAgIH0sXHJcbiAgICBoZXJvOnsgICAgIC8vIOiLsembhFxyXG4gICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgIHR5cGU6Y2MuTm9kZVxyXG4gICAgfSxcclxuICAgIHNjb3JlTGFiZWw6eyAgICAvLyDliIbmlbBsYWJlbFxyXG4gICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgIHR5cGU6Y2MuTGFiZWxcclxuICAgIH0sXHJcbiAgICBoaWdoZXN0TGFiZWw6eyAgIC8vIOacgOmrmOWIhlxyXG4gICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgIHR5cGU6Y2MuTGFiZWxcclxuICAgIH0sXHJcbiAgICBnYW1lT3Zlcjp7XHJcbiAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgdHlwZTpjYy5Ob2RlXHJcbiAgICB9LFxyXG4gICAgc3ByaXRlRnJhbWU6e1xyXG4gICAgICBkZWZhdWx0OltdLFxyXG4gICAgICB0eXBlOmNjLlNwcml0ZUZyYW1lXHJcbiAgICB9LFxyXG4gICAgYmFja2dyb3VuZDp7XHJcbiAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgdHlwZTpjYy5TcHJpdGVcclxuICAgIH0sXHJcbiAgICBzY29yZTowLCAgICAgICAgLy/liIbmlbBcclxuICAgIGhpZ2hlcyA6IDAsICAgICAvL+acgOmrmOWIhlxyXG4gICAgb2xkU3F1YXJlV2lkdGg6MTUwLFxyXG4gIH0sXHJcbiAgLy8g5Yib5bu65bmz5Y+wXHJcbiAgY3JlYXRlU3F1YXJlOmZ1bmN0aW9uKCl7XHJcbiAgICAvLyDlrp7kvovljJblubPlj7BcclxuICAgIHRoaXMubmV3U3F1YXJlID0gY2MuaW5zdGFudGlhdGUodGhpcy5zcXVhcmUpO1xyXG4gICAgdGhpcy5ub2RlLmFkZENoaWxkKHRoaXMubmV3U3F1YXJlKTtcclxuICAgIC8vIOmaj+acuuWuveW6plxyXG4gICAgdmFyIHJhbmRvbVdpZHRoID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwMCkgKyA1MDtcclxuICAgIHRoaXMubmV3U3F1YXJlLndpZHRoID0gcmFuZG9tV2lkdGg7XHJcblxyXG4gICAgLy8g6ZqP5py65L2N572uXHJcbiAgICB2YXIgcmFuZG9tRGlzdGFuY2UgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMjAwKSArIDUwO1xyXG5cclxuICAgIC8vIOi3neemu+W3pui+ueeahOi3neemu1xyXG4gICAgdGhpcy5vbGRTcXVhcmVXaWR0aCA9IHRoaXMub2xkU3F1YXJlV2lkdGggKyByYW5kb21EaXN0YW5jZSArIHJhbmRvbVdpZHRoO1xyXG5cclxuICAgIHZhciByaWdodFggPSB0aGlzLm5vZGUud2lkdGgvMiArIHJhbmRvbVdpZHRoIC10aGlzLm5vZGUueDtcclxuICAgIHZhciB4ID0gIHRoaXMub2xkU3F1YXJlV2lkdGggLSByYW5kb21XaWR0aC8yIC0gdGhpcy5ub2RlLndpZHRoLzI7XHJcbiAgICB2YXIgeSA9IHRoaXMuc3F1YXJlLmRhdGEueTtcclxuXHJcbiAgICB0aGlzLm5ld1NxdWFyZS5zZXRQb3NpdGlvbihyaWdodFgseSk7XHJcbiAgICB0aGlzLm5ld1NxdWFyZS5ydW5BY3Rpb24oY2MubW92ZVRvKDAuNSxjYy5wKHgseSkpKTtcclxuICB9LFxyXG4gIC8vIOWIm+W7uuajjeWtkFxyXG4gIGNyZWF0ZVN0aWNrOmZ1bmN0aW9uKCl7XHJcbiAgICAvLyDlrp7kvovljJbmo43lrZBcclxuICAgIHRoaXMubmV3U3RpY2sgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnN0aWNrKTtcclxuICAgIHRoaXMubm9kZS5hZGRDaGlsZCh0aGlzLm5ld1N0aWNrKTtcclxuICAgIC8vIOS9jee9rlxyXG4gICAgdmFyIHggPSB0aGlzLmhlcm8ueCArIHRoaXMuaGVyby53aWR0aC8yICsgdGhpcy5zdGljay5kYXRhLndpZHRoLzI7XHJcbiAgICB2YXIgeSA9IHRoaXMuaGVyby55IC0gdGhpcy5oZXJvLmhlaWdodC8yO1xyXG4gICAgdGhpcy5uZXdTdGljay5zZXRQb3NpdGlvbih4LHkpO1xyXG4gIH0sXHJcbiAgLy8g5Ly46ZW/5qON5a2QXHJcbiAgbG9uZ2VyU3RpY2s6ZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuc3RpY2tIZWlnaHQgKz0gODtcclxuICAgIHRoaXMubmV3U3RpY2suaGVpZ2h0ID0gdGhpcy5zdGlja0hlaWdodDtcclxuXHJcbiAgfSxcclxuICAvLyDop6bmkbjmjInkuIvlh73mlbBcclxuICBsb25nZXJBY3Rpb246ZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuY3JlYXRlU3RpY2soKTtcclxuICAgIHRoaXMuc3RpY2tIZWlnaHQgPSAwO1xyXG4gICAgLy8g5a6a5pe25Zmo5Ly46ZW/5qON5a2QXHJcbiAgICB0aGlzLnNjaGVkdWxlKHRoaXMubG9uZ2VyU3RpY2ssMC4wMSlcclxuICAgIC8vIOaSreaUvuWKqOeUu1xyXG4gICAgdmFyIGFuaW0gPSB0aGlzLmhlcm8uZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XHJcbiAgICBhbmltLnBsYXkoJ2hlcm9QdXNoJyk7XHJcblxyXG4gIH0sXHJcbiAgLy8g5qON5a2Q5o6J6JC9XHJcbiAgZHJvcFN0aWNrOmZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbigpe1xyXG4gICAgICAvLyDmo43lrZDmjonokL1cclxuICAgICAgdGhpcy5uZXdTdGljay5zdG9wQWxsQWN0aW9ucygpO1xyXG4gICAgICB0aGlzLm5ld1N0aWNrLnJ1bkFjdGlvbihjYy5yb3RhdGVUbyguNSwxODApLmVhc2luZyhjYy5lYXNlSW4oMykpKTtcclxuXHJcbiAgICAgIC8vIOiLsembhOaOieiQvVxyXG4gICAgICB2YXIgeSA9IC10aGlzLm5vZGUuaGVpZ2h0LzIgLSB0aGlzLmhlcm8uaGVpZ2h0O1xyXG4gICAgICB2YXIgeCA9IHRoaXMuaGVyby54O1xyXG4gICAgICB0aGlzLmhlcm8uc3RvcEFsbEFjdGlvbnMoKTtcclxuICAgICAgdGhpcy5oZXJvLnJ1bkFjdGlvbihjYy5tb3ZlVG8oLjUsY2MucCh4LHkpKS5lYXNpbmcoY2MuZWFzZUluKDMpKSk7XHJcbiAgICB9LDAuNSk7XHJcbiAgfSxcclxuICAvLyDmo43lrZDmkK3lnKjlubPlj7BcclxuICB1bmR1ZVN0aWNrOmZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbigpe1xyXG4gICAgICAvLyDlkJHlt6bnp7vliqjop4blm75cclxuICAgICAgdGhpcy5ub2RlLnN0b3BBbGxBY3Rpb25zKCk7XHJcbiAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2MubW92ZUJ5KDAuNSxjYy5wKC10aGlzLm5ld1NxdWFyZS5nZXRCb3VuZGluZ0JveFRvV29ybGQoKS54LDApKSk7XHJcbiAgICAgIC8vIOWIm+W7uuW5s+WPsFxyXG4gICAgICB0aGlzLmNyZWF0ZVNxdWFyZSgpO1xyXG4gICAgfSwwLjUpXHJcbiAgfSxcclxuXHJcbiAgLy8g6Kem5pG45pS+5byA5Ye95pWwXHJcbiAgcmVtb3ZlQWN0aW9uOmZ1bmN0aW9uKCl7XHJcbiAgICAvLyDlj5bmtojlrprml7blmahcclxuICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLmxvbmdlclN0aWNrKTtcclxuICAgIC8vIOaSreaUvuiLsembhOWKqOeUu1xyXG4gICAgdmFyIGFuaW0gPSB0aGlzLmhlcm8uZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XHJcbiAgICBhbmltLnBsYXkoJ2hlcm9UaWNrJyk7XHJcbiAgICAvLyDmo43lrZDliqjnlLvlkozlm57osIPlh73mlbBcclxuICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBzdGlja0FjdGlvbiA9IGNjLnNlcXVlbmNlKFxyXG4gICAgICAgIGNjLnJvdGF0ZVRvKC41LDkwKS5lYXNpbmcoY2MuZWFzZUluKDMpKSxcclxuICAgICAgICBjYy5jYWxsRnVuYyhmdW5jdGlvbigpe1xyXG4gICAgICAgICAgLy8g5qON5a2Q5pyA6L+c56uvWOWdkOagh1xyXG4gICAgICAgICAgdmFyIGVuZFN0aWNrWCA9IHRoaXMubmV3U3RpY2sueCArIHRoaXMubmV3U3RpY2suaGVpZ2h0O1xyXG4gICAgICAgICAgLy8g5bmz5Y+w5byA5aeLWOWdkOagh1xyXG4gICAgICAgICAgdmFyIHN0YXJ0U3F1YXJlWCA9IHRoaXMubmV3U3F1YXJlLnggLSB0aGlzLm5ld1NxdWFyZS53aWR0aC8yO1xyXG4gICAgICAgICAgLy8g5bmz5Y+w57uT5p2feOWdkOagh1xyXG4gICAgICAgICAgdmFyIGVuZFNxdWFyZVggPSB0aGlzLm5ld1NxdWFyZS54ICsgdGhpcy5uZXdTcXVhcmUud2lkdGgvMjtcclxuICAgICAgICAgIGlmKGVuZFN0aWNrWCA+PSBzdGFydFNxdWFyZVggJiYgZW5kU3RpY2tYIDw9IGVuZFNxdWFyZVgpe1xyXG4gICAgICAgICAgICAvLyDliqjnlLtcclxuICAgICAgICAgICAgdmFyIHggPSBlbmRTcXVhcmVYIC0gdGhpcy5uZXdTdGljay53aWR0aCAtIHRoaXMuaGVyby53aWR0aC8yO1xyXG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuaGVyby55O1xyXG4gICAgICAgICAgICB0aGlzLmhlcm8ucnVuQWN0aW9uKGNjLm1vdmVUbygwLjUsY2MucCh4LHkpKSk7XHJcbiAgICAgICAgICAgICAvLyDmo43lrZDmkK3lnKjlubPlj7BcclxuICAgICAgICAgICAgdGhpcy51bmR1ZVN0aWNrKCk7XHJcbiAgICAgICAgICAgIC8vIOWinuWKoOWIhuaVsFxyXG4gICAgICAgICAgICB0aGlzLnNjb3JlICsrO1xyXG4gICAgICAgICAgICB0aGlzLnNjb3JlTGFiZWwuc3RyaW5nID0gJ+W+l+WIhu+8micgKyB0aGlzLnNjb3JlO1xyXG4gICAgICAgICAgICAvLyDnu5Hlrprkuovku7ZcclxuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IGNjLmZpbmQoXCJDYW52YXNcIikuZ2V0Q29tcG9uZW50KHJlcXVpcmUoXCJjYW52YXNcIikpO1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgIGNhbnZhcy5ub2RlLm9uY2UoJ3RvdWNoc3RhcnQnLHRoaXMubG9uZ2VyQWN0aW9uLHRoaXMpO1xyXG4gICAgICAgICAgICAgIGNhbnZhcy5ub2RlLm9uY2UoJ3RvdWNoZW5kJyx0aGlzLnJlbW92ZUFjdGlvbix0aGlzKTtcclxuICAgICAgICAgICAgfSwwLjUpO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIC8vIOWKqOeUu1xyXG4gICAgICAgICAgICB2YXIgeCA9IGVuZFN0aWNrWCAtIHRoaXMuaGVyby53aWR0aC8yO1xyXG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMuaGVyby55O1xyXG4gICAgICAgICAgICB0aGlzLmhlcm8ucnVuQWN0aW9uKGNjLm1vdmVUbygwLjUsY2MucCh4LHkpKSk7XHJcbiAgICAgICAgICAgIC8vIOajjeWtkOaOieiQvVxyXG4gICAgICAgICAgICB0aGlzLmRyb3BTdGljaygpO1xyXG4gICAgICAgICAgICAvLyDliKTmlq3mmK/lkKbkuLrmlrDnmoTmnIDpq5jliIZcclxuICAgICAgICAgICAgaWYodGhpcy5oaWdoZXMgPCB0aGlzLnNjb3JlKXtcclxuICAgICAgICAgICAgICBjYy5zeXMubG9jYWxTdG9yYWdlLnN0aWNrSGVybyA9IHRoaXMuc2NvcmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZ2FtZU92ZXJcclxuICAgICAgICAgICAgdGhpcy5nYW1lT3Zlci5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIHRoaXMpXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMubmV3U3RpY2sucnVuQWN0aW9uKHN0aWNrQWN0aW9uKTtcclxuICAgIH0sMC4yKTtcclxuICB9LFxyXG5cclxuICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIOmaj+acuuiDjOaZr1xyXG4gICAgdmFyIG4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzKTtcclxuICAgIHRoaXMuYmFja2dyb3VuZC5zcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlRnJhbWVbbl07XHJcbiAgICAvLyDojrflj5bmnIDpq5jliIZcclxuICAgIGlmKGNjLnN5cy5sb2NhbFN0b3JhZ2Uuc3RpY2tIZXJvKXtcclxuICAgICAgdGhpcy5oaWdoZXMgPSBjYy5zeXMubG9jYWxTdG9yYWdlLnN0aWNrSGVybztcclxuICAgIH1cclxuICAgIHRoaXMuaGlnaGVzdExhYmVsLnN0cmluZyA9ICfmnIDpq5jliIbvvJonICsgdGhpcy5oaWdoZXM7XHJcbiAgICAvLyDliJvlu7rlubPlj7BcclxuICAgIHRoaXMuY3JlYXRlU3F1YXJlKCk7XHJcbiAgfSxcclxufSk7XHJcbiIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm5vZGUub24oJ3RvdWNoc3RhcnQnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKFwibWFpblNjZW5lXCIpO1xyXG4gICAgICB9KVxyXG5cclxuICAgIH0sXHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9