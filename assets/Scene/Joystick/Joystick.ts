const { ccclass, property } = cc._decorator;

@ccclass
export default class Roller extends cc.Component {
  @property({ type: cc.Node, tooltip: '操控杆的控制点' })
  controlDot: cc.Node = null;
  @property({ type: cc.Node, tooltip: '操控杆' })
  joystick: cc.Node = null;
  @property(cc.Node)
  movableStar: cc.Node = null;

  movableFlag: boolean = false;
  radian: number = 0;
  speed: number = 150;
  onLoad() {
    this.initTouchEvent();
  }

  initTouchEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, this);
  }

  touchStartEvent(event) {
    let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
    const distance = touchPos.len();
    const radius = this.node.width / 2 - this.controlDot.width / 2;

    // 以x轴正方向为基准，计算偏移量
    this.radian = cc.v2(1, 0).signAngle(touchPos);
    const offsetX = Math.cos(this.radian) * radius;
    const offsetY = Math.sin(this.radian) * radius;
    this.controlDot.setPosition(radius > distance ? touchPos : cc.v2(offsetX, offsetY));

    this.movableFlag = true;
  }

  touchMoveEvent(event) {
    let touchPos: cc.Vec2 = this.node.convertToNodeSpaceAR(event.getLocation());
    const distance = touchPos.len();
    const radius = this.node.width / 2 - this.controlDot.width / 2;

    this.radian = cc.v2(1, 0).signAngle(touchPos);
    const offsetX = Math.cos(this.radian) * radius;
    const offsetY = Math.sin(this.radian) * radius;

    this.controlDot.setPosition(radius > distance ? touchPos : cc.v2(offsetX, offsetY));
  }

  touchEndEvent() {
    this.movableFlag = false;
    this.controlDot.setPosition(cc.v2(0, 0));
  }

  update(dt) {
    if (!this.movableFlag) return;
    this.movableStar.x += Math.cos(this.radian) * dt * this.speed;
    this.movableStar.y += Math.sin(this.radian) * dt * this.speed;
  }
}
