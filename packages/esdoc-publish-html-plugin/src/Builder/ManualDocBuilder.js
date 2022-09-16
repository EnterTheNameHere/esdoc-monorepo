import IceCap from '@enterthenamehere/ice-cap';
import path from 'path';
import * as cheerio from 'cheerio';
import DocBuilder from './DocBuilder.js';
import {markdown} from './util.js';

/**
 * Manual Output Builder class.
 */
export default class ManualDocBuilder extends DocBuilder {
  exec(writeFile, copyDir/*, readFile*/) {
    const manuals = this._tags.filter((tag) => { return tag.kind === 'manual'; });
    if(manuals && manuals.length === 0) return;
    
    const manualIndex = this._tags.find((tag) => { return tag.kind === 'manualIndex'; });
    
    const badge = this._writeBadge(manuals, writeFile);
    const contents = this._generateManualCardsContents(manuals, manualIndex, badge);
    
    const fileName = 'manual/index.html';
    const baseUrl = this._getBaseUrl(fileName);
    
    const nav = this._renderTemplate('manualIndex.ejs', { navData: this._generateManualNavData(manuals) });
    const title = 'Manual';
    
    writeFile(fileName, this._renderTemplate('layout.ejs', {nav, title, baseUrl, contents, esdocVersion:null, esdocLink:null}));
    
    for(const manual of manuals) {
      const manualFileName = this._getManualOutputFileName(manual.name);
      const manualBaseUrl = this._getBaseUrl(fileName);
      const manualContents = this._generateManualContents(manual);
      const manualNav = this._renderTemplate('manualIndex.ejs', { navData: this._generateManualNavData(manuals) });
      writeFile(manualFileName, this._renderTemplate('layout.ejs', {nav: manualNav, title, baseUrl: manualBaseUrl, contents: manualContents, esdocVersion:null, esdocLink:null}));
    }
    
    if(manualIndex && manualIndex.globalIndex) {
      writeFile('index.html', this._renderTemplate('layout.ejs', {nav, title, baseUrl: './', contents, esdocVersion:null, esdocLink:null}));
    }
  
    const manualAssets = this._tags.find((tag) => { return tag.kind === 'manualAsset'; });
    if(manualAssets && manualAssets.name) {
      copyDir(manualAssets.name, 'manual/asset');
    }
  }

  exec_old(writeFile, copyDir/*, readFile*/) {
    const manuals = this._tags.filter((tag) => { return tag.kind === 'manual'; });
    const manualIndex = this._tags.find((tag) => { return tag.kind === 'manualIndex'; });
    const manualAsset = this._tags.find((tag) => { return tag.kind === 'manualAsset'; });

    if (manuals.length === 0) return;

    const ice = this._buildLayoutDoc();
    ice.autoDrop = false;
    ice.attr('rootContainer', 'class', ' manual-root');

    {
      const fileName = 'manual/index.html';
      const baseUrl = this._getBaseUrl(fileName);
      const badge = this._writeBadge(manuals, writeFile);
      ice.load('content', this._buildManualCardIndex(manuals, manualIndex, badge), IceCap.MODE_WRITE);
      ice.load('nav', this._buildManualNav(manuals), IceCap.MODE_WRITE);
      ice.text('title', 'Manual', IceCap.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, IceCap.MODE_WRITE);
      ice.attr('rootContainer', 'class', ' manual-index');
      writeFile(fileName, ice.html);

      if (manualIndex.globalIndex) {
        ice.attr('baseUrl', 'href', './', IceCap.MODE_WRITE);
        writeFile('index.html', ice.html);
      }

      ice.attr('rootContainer', 'class', ' manual-index', IceCap.MODE_REMOVE);
    }

    for (const manual of manuals) {
      const fileName = this._getManualOutputFileName(manual.name);
      const baseUrl = this._getBaseUrl(fileName);
      ice.load('content', this._buildManual(manual), IceCap.MODE_WRITE);
      ice.load('nav', this._buildManualNav(manuals), IceCap.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, IceCap.MODE_WRITE);
      writeFile(fileName, ice.html);
    }

    if (manualAsset) {
      copyDir(manualAsset.name, 'manual/asset');
    }
  }
  
