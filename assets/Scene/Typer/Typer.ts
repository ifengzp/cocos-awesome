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
    let delimiterCharList: any = ['✁', '✂', '✃', '✄', '✺', '✻', '✼', '❄', '❅', '❆', '❇', '❈', '❉', '❊'];
    let regexp = /<.+?\/?>/g;
    let matchArr = str.match(regexp);
    let delimiterChar = delimiterCharList.find((item) => str.indexOf(item) == -1);
    let replaceStr = str.replace(regexp, delimiterChar);
    let tagInfoArr = [];
    let temp = [];
    let tagInfo: { endStr?; endtIdx?; startIdx?; startStr? } = {};
    let num = 0;
    for (let i = 0; i < replaceStr.length; i++) {
      if (replaceStr[i] == delimiterChar) {
        temp.push(i);
        if (temp.length >= 2) {
          tagInfo.endStr = matchArr[tagInfoArr.length * 2 + 1];
          tagInfo.endtIdx = i - num;
          tagInfoArr.push(tagInfo);
          temp = [];
          tagInfo = {};
        } else {
          tagInfo.startIdx = i - num;
          tagInfo.startStr = matchArr[tagInfoArr.length * 2];
        }
        num += 1;
      }
    }

    let showCharArr = str.replace(regexp, '').split('');
    let typerArr = [];
    for (let i = 1; i <= showCharArr.length; i++) {
      let temp = showCharArr.join('').slice(0, i);
      let addLen = 0;
      for (let j = 0; j < tagInfoArr.length; j++) {
        let tagInfo = tagInfoArr[j];
        let start = tagInfo.startIdx;
        let end = tagInfo.endtIdx;
        if (i > start && i <= end) {
          temp = temp.slice(0, start + addLen) + tagInfo.startStr + temp.slice(start + addLen) + tagInfo.endStr;
          addLen += tagInfo.startStr.length + tagInfo.endStr.length;
        } else if (i > end) {
          temp =
            temp.slice(0, start + addLen) +
            tagInfo.startStr +
            temp.slice(start + addLen, end + addLen) +
            tagInfo.endStr +
            temp.slice(end + addLen);
          addLen += tagInfo.startStr.length + tagInfo.endStr.length;
        }
      }
      typerArr.unshift(temp);
    }

    this.typerTimer && clearInterval(this.typerTimer);
    this.typerTimer = setInterval(() => {
      if (typerArr.length) {
        this.richText.string = typerArr.pop();
      } else {
        this.typerTimer && clearInterval(this.typerTimer);
      }
    }, 50);
  }
}
