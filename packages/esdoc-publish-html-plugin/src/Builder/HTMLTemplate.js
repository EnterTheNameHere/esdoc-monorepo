import ejs from 'ejs';

export class HTMLTemplate {
  static templateRootDir = '';
  
  static render( html, data, fileName ) {
    const options = {
      async: false,
      client: false,
      root: HTMLTemplate.templateRootDir,
      filename: fileName,
    };

    return ejs.compile(html, options)(data);
  }
}
