const {ccclass, property} = cc._decorator;
enum sceneList {
  "Infinite_bg_scroll" = "背景无限滚动",
  "Joystick" = "遥控杆",
  "Coin_fly_to_wallet" = "金币落袋",
  "Magnifying_mirror" = "放大镜"
}

@ccclass
export default class Home extends cc.Component {
  @property(cc.Node)
  scrollContent: cc.Node = null;
  @property(cc.Prefab)
  scrollItemPrefab: cc.Prefab = null;

  onLoad() {
    this.initScrollItem();
  }

  initScrollItem() {
    for (let key in sceneList) {
      let scrollItem = cc.instantiate(this.scrollItemPrefab);

      scrollItem.getChildByName("label").getComponent(cc.Label).string = sceneList[key];
		  scrollItem.on(cc.Node.EventType.TOUCH_END, () => {
        cc.tween(scrollItem)
          .to(0.1, { scale: 1.05 })
          .to(0.1, { scale: 1 })
          .start();
        this.loadScene(key);
      }, this);

      this.scrollContent.addChild(scrollItem);
    }
  }

  loadScene(key) {
    cc.director.loadScene(key);
  }
}