  // TODO: What is the meaning of having all these names as files in manual to receive "perfect" badge? We shouldn't "rate" that. Remove it...
  _writeBadge(manuals, writeFile) {
    const specialFileNamePatterns = [
      'overview',
      'design',
      'install',
      'usage',
      'config',
      'example',
      'faq',
      'changelog',
    ];

    let count = 0;
    for(const pattern of specialFileNamePatterns) {
      for(const manual of manuals) {
        const fileName = path.parse(manual.name).name;
        if(fileName.toLowerCase().indexOf(pattern) !== -1) {
          count++;
          break;
        }
      }
    }
    
    if(count !== specialFileNamePatterns.length) return false;
    
    let badge = this._readTemplate('image/manual-badge.svg');
    badge = badge.replace(/@value@/gu, 'perfect');
    badge = badge.replace(/@color@/gu, '#4fc921');
    writeFile('manual-badge.svg', badge);

    return true;
  }
  
  _generateManualContents(manual) {
    const markdowned = markdown(manual.content);
    const contents = this._renderTemplate('manual.ejs', {contents: markdowned});
    
    return contents;
  }
  
  _generateManualCardsContents(manuals, manualIndex, badgeFlag) {
    const cards = [];
    for(const manual of manuals) {
      const fileName = this._getManualOutputFileName(manual.name);
      const manualContents = this._generateManualContents(manual);
      const $ = cheerio.load(manualContents);
      const h1Count = $('h1').length;

      $('h1').each((index, el) => {
        const label = $(el).text();
        const link = (h1Count === 1) ? fileName : `${fileName}#${$('id', el)}`;
        let card = `<h1>${label}</h1>`;
        const nextAll = $(el).nextAll();

        for(let ii = 0; ii < nextAll.length; ii+=1) {
          const next = nextAll.get(ii);
          const tagName = next.tagName.toLowerCase();
          if(tagName === 'h1') return;
          card += `<${tagName}>${$(next).html()}</${tagName}>`;
        }

        cards.push({label, link: {href: link, text: ''}, card});
      });
    }
    
    const manualUserIndex = (manualIndex && manualIndex.content) ? markdown(manualIndex.content) : false;
    const manualBadge = (!manualIndex.coverage || !badgeFlag) ? false : true; // TODO: It doesn't even work as it should...
    const contents = this._renderTemplate('manualCardIndex.ejs', {manualUserIndex, cards, manualBadge});
    
    return contents;
  }
  
  _generateManualNavData(manuals) {
    const navLinks = [];

    for(const manual of manuals) {
      const tableOfContents = [];
      const fileName = this._getManualOutputFileName(manual.name);
      const contents = markdown(manual.content);

      const $ = cheerio.load(contents);
      const h1Count = $('h1').length;
      
      // For each header on page (...)
      $('h1,h2,h3,h4,h5').each((index, el) => {
        const indent = `indent-${el.tagName.toLowerCase()}`;
        const label = $(el).text();
        let link = `${fileName}#${$('id', el)}`;
        if(el.tagName.toLowerCase() === 'h1' && h1Count === 1) link = fileName;
        
        // (...) create link in table of contents
        tableOfContents.push({label, link, indent});
      });
    
      for(const item of tableOfContents) {
        // Transform table of contents to data which can be used by html template...
        navLinks.push({
          link:{
            href: item.link,
            text: item.label
          },
          cssClass: item.indent,
          dataLink: item.link.split('#')[0]
        });
      }
    }
    
    return navLinks;
  }
  
  /**
   * this is
   * @param {manual[]} manuals
   * @param {function(filePath:string, content:string)} writeFile
   * @returns {boolean}
   * @private
   */
  _writeBadge_old(manuals, writeFile) {
    const specialFileNamePatterns = [
      '(overview.*)',
      '(design.*)',
      '(installation.*)|(install.*)',
      '(usage.*)',
      '(configuration.*)|(config.*)',
      '(example.*)',
      '(faq.*)',
      '(changelog.*)'
    ];

    let count = 0;
    for (const pattern of specialFileNamePatterns) {
      const regexp = new RegExp(pattern, 'iu');
      for (const manual of manuals) {
        const fileName = path.parse(manual.name).name;
        if (fileName.match(regexp)) {
          count++;
          break;
        }
      }
    }

    if (count !== specialFileNamePatterns.length) return false;

    let badge = this._readTemplate('image/manual-badge.svg');
    badge = badge.replace(/@value@/gu, 'perfect');
    badge = badge.replace(/@color@/gu, '#4fc921');
    writeFile('manual-badge.svg', badge);

    return true;
  }

