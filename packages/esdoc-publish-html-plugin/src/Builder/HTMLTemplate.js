import ejs from 'ejs';

export class HTMLTemplate {
  static render( html, data ) {
    return ejs.compile(html, {async: false, client: false})(data);
  }
}
