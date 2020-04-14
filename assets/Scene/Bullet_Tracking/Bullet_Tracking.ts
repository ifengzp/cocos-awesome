const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet_Tracking extends cc.Component {
  @property(cc.Node)
  launch_btn: cc.Node = null;

  @property(cc.Node)
  bullet: cc.Node = null;

  @property(cc.Node)
  target: cc.Node = null;

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
  }

  touchMoveEvent(evt: cc.Event.EventTouch) {
    this.target.x += evt.getDeltaX();
    this.target.y += evt.getDeltaY();
  }

  fireFlag: boolean = false;
  fire() {
    this.bullet.getComponent(cc.Sprite).enabled = true;
    this.bullet.getChildByName('boom').active = false;
    this.bullet.setPosition(this.launch_btn.position);
    this.bullet.active = true;
    this.fireFlag = true;
  }

  hitTheTarget() {
    this.fireFlag = false;
    this.bullet.getComponent(cc.Sprite).enabled = false;
    this.bullet.getChildByName('boom').active = true;
    this.scheduleOnce(() => {
      this.bullet.getChildByName('boom').active = false;
    }, 0.2);
  }

  bulletSpeed = 200;
  update(dt) {
    if (!this.fireFlag) return;

    let targetPos: cc.Vec2 = this.target.getPosition();
    let bulletPos: cc.Vec2 = this.bullet.getPosition();
    let normalizeVec: cc.Vec2 = targetPos.subtract(bulletPos).normalize();

    this.bullet.x += normalizeVec.x * this.bulletSpeed * dt;
    this.bullet.y += normalizeVec.y * this.bulletSpeed * dt;
    // 角度变化以y轴正方向为起点，逆时针角度递增
    this.bullet.angle = cc.v2(0, 1).signAngle(normalizeVec) * 180 / Math.PI;

    let rect = this.target.getBoundingBox();
    if (rect.contains(bulletPos)) this.hitTheTarget();
  }
}
