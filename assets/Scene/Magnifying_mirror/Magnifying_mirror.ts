const {ccclass, property} = cc._decorator;

@ccclass
export default class MagnifyingMirror extends cc.Component {
    @property(cc.Node)
    mirror: cc.Node = null;
    @property(cc.Node)
    mirrorCameraNode: cc.Node = null;
    @property(cc.Node)
    tempCameraSpriteNode: cc.Node = null;


    viewSize: cc.Size = null;
    onLoad () {
      this.viewSize = cc.view.getVisibleSize();
      this.initCamera();
      this.mirrorCameraNode.setPosition(this.mirror.getPosition());

      this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, this);
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, this);
    }

    touchStartPos: cc.Vec2 = null;
    mirrorOriginPos: cc.Vec2 = null;
    touchStartEvent(event) {
      this.touchStartPos = event.getLocation();
      this.mirrorOriginPos = this.mirror.getPosition();
    }

    touchMoveEvent(event) {
      let touchPos: cc.Vec2 = event.getLocation();
      let pos = this.mirrorOriginPos.add(touchPos.subtract(this.touchStartPos))

      this.mirror.setPosition(pos);
      this.mirrorCameraNode.setPosition(pos);
    }

    initCamera() {
      let visibleRect = cc.view.getVisibleSize();

      let texture = new cc.RenderTexture();
      texture.initWithSize(visibleRect.width, visibleRect.height);
      let spriteFrame = new cc.SpriteFrame();
      spriteFrame.setTexture(texture);
      this.mirrorCameraNode.getComponent(cc.Camera).targetTexture = texture;

      this.tempCameraSpriteNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      this.tempCameraSpriteNode.scaleY = -1;
    }
}
