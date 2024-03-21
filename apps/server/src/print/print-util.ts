import * as bwipjs from 'bwip-js';

export class PrintUtil {
  static cleanString(text = ''): string {
    const utf8: Record<string, string> = {
      '[áàâãªä]': 'a',
      '[ÁÀÂÃÄ]': 'A',
      '[ÍÌÎÏ]': 'I',
      '[íìîï]': 'i',
      '[éèêë]': 'e',
      '[ÉÈÊË]': 'E',
      '[óòôõºö]': 'o',
      '[ÓÒÔÕÖ]': 'O',
      '[úùûü]': 'u',
      '[ÚÙÛÜ]': 'U',
      'ç': 'c',
      'Ç': 'C',
      'ñ': 'n',
      'Ñ': 'N',
      '–': '-', // UTF-8 hyphen to "normal" hyphen
      '[’‘‹›‚]': ' ', // Literally a single quote
      '[“”«»„]': ' ', // Double quote
      ' ': ' ', // nonbreaking space (equiv. to 0x160)
      '&': 'en',
      '\'': ' ',
      '"': ' ',
    };
  
    const patternArray = Object.keys(utf8);
    const replacementArray = Object.values(utf8);
  
    let cleanedText = text;
    for (let i = 0; i < patternArray.length; i++) {
      const pattern = new RegExp(patternArray[i], 'gu');
      cleanedText = cleanedText.replace(pattern, replacementArray[i]);
    }
  
    return cleanedText;
  }

  static async getBarcode(params: {
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
    });
  }
}
