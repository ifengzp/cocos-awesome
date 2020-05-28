const { ccclass, property } = cc._decorator;

@ccclass
export default class Mosaic extends cc.Component {
  material: cc.Material = null;

  onLoad() {
    this.material = this.node.getChildByName('npc').getComponent(cc.Sprite).getMaterial(0);
  }

  setPixelCount(slide: cc.Slider, type: 'x' | 'y') {
    this.material.setProperty(`${type}_count`, Math.floor(slide.progress * 100));
  }

  togglePixel(toggle: cc.Toggle) {
    this.material.define('USE_MASAIC', toggle.isChecked, 0, true);
  }
}
