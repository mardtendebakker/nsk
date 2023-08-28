import * as bwipjs from 'bwip-js';

export class PrintProcess {
  protected cleanString(text = '') {
    const utf8 = {
      '/[áàâãªä]/u': 'a',
      '/[ÁÀÂÃÄ]/u': 'A',
      '/[ÍÌÎÏ]/u': 'I',
      '/[íìîï]/u': 'i',
      '/[éèêë]/u': 'e',
      '/[ÉÈÊË]/u': 'E',
      '/[óòôõºö]/u': 'o',
      '/[ÓÒÔÕÖ]/u': 'O',
      '/[úùûü]/u': 'u',
      '/[ÚÙÛÜ]/u': 'U',
      '/ç/': 'c',
      '/Ç/': 'C',
      '/ñ/': 'n',
      '/Ñ/': 'N',
      '/–/': '-', // UTF-8 hyphen to "normal" hyphen
      '/[’‘‹›‚]/u': ' ', // Literally a single quote
      '/[“”«»„]/u': ' ', // Double quote
      '/ /': ' ', // nonbreaking space (equiv. to 0x160)
      '/&/': 'en',
    };
    
    let replacedText: string;
    for (const key in utf8) {
      replacedText = text.replace(new RegExp(key), utf8[key]);
    }

    return replacedText;
  }

  async getBarcode(params: {
    text: string,
    scale?: number,
    height?: number,
  } = { text: undefined, scale: 2, height: 10 }): Promise<string> {
    const {
      text,
      scale = 2,
      height = 10
    } = params;
    
    return new Promise((resolve, reject) => {
      bwipjs.toBuffer({
        bcid:        'code39',
        text:        this.cleanString(text).toUpperCase(),
        scale:       scale,
        height:      height,
      }, function (err, png) {
        if (err) {
          reject(err);
        } else {
          const base64String = png.toString('base64');
          resolve(`data:image/png;base64,${base64String}`);
        }
      });
    })
  }
}
