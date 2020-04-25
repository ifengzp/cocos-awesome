const { ccclass, property } = cc._decorator;

@ccclass
export default class Follow_spot extends cc.Component {
  @property(cc.Node)
  bg: cc.Node = null;
  material: cc.Material = null;
  center: number[] = [0.1, 0.5];

  onLoad() {
    this.material = this.bg.getComponent(cc.Sprite).getMaterial(0);
    this.material.setProperty('wh_ratio', this.bg.width / this.bg.height);
    this.material.setProperty('center', this.center);

    this.bg.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
  }

  touchMoveEvent(evt: cc.Event.EventTouch) {
    this.center[0] += evt.getDeltaX() / this.bg.width;
    this.center[1] -= evt.getDeltaY() / this.bg.height;
    this.material.setProperty('center', this.center);
  }
}
