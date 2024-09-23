const { ccclass, property } = cc._decorator;

@ccclass
export default class SwitchScene extends cc.Component {
  @property(cc.Node) separator = null;

  @property(cc.SpriteFrame) spriteFrame1 = null;
  @property(cc.SpriteFrame) spriteFrame2 = null;
  @property(cc.Sprite) bgSprite = null;
  @property(cc.Material) material = null;
  private _spriteMaterial: cc.Material;

  touchStartPos = cc.Vec2.ZERO;
  separatorStartPos = cc.Vec2.ZERO;

  start() {
    this.bgSprite.spriteFrame.setTexture(this.spriteFrame1._texture);
    this.initSpriteMaterial();
    this.playTransitionAnimation();
  }

  onLoad() {
    this.separatorStartPos = this.separator.getPosition();
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
  }

  switchSceneByTransition(event, value) {
    cc.director.emit('setBackBtnVisibility', false);
    cc.director.emit('switchSceneByTransition', value);
  }

  playTransitionAnimation() {
    let progress = 0;
    let targetProgress = cc.winSize.width;
    let totalTime = 3;
    let startTime = Date.now();

    const loop = () => {
      if (!this._spriteMaterial || !this.touchStartPos) return;
      if (!this.touchStartPos.equals(cc.Vec2.ZERO)) return;

      let currentTime = Date.now();
      let elapsedTime = (currentTime - startTime) / 1000;
      let _progress = (elapsedTime / totalTime) * targetProgress;
      progress = Math.min(_progress, targetProgress);

      this._spriteMaterial.setProperty('time', progress / cc.winSize.width);
      this.separator.setPosition({ x: progress, y: 0 });

      if (progress < targetProgress) {
        requestAnimationFrame(loop.bind(this));
      }
    };
    loop();
  }

  onTouchStart(event) {
    this.separatorStartPos = this.separator.getPosition();
    this.touchStartPos = this.node.convertToNodeSpaceAR(event.getLocation());
  }

  private onTouchMove(event) {
    // 获取当前触摸点的位置
    let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
    // 计算触摸点相对于起始位置的偏移量
    let offset = touchPos.sub(this.touchStartPos);
    let targetPos = this.separatorStartPos.add(offset);
    let targetX = Math.max(0, Math.min(targetPos.x, cc.winSize.width));
    this.separator.setPosition({
      x: targetX,
      y: 0
    });
    this._spriteMaterial.setProperty('time', targetX / cc.winSize.width);
  }

  initSpriteMaterial() {
    let newMaterial = cc.MaterialVariant.create(this.material, this.bgSprite);
    newMaterial.setProperty('texture', this.spriteFrame1._texture);
    newMaterial.setProperty('texture2', this.spriteFrame2._texture);
    newMaterial.setProperty('screenSize', new Float32Array([cc.winSize.width, cc.winSize.height]));
    newMaterial.setProperty('time', 0.25);

    this.spriteFrame1._texture.setFlipY(true);
    this.spriteFrame2._texture.setFlipY(true);
    this.bgSprite.setMaterial(0, newMaterial);
    this._spriteMaterial = newMaterial;
  }
}
