const { ccclass, property } = cc._decorator;

@ccclass
export default class DepthPhoto extends cc.Component {
  @property(cc.Sprite) renderSprite: cc.Sprite = null;
  @property({ type: cc.Texture2D }) textureList: cc.Texture2D[] = [];
  @property({ type: cc.Texture2D }) depthTextures: cc.Texture2D[] = [];

  @property(cc.Sprite) originPic: cc.Sprite = null;
  @property(cc.Sprite) depthPic: cc.Sprite = null;

  private textureIndex = -1;

  start() {
    this.switchNextTexture();
    this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
  }

  onMouseMove(event) {
    let mousePosition = event.getLocation();
    let normalizedMousePosition = [
      (mousePosition.x / cc.winSize.width) * 2 - 1,
      -(mousePosition.y / cc.winSize.height) * 2 + 1
    ];
    this.renderSprite.getMaterial(0).setProperty('offset', new Float32Array(normalizedMousePosition));
  }
  switchNextTexture() {
    this.textureIndex = (this.textureIndex + 1) % this.textureList.length;
    this.updateMaterial()
  }
  switchPrevTexture() {
    this.textureIndex = (this.textureIndex - 1 + this.textureList.length) % this.textureList.length;
    this.updateMaterial()
  }
  updateMaterial() {
    this.originPic.spriteFrame = new cc.SpriteFrame(this.textureList[this.textureIndex]);
    this.depthPic.spriteFrame = new cc.SpriteFrame(this.depthTextures[this.textureIndex]);

    this.renderSprite.spriteFrame.setTexture(this.textureList[this.textureIndex]);
    this.renderSprite.getMaterial(0).setProperty('spriteTexture', this.textureList[this.textureIndex]);
    this.renderSprite.getMaterial(0).setProperty('depthTexture', this.depthTextures[this.textureIndex]);
  }
}
