const { ccclass, property } = cc._decorator;

@ccclass
export default class Follow_spot extends cc.Component {
  @property(cc.Node)
  bg: cc.Node = null;
  material: cc.Material = null;

  onLoad() {
    this.material = this.bg.getComponent(cc.Sprite).getMaterial(0);
    this.material.setProperty('wh_ratio', this.bg.width / this.bg.height);
    console.log(this.bg.width / this.bg.height)


    this.bg.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    this.bg.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
  }

  touchEvent(evt: cc.Event.EventTouch) {
    let pos = evt.getLocation();
    this.material.setProperty('center', [pos.x / this.bg.width, (this.bg.height - pos.y) / this.bg.height]);
  }
}
