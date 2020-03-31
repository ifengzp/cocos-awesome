const { ccclass, property } = cc._decorator;

@ccclass
export default class Infinite_bg_scroll extends cc.Component {
  @property(cc.Node)
  bg1: cc.Node = null;
  @property(cc.Node)
  bg2: cc.Node = null;

  speed: number = 500;
  update(dt) {
    const temp = dt * this.speed;
    if (this.bg2.x - temp <= 0) {
      this.bg1.x = this.bg2.x;
      this.bg2.x = this.bg1.x + this.bg1.width;
    }

    this.bg1.x -= temp;
    this.bg2.x -= temp;
  }

  backToHome() {
    cc.director.loadScene('Home');
  }
}