  /**
   * build manual navigation.
   * @param {Manual[]} manuals - target manuals.
   * @return {IceCap} built navigation
   * @private
   */
  _buildManualNav(manuals) {
    const ice = new IceCap(this._readTemplate('manualIndex.html'));

    ice.loop('manual', manuals, (_1, manual, ice3) => {
      const toc = [];
      const fileName = this._getManualOutputFileName(manual.name);
      const html = markdown(manual.content);
      const $root = cheerio.load(html, { _useHtmlParser2: true, emptyAttrs: false }).root();
      const h1Count = $root.find('h1').length;

      $root.find('h1,h2,h3,h4,h5').each((_2, el) => {
        const $el = cheerio(el, null, null, { _useHtmlParser2: true, emptyAttrs: false });
        const label = $el.text();
        const indent = `indent-${el.tagName.toLowerCase()}`;

        let link = `${fileName}#${$el.attr('id')}`;
        if (el.tagName.toLowerCase() === 'h1' && h1Count === 1) link = fileName;

        toc.push({label, link, indent});
      });

      ice3.loop('manualNav', toc, (_2, tocItem, ice2) => {
        ice2.attr('manualNav', 'class', tocItem.indent);
        ice2.attr('manualNav', 'data-link', tocItem.link.split('#')[0]);
        ice2.text('link', tocItem.label);
        ice2.attr('link', 'href', tocItem.link);
      });
    });

    return ice;
  }

  /**
   * build manual.
   * @param {Object} manual - target manual.
   * @return {IceCap} built manual.
   * @private
   */
  _buildManual(manual) {
    const html = markdown(manual.content);
    const ice = new IceCap(this._readTemplate('manual.html'));
    ice.load('content', html);

    // convert relative src to base url relative src.
    const $root = cheerio.load(ice.html, { _useHtmlParser2: true, emptyAttrs: false }).root();
    $root.find('img').each((i, el) => {
      const $el = cheerio(el, null, null, { _useHtmlParser2: true, emptyAttrs: false });
      const src = $el.attr('src');
      if (!src) return;
      if (src.match(/^http[s]?:/u)) return;
      if (src.charAt(0) === '/') return;
      $el.attr('src', `./manual/${src}`);
    });
    $root.find('a').each((i, el) => {
      const $el = cheerio(el, null, null, { _useHtmlParser2: true, emptyAttrs: false });
      const href = $el.attr('href');
      if (!href) return;
      if (href.match(/^http[s]?:/u)) return;
      if (href.charAt(0) === '/') return;
      if (href.charAt(0) === '#') return;
      $el.attr('href', `./manual/${href}`);
    });

    return $root.html();
  }

  /**
   * built manual card style index.
   * @param {Object[]} manuals - target manual.
   * @return {IceCap} built index.
   * @private
   */
  _buildManualCardIndex(manuals, manualIndex, badgeFlag) {
    const cards = [];
    for (const manual of manuals) {
      const fileName = this._getManualOutputFileName(manual.name);
      const html = this._buildManual(manual);
      const $root = cheerio.load(html, { _useHtmlParser2: true, emptyAttrs: false }).root();
      const h1Count = $root.find('h1').length;

      $root.find('h1').each((i, el) => {
        const $el = cheerio(el, null, null, { _useHtmlParser2: true, emptyAttrs: false });
        const label = $el.text();
        const link = h1Count === 1 ? fileName : `${fileName}#${$el.attr('id')}`;
        let card = `<h1>${label}</h1>`;
        const nextAll = $el.nextAll();

        for (let ii2 = 0; ii2 < nextAll.length; ii2++) {
          const next = nextAll.get(ii2);
          const tagName = next.tagName.toLowerCase();
          if (tagName === 'h1') return;
          const $next = cheerio(next, null, null, { _useHtmlParser2: true, emptyAttrs: false });
          card += `<${tagName}>${$next.html()}</${tagName}>`;
        }

        cards.push({label, link, card});
      });
    }

    const ice = new IceCap(this._readTemplate('manualCardIndex.html'));
    ice.loop('cards', cards, (i, card, ice2) => {
      ice2.attr('link', 'href', card.link);
      ice2.load('card', card.card);
    });

    if (manualIndex && manualIndex.content) {
      const userIndex = markdown(manualIndex.content);
      ice.load('manualUserIndex', userIndex);
    } else {
      ice.drop('manualUserIndex', true);
    }

    // fixme?
    ice.drop('manualBadge', !manualIndex.coverage || !badgeFlag);

    return ice;
  }

  /**
   * get manual file name.
   * @param {string} filePath - target manual markdown file path.
   * @returns {string} file name.
   * @private
   */
  _getManualOutputFileName(filePath) {
    const fileName = path.parse(filePath).name;
    return `manual/${fileName}.html`;
  }
}
