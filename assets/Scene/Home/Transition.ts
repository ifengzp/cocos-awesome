const { ccclass, property } = cc._decorator;

const TRANSITION_TIME = 2;

@ccclass
export default class Transition extends cc.Component {
  @property() time: number = 0;
  @property(cc.Material) materials = [];

  private _inited = false;
  private _texture1: cc.Texture2D;
  private _texture2: cc.Texture2D;
  private _sprite: cc.Sprite;
  private _spriteNode: cc.Node;
  private _camera: cc.Camera;
  private _cameraNode: cc.Node;
  private _spriteMaterial: cc.Material;
  private _onLoadFinished = () => {};

  loading = false;

  private materialIndex = 0;

  onLoad() {
    cc.game.addPersistRootNode(this.node);
  }

  start() {
    this.init();
    cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._onLoadFinished, this);
    cc.director.on('switchSceneByTransition', this.switchSceneByTransition.bind(this));
  }

  switchSceneByTransition() {
    this.materialIndex = this.materialIndex + 1 > this.materials.length ? 0 : this.materialIndex + 1;
    this.loadScene('Scene/Home/Home', 'Canvas/Main Camera', 'Canvas/Main Camera');
  }

  init() {
    if (this._inited) return;
    this._inited = true;

    this.time = 0;

    this._texture1 = this.createTexture();
    this._texture2 = this.createTexture();

    let spriteNode = cc.find('TRANSITION_SPRITE', this.node);
    if (!spriteNode) {
      spriteNode = new cc.Node('TRANSITION_SPRITE');
      this._sprite = spriteNode.addComponent(cc.Sprite);
      spriteNode.parent = this.node;
    } else {
      this._sprite = spriteNode.getComponent(cc.Sprite);
    }
    let spriteFrame = new cc.SpriteFrame();
    spriteFrame.setTexture(this._texture1);
    this._sprite.spriteFrame = spriteFrame;

    spriteNode.active = false;
    spriteNode.scaleY = -1;
    this._spriteNode = spriteNode;

    let cameraNode = cc.find('TRANSITION_CAMERA', this.node);
    if (!cameraNode) {
      cameraNode = new cc.Node('TRANSITION_CAMERA');
      this._camera = cameraNode.addComponent(cc.Camera);
      cameraNode.parent = this.node;
    } else {
      this._camera = cameraNode.getComponent(cc.Camera);
    }
    cameraNode.active = false;
    this._cameraNode = cameraNode;

    // @ts-ignore
    this.node.groupIndex = cc.Node.BuiltinGroupIndex.DEBUG - 1;
    this._camera.cullingMask = 1 << this.node.groupIndex;

    this.updateSpriteMaterial();
  }

  updateSpriteMaterial() {
    if (!this._sprite) return;

    let newMaterial = cc.MaterialVariant.create(this.materials[this.materialIndex], this._sprite);
    newMaterial.setProperty('texture', this._texture1);
    newMaterial.setProperty('texture2', this._texture2);
    newMaterial.setProperty('screenSize', new Float32Array([this._texture2.width, this._texture2.height]));

    this._sprite.setMaterial(0, newMaterial);
    this._spriteMaterial = newMaterial;
  }

  _onSceneLaunched() {
    window['camera'] = cc.Camera.cameras;
  }

  loadScene(sceneUrl, fromCameraPath, toCameraPath) {
    this.scheduleOnce(() => {
      cc.director.preloadScene(sceneUrl, null, () => {
        this._loadScene(
          sceneUrl,
          fromCameraPath,
          toCameraPath,
          () => {},
          () => {}
        );
      });
    });
    return true;
  }

  createTexture() {
    let texture = new cc.RenderTexture();
    // @ts-ignore
    texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, cc.gfx.RB_FMT_D24S8);
    return texture;
  }

  _loadScene(sceneUrl, fromCameraPath, toCameraPath, onSceneLoaded, onTransitionFinished) {
    this.init();
    this._spriteNode.active = true;
    this._cameraNode.active = true;
    let fromCameraNode = cc.find(fromCameraPath);
    let fromCamera = fromCameraNode && (fromCameraNode.getComponent(cc.Camera) as any);
    if (!fromCamera) {
      cc.warn(`Can not find fromCamera with path ${fromCameraPath}`);
      return;
    }
    let originTargetTexture1 = fromCamera.targetTexture;
    fromCamera.cullingMask &= ~this._camera.cullingMask;
    fromCamera.targetTexture = this._texture1;
    fromCamera.render(cc.director.getScene());
    fromCamera.targetTexture = originTargetTexture1;

    return cc.director.loadScene(sceneUrl, (arg) => {
      onSceneLoaded && onSceneLoaded(...arg);

      let toCameraNode = cc.find(toCameraPath);
      let toCamera = toCameraNode && (toCameraNode.getComponent(cc.Camera) as any);

      if (!toCamera) {
        cc.warn(`Can not find toCamera with path ${toCameraPath}`);
        return;
      }
      toCamera.cullingMask &= ~this._camera.cullingMask;
      let originTargetTexture2 = toCamera.targetTexture;
      toCamera.targetTexture = this._texture2;
      toCamera.render(cc.director.getScene());

      this._camera.depth = toCamera.depth;
      this._camera.clearFlags = toCamera.clearFlags;

      this._onLoadFinished = () => {
        toCamera.targetTexture = originTargetTexture2;

        this._spriteNode.active = false;
        this._cameraNode.active = false;
        onTransitionFinished && onTransitionFinished();
      };

      this.time = 0;
      this.loading = true;
    });
  }

  update(dt) {
    if (this.loading) {
      this.time += dt;
      if (this.time >= TRANSITION_TIME) {
        this.time = TRANSITION_TIME;
        this.loading = false;

        this._onLoadFinished && this._onLoadFinished();
        this._onLoadFinished = null;
      }
      this._spriteMaterial.setProperty('time', this.time / TRANSITION_TIME);
    }
  }
}
