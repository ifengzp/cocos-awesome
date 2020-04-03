const { ccclass, property } = cc._decorator;

@ccclass
export default class Change_clothes extends cc.Component {
  @property(cc.SpriteAtlas)
  npcAtlas: cc.SpriteAtlas = null;

  @property(cc.Sprite)
  hair: cc.Sprite = null;
  @property(cc.Sprite)
  clothes: cc.Sprite = null;
  @property(cc.Sprite)
  sleeve: cc.Sprite = null;
  @property(cc.Sprite)
  shoe: cc.Sprite = null;

  changeClothes(evn, type: string) {
    let hairType = this.hair.spriteFrame.name == 'hair_1';
    let clothesType = this.clothes.spriteFrame.name == 'clothes_1';
    let shoeType = this.shoe.spriteFrame.name == 'shoe_1';

    switch (type) {
      case 'hair':
        this.hair.spriteFrame = this.npcAtlas.getSpriteFrame(hairType ? 'hair_2' : 'hair_1');
        break;
      case 'clothes':
        this.clothes.spriteFrame = this.npcAtlas.getSpriteFrame(clothesType ? 'clothes_2' : 'clothes_1');
        this.sleeve.spriteFrame = this.npcAtlas.getSpriteFrame(clothesType ? 'sleeve_2' : 'sleeve_1');
        break;
      case 'shoe':
        this.shoe.spriteFrame = this.npcAtlas.getSpriteFrame(shoeType ? 'shoe_2' : 'shoe_1');
        break;
    }
  }
}
