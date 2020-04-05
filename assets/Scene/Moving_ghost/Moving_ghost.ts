const { ccclass, property } = cc._decorator;

@ccclass
export default class Moving_ghost extends cc.Component {
  @property([cc.Sprite])
  ghostCanvasList: cc.Sprite[] = [];
  @property(cc.Node)
  role: cc.Node = null;
  @property(cc.Camera)
  roleCamera: cc.Camera = null;

  onLoad() {
    const texture = new cc.RenderTexture();
    texture.initWithSize(this.node.width, this.node.height);
    const spriteFrame = new cc.SpriteFrame();
    spriteFrame.setTexture(texture);
    this.roleCamera.targetTexture = texture;
    this.ghostCanvasList.forEach((sprite) => {
      sprite.spriteFrame = spriteFrame;
    });

    this.schedule(this.ghostFollow, 0.1, cc.macro.REPEAT_FOREVER);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
  }

  touchMoveEvent(evt: cc.Event.EventTouch) {
    this.role.x += evt.getDeltaX();
    this.role.y += evt.getDeltaY();
  }

  beforeDestroy() {
    this.unschedule(this.ghostFollow);
  }

  ghostFollow() {
    this.ghostCanvasList.forEach((sprite, i) => {
      const dis = (sprite.node.position as any).sub(this.role.position).mag();
      if (dis < 0.5) return; // 给个误差范围，涉及到浮点数计算，dis的结果不可能精确为0，小于0.5就可以认为是静止了
      sprite.node.stopAllActions();
      sprite.node.runAction(cc.moveTo(i * 0.04 + 0.02, this.role.x, this.role.y));
    });
  }
}
