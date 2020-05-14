const { ccclass, property } = cc._decorator;

@ccclass
export default class Metaball extends cc.Component {
  @property(cc.Node)
  ball: cc.Node = null;
  material: cc.Material = null;

  onLoad() {
    this.material = this.ball.getComponent(cc.Sprite).getMaterial(0);
    this.touchStartPoint = cc.v2(this.ball.width / 2,this.ball.height/2);
    this.ball.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
  }

  touchStartPoint: cc.Vec2= null;
  touchMoveEvent(evt: cc.Event.EventTouch) {
    this.touchStartPoint = this.touchStartPoint.add(evt.getDelta());
    const x = this.touchStartPoint.x;
    const y = this.ball.height - this.touchStartPoint.y;
    this.material.setProperty('u_point', [ x / this.ball.width, y / this.ball.height]);
  }
}
