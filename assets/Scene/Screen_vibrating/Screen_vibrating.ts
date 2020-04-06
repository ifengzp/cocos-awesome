const { ccclass, property } = cc._decorator;

@ccclass
export default class Screen_vibrating extends cc.Component {
  @property(cc.Node)
  bgNode: cc.Node = null;
  @property(cc.Node)
  hitFeedback: cc.Node = null;

  onLoad() {
    this.shakeEffect(this.bgNode, 1);
  }

  hit(evn: cc.Event.EventTouch) {
    this.shakeEffect(evn.currentTarget, 0.6);

    this.hitFeedback.setPosition(this.node.convertToNodeSpaceAR(evn.getLocation()));
    this.hitFeedback.active = true;

    let anim = this.hitFeedback.getComponent(cc.Animation);
    anim.on('finished', () => {
      this.hitFeedback.active = false;
      anim.setCurrentTime(0);
      anim.stop();
    });
    anim.play();
  }

  shakeEffect(node: cc.Node, duration) {
    node.stopAllActions();
    node.runAction(
      cc
        .sequence(
          cc.moveTo(0.02, cc.v2(5, 7)),
          cc.moveTo(0.02, cc.v2(-6, 7)),
          cc.moveTo(0.02, cc.v2(-13, 3)),
          cc.moveTo(0.02, cc.v2(3, -6)),
          cc.moveTo(0.02, cc.v2(-5, 5)),
          cc.moveTo(0.02, cc.v2(2, -8)),
          cc.moveTo(0.02, cc.v2(-8, -10)),
          cc.moveTo(0.02, cc.v2(3, 10)),
          cc.moveTo(0.02, cc.v2(0, 0))
        )
        .repeatForever()
    );

    this.scheduleOnce(() => {
      node.stopAllActions();
      node.setPosition(0, 0);
    }, duration);
  }
}
