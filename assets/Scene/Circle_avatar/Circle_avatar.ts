const { ccclass, property } = cc._decorator;

@ccclass
export default class CircleAvatar extends cc.Component {
  @property(cc.Sprite)
  rectAvatar: cc.Sprite = null;

  start() {
    this.rectAvatar.getMaterial(0).setProperty('wh_ratio', this.rectAvatar.node.width / this.rectAvatar.node.height);
  }
}
