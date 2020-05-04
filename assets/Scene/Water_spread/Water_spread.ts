const { ccclass, property } = cc._decorator;

@ccclass
export default class Water_spread extends cc.Component {
  @property(cc.Node)
  bg: cc.Node = null;
  material: cc.Material = null;

  onLoad() {
    this.material = this.bg.getComponent(cc.Sprite).getMaterial(0);
    this.bg.on(cc.Node.EventType.TOUCH_END, this.touchStartEvent, this);
  }

  waveOffset: number = 0.0;
  touchStartEvent(evt: cc.Event.EventTouch) {
    let pos = evt.getLocation();
    this.material.setProperty('center', [ pos.x / this.bg.width, (this.bg.height - pos.y) / this.bg.height]);
    this.waveOffset = 0.0;
  }

  update(dt) {
    if (this.waveOffset > 2.0) return;

    this.waveOffset += dt;
    this.material.setProperty('wave_offset', this.waveOffset);
  }
}
