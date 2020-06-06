const { ccclass, property } = cc._decorator;

@ccclass
export default class Scene_transition extends cc.Component {
  @property([cc.Node])
  switchNodeList: cc.Node[] = [];
  fadeRadius: number = 0.1;

  onLoad() {
    this.switchNodeList.forEach((node, idx) => {
      node.zIndex = this.switchNodeList.length - idx;
    })
  }

  isTransforming: boolean = false;
  bgTramsform() {
    if (this.isTransforming) return;
    this.isTransforming = true;

    let time = 0.0;
    let node = this.switchNodeList[0];
    let material = node.getComponent(cc.Sprite).getMaterial(0);
    material.setProperty('u_fade_radius', this.fadeRadius);
    material.setProperty('u_time', time);
    material.define('USE_TRAMSFORM', true, 0, true);

    let timer = setInterval(() => {
      time += 0.03;
      material.setProperty('u_time', time);
      if (time > 1.0 + this.fadeRadius) {
        this.switchNodeList.shift();
        this.switchNodeList.push(node);
        this.switchNodeList.forEach((node, idx) => {
          node.zIndex = this.switchNodeList.length - idx;
        })
        material.define('USE_TRAMSFORM', false, 0, true);
        this.isTransforming = false;
        timer && clearInterval(timer);
      }
    }, 30);
  }
}
