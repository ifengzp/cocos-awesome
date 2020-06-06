import BackHomeBtn from './BackHomeBtn';
const { ccclass, property } = cc._decorator;
const LOAD_SCENE_MIN_SEC: number = 1.2;
enum sceneList {
  'Water_spread' = '水波扩散效果（shader）',
  'Specular_gloss' = '镜面光泽效果（shader）',
  'Dissolve_color' = '溶解效果（shader）',
  'Follow_spot' = '追光效果（shader）',
  'Metaball' = '融球效果（shader）',
  'Circle_avatar' = '圆形头像（shader）',
  'Scratch_ticket' = '刮刮卡实现',
  'Coin_fly_to_wallet' = '金币落袋效果',
  'Moving_ghost' = '移动残影效果',
  'Magnifying_mirror' = '放大镜效果',
  'Typer' = '打字机效果',
  'Bullet_Tracking' = '子弹跟踪效果',
  'Infinite_bg_scroll' = '背景无限滚动',
  'Change_clothes' = '换装',
  'Screen_vibrating' = '震屏效果+动画恢复第一帧',
  'Joystick' = '遥控杆',
  'Filter' = '颜色滤镜',
  'Mosaic' = '马赛克/像素风（shader）',
  'Photo_gallery' = '渐变过渡的相册（shader）'
}

@ccclass
export default class Home extends cc.Component {
  @property(cc.Node)
  loadingNode: cc.Node = null;
  @property(cc.ProgressBar)
  loadingProgress: cc.ProgressBar = null;
  @property(cc.Node)
  scrollContent: cc.Node = null;
  @property(cc.Prefab)
  scrollItemPrefab: cc.Prefab = null;

  onLoad() {
    this.initScrollItem();
  }

  start() {
    this.judgeJump();
  }

  judgeJump() {
    const sceneName = this.getQueryStringByName('sceneName');
    const isSameVisit = window['isSameVisit'];

    if (!sceneName) return;
    if (isSameVisit) return;

    if (sceneList[sceneName]) {
      window['isSameVisit'] = true;
      this.loadScene(sceneName);
    }
  }

  getQueryStringByName(name) {
    let result = window.location.search.match(new RegExp('[?&]' + name + '=([^&]+)', 'i'));
    return result == null || result.length < 1 ? '' : result[1];
  }

  initScrollItem() {
    for (let key in sceneList) {
      let scrollItem = cc.instantiate(this.scrollItemPrefab);

      scrollItem.getChildByName('label').getComponent(cc.Label).string = sceneList[key];
      scrollItem.on(
        cc.Node.EventType.TOUCH_END,
        () => {
          cc.tween(scrollItem)
            .to(0.1, { scale: 1.05 })
            .to(0.1, { scale: 1 })
            .start();
          this.loadScene(key);
        },
        this
      );

      this.scrollContent.addChild(scrollItem);
    }
  }

  beginLoad: boolean = false;
  finishLoadFlag: boolean = false;
  loadTime: number = 0;
  loadSceneName: string = '';
  loadScene(key) {
    if (this.beginLoad) return;
    this.loadingProgress.progress = 0;
    this.loadingNode.active = true;
    this.beginLoad = true;
    this.loadSceneName = key;

    cc.director.preloadScene(
      key,
      (completedCount, totalCount) => {
        // 还是做假进度条吧，缓存之后太快了，一闪而过的体验不好
        // this.loadingProgress.progress = completedCount / totalCount;
      },
      (error, asset) => {
        if (!error) {
          this.finishLoadFlag = true;
        } else {
          this.loadingNode.active = false;
          this.beginLoad = false;
          this.loadTime = 0;
        }
      }
    );
  }

  update(dt) {
    if (!this.beginLoad) return;

    if (this.loadTime >= LOAD_SCENE_MIN_SEC && this.finishLoadFlag) {
      this.loadingProgress.progress = 1;
      BackHomeBtn.instance.toggleActive(true);
      cc.director.loadScene(this.loadSceneName);
    } else {
      this.loadTime += dt;
      this.loadingProgress.progress = Math.min(this.loadTime / LOAD_SCENE_MIN_SEC, this.finishLoadFlag ? 1 : 0.9);
    }
  }
}
