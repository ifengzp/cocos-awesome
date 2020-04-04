const { ccclass, property } = cc._decorator;

@ccclass
export default class Typer extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;
  @property(cc.RichText)
  richText: cc.RichText = null;

  typerTimer: number = null; // 计时器Id

  onLoad() {
    this.showRichTextTyper();
  }

  beforeDestroy() {
    // Destroy前确保定时器关闭
    this.typerTimer && clearInterval(this.typerTimer);
  }

  showLabelTyper() {
    let str = '我是异名\n这是Label打字效果';
    this.richText.string = '';
    this.label.string = '';
    this.makeLaberTyper(str);
  }

  makeLaberTyper(str: string) {
    let charArr = str.split('');
    let charIdx = 0;

    this.typerTimer && clearInterval(this.typerTimer);
    this.typerTimer = setInterval(() => {
      if (charIdx >= charArr.length) {
        this.typerTimer && clearInterval(this.typerTimer);
      } else {
        charIdx += 1;
        this.label.string = charArr.slice(0, charIdx).join('');
      }
    }, 50);
  }

  showRichTextTyper() {
    let str = '我是<color=#1B262E>异名</c>\n这是<color=#1B262E>富文本打字机</color>效果';
    this.richText.string = '';
    this.label.string = '';
    this.makeRichTextTyper(str);
  }

  makeRichTextTyper(str: string) {
    let charArr = str.replace(/<.+?\/?>/g, '').split('');
    let tempStrArr = [str];

    for (let i = charArr.length; i > 1; i--) {
      let curStr = tempStrArr[charArr.length - i];
      let lastIdx = curStr.lastIndexOf(charArr[i - 1]);
      let prevStr = curStr.slice(0, lastIdx);
      let nextStr = curStr.slice(lastIdx + 1, curStr.length);

      tempStrArr.push(prevStr + nextStr);
    }

    this.typerTimer && clearInterval(this.typerTimer);
    this.typerTimer = setInterval(() => {
      if (tempStrArr.length) {
        this.richText.string = tempStrArr.pop();
      } else {
        this.typerTimer && clearInterval(this.typerTimer);
      }
    }, 50);
  }

}
