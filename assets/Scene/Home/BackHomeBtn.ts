const { ccclass, property } = cc._decorator;

@ccclass
export default class BackHomeBtn extends cc.Component {
  static instance: BackHomeBtn = null;

  onLoad() {
    cc.game.addPersistRootNode(this.node);
    BackHomeBtn.instance = this;
    this.toggleActive(false);
  }

  toggleActive(flag: boolean) {
    this.node.active = flag;
  }

  backToHome() {
    this.toggleActive(false);
    cc.director.loadScene('Home');
  }
}
