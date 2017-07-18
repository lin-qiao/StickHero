cc.Class({
  extends: cc.Component,

  properties: {
    square:{  // 平台预制
      default:null,
      type:cc.Prefab
    },
    stick:{    // 棍子预制
      default:null,
      type:cc.Prefab
    },
    hero:{     // 英雄
      default:null,
      type:cc.Node
    },
    scoreLabel:{    // 分数label
      default:null,
      type:cc.Label
    },
    highestLabel:{   // 最高分
      default:null,
      type:cc.Label
    },
    gameOver:{
      default:null,
      type:cc.Node
    },
    spriteFrame:{
      default:[],
      type:cc.SpriteFrame
    },
    background:{
      default:null,
      type:cc.Sprite
    },
    score:0,        //分数
    highes : 0,     //最高分
    oldSquareWidth:150,
  },
  // 创建平台
  createSquare:function(){
    // 实例化平台
    this.newSquare = cc.instantiate(this.square);
    this.node.addChild(this.newSquare);
    // 随机宽度
    var randomWidth = Math.floor(Math.random()*100) + 50;
    this.newSquare.width = randomWidth;

    // 随机位置
    var randomDistance = Math.floor(Math.random()*200) + 50;

    // 距离左边的距离
    this.oldSquareWidth = this.oldSquareWidth + randomDistance + randomWidth;

    var rightX = this.node.width/2 + randomWidth -this.node.x;
    var x =  this.oldSquareWidth - randomWidth/2 - this.node.width/2;
    var y = this.square.data.y;

    this.newSquare.setPosition(rightX,y);
    this.newSquare.runAction(cc.moveTo(0.5,cc.p(x,y)));
  },
  // 创建棍子
  createStick:function(){
    // 实例化棍子
    this.newStick = cc.instantiate(this.stick);
    this.node.addChild(this.newStick);
    // 位置
    var x = this.hero.x + this.hero.width/2 + this.stick.data.width/2;
    var y = this.hero.y - this.hero.height/2;
    this.newStick.setPosition(x,y);
  },
  // 伸长棍子
  longerStick:function(){
    this.stickHeight += 8;
    this.newStick.height = this.stickHeight;

  },
  // 触摸按下函数
  longerAction:function(){
    this.createStick();
    this.stickHeight = 0;
    // 定时器伸长棍子
    this.schedule(this.longerStick,0.01)
    // 播放动画
    var anim = this.hero.getComponent(cc.Animation);
    anim.play('heroPush');

  },
  // 棍子掉落
  dropStick:function(){
    this.scheduleOnce(function(){
      // 棍子掉落
      this.newStick.stopAllActions();
      this.newStick.runAction(cc.rotateTo(.5,180).easing(cc.easeIn(3)));

      // 英雄掉落
      var y = -this.node.height/2 - this.hero.height;
      var x = this.hero.x;
      this.hero.stopAllActions();
      this.hero.runAction(cc.moveTo(.5,cc.p(x,y)).easing(cc.easeIn(3)));
    },0.5);
  },
  // 棍子搭在平台
  undueStick:function(){
    this.scheduleOnce(function(){
      // 向左移动视图
      this.node.stopAllActions();
      this.node.runAction(cc.moveBy(0.5,cc.p(-this.newSquare.getBoundingBoxToWorld().x,0)));
      // 创建平台
      this.createSquare();
    },0.5)
  },

  // 触摸放开函数
  removeAction:function(){
    // 取消定时器
    this.unschedule(this.longerStick);
    // 播放英雄动画
    var anim = this.hero.getComponent(cc.Animation);
    anim.play('heroTick');
    // 棍子动画和回调函数
    this.scheduleOnce(function(){
      var stickAction = cc.sequence(
        cc.rotateTo(.5,90).easing(cc.easeIn(3)),
        cc.callFunc(function(){
          // 棍子最远端X坐标
          var endStickX = this.newStick.x + this.newStick.height;
          // 平台开始X坐标
          var startSquareX = this.newSquare.x - this.newSquare.width/2;
          // 平台结束x坐标
          var endSquareX = this.newSquare.x + this.newSquare.width/2;
          if(endStickX >= startSquareX && endStickX <= endSquareX){
            // 动画
            var x = endSquareX - this.newStick.width - this.hero.width/2;
            var y = this.hero.y;
            this.hero.runAction(cc.moveTo(0.5,cc.p(x,y)));
             // 棍子搭在平台
            this.undueStick();
            // 增加分数
            this.score ++;
            this.scoreLabel.string = '得分：' + this.score;
            // 绑定事件
            var canvas = cc.find("Canvas").getComponent(require("canvas"));
            this.scheduleOnce(function(){
              canvas.node.once('touchstart',this.longerAction,this);
              canvas.node.once('touchend',this.removeAction,this);
            },0.5);
          }else{
            // 动画
            var x = endStickX - this.hero.width/2;
            var y = this.hero.y;
            this.hero.runAction(cc.moveTo(0.5,cc.p(x,y)));
            // 棍子掉落
            this.dropStick();
            // 判断是否为新的最高分
            if(this.highes < this.score){
              cc.sys.localStorage.stickHero = this.score;
            }
            // gameOver
            this.gameOver.active = true;
          }
        }, this)
      );
      this.newStick.runAction(stickAction);
    },0.2);
  },

  onLoad: function () {
    // 随机背景
    var n = Math.floor(Math.random() * 3);
    this.background.spriteFrame = this.spriteFrame[n];
    // 获取最高分
    if(cc.sys.localStorage.stickHero){
      this.highes = cc.sys.localStorage.stickHero;
    }
    this.highestLabel.string = '最高分：' + this.highes;
    // 创建平台
    this.createSquare();
  },
});
