'use strict';

import angular from 'angular';

/**
 * The Util service is for thin, globally reusable, utility functions
 */
export function UtilService($window) {
  'ngInject';

 /* var charmap = {
    ' ': ' ',
    '¡': '!',
    '¢': 'c',
    '£': 'lb',
    '¥': 'yen',
    '¦': '|',
    '§': 'SS',
    '¨': '\"',
    '©': '(c)',
    'ª': 'a',
    '«': '<<',
    '¬': 'not',
    '­': '-',
    '®': '(R)',
    '°': '^0',
    '±': '+/-',
    '²': '^2',
    '³': '^3',
    '´': "'",
    'µ': 'u',
    '¶': 'P',
    '·': '.',
    '¸': ',',
    '¹': '^1',
    'º': 'o',
    '»': '>>',
    '¼': ' 1/4 ',
    '½': ' 1/2 ',
    '¾': ' 3/4 ',
    '¿': '?',
    'À': '`A',
    'Á': "'A",
    'Â': '^A',
    'Ã': '~A',
    'Ä': '"A',
    'Å': 'A',
    'Æ': 'AE',
    'Ç': 'C',
    'È': '`E',
    'É': "'E",
    'Ê': '^E',
    'Ë': '"E',
    'Ì': '`I',
    'Í': "'I",
    'Î': '^I',
    'Ï': '"I',
    'Ð': 'D',
    'Ñ': '~N',
    'Ò': '`O',
    'Ó': "'O",
    'Ô': '^O',
    'Õ': '~O',
    'Ö': '"O',
    '×': 'x',
    'Ø': "O",
    'Ù': "`U",
    'Ú': "'U",
    'Û': "^U",
    'Ü': '"U',
    'Ý': "'Y",
    'Þ': "Th",
    'ß': "ss",
    'à': "`a",
    'á': "'a",
    'â': "^a",
    'ã': "~a",
    'ä': '"a',
    'å': "a",
    'æ': "ae",
    'ç': "c",
    'è': "`e",
    'é': "'e",
    'ê': "^e",
    'ë': '"e',
    'ì': "`i",
    'í': "'i",
    'î': "^i",
    'ï': '"i',
    'ð': "d",
    'ñ': "~n",
    'ò': "`o",
    'ó': "'o",
    'ô': "^o",
    'õ': "~o",
    'ö': '"o',
    '÷': ":",
    'ø': "o",
    'ù': "`u",
    'ú': "'u",
    'û': "^u",
    'ü': '"u',
    'ý': "'y",
    'þ': "th",
    'ÿ': '"y',
    'Ā': "A",
    'ā': "a",
    'Ă': "A",
    'ă': "a",
    'Ą': "A",
    'ą': "a",
    'Ć': "'C",
    'ć': "'c",
    'Ĉ': "^C",
    'ĉ': "^c",
    'Ċ': "C",
    'ċ': "c",
    'Č': "C",
    'č': "c",
    'Ď': "D",
    'ď': "d",
    'Đ': "D",
    'đ': "d",
    'Ē': "E",
    'ē': "e",
    'Ĕ': "E",
    'ĕ': "e",
    'Ė': "E",
    'ė': "e",
    'Ę': "E",
    'ę': "e",
    'Ě': "E",
    'ě': "e",
    'Ĝ': "^G",
    'ĝ': "^g",
    'Ğ': "G",
    'ğ': "g",
    'Ġ': "G",
    'ġ': "g",
    'Ģ': "G",
    'ģ': "g",
    'Ĥ': "^H",
    'ĥ': "^h",
    'Ħ': "H",
    'ħ': "h",
    'Ĩ': "~I",
    'ĩ': "~i",
    'Ī': "I",
    'ī': "i",
    'Ĭ': "I",
    'ĭ': "i",
    'Į': "I",
    'į': "i",
    'İ': "I",
    'ı': "i",
    'Ĳ': "IJ",
    'ĳ': "ij",
    'Ĵ': "^J",
    'ĵ': "^j",
    'Ķ': "K",
    'ķ': "k",
    'Ĺ': "L",
    'ĺ': "l",
    'Ļ': "L",
    'ļ': "l",
    'Ľ': "L",
    'ľ': "l",
    'Ŀ': "L",
    'ŀ': "l",
    'Ł': "L",
    'ł': "l",
    'Ń': "'N",
    'ń': "'n",
    'Ņ': "N",
    'ņ': "n",
    'Ň': "N",
    'ň': "n",
    'ŉ': "'n",
    'Ō': "O",
    'ō': "o",
    'Ŏ': "O",
    'ŏ': "o",
    'Ő': '"O',
    'ő': '"o',
    'Œ': "OE",
    'œ': "oe",
    'Ŕ': "'R",
    'ŕ': "'r",
    'Ŗ': "R",
    'ŗ': "r",
    'Ř': "R",
    'ř': "r",
    'Ś': "'S",
    'ś': "'s",
    'Ŝ': "^S",
    'ŝ': "^s",
    'Ş': "S",
    'ş': "s",
    'Š': "S",
    'š': "s",
    'Ţ': "T",
    'ţ': 't',
    'Ť': 'T',
    'ť': 't',
    'Ŧ': 'T',
    'ŧ': 't',
    'Ũ': '~U',
    'ũ': '~u',
    'Ū': 'U',
    'ū': 'u',
    'Ŭ': 'U',
    'ŭ': 'u',
    'Ů': 'U',
    'ů': 'u',
    'Ű': '"U',
    'ű': '"u',
    'Ų': 'U',
    'ų': 'u',
    'Ŵ': '^W',
    'ŵ': '^w',
    'Ŷ': '^Y',
    'ŷ': '^y',
    'Ÿ': '"Y',
    'Ź': "'Z",
    'ź': "'z",
    'Ż': 'Z',
    'ż': 'z',
    'Ž': 'Z',
    'ž': 'z',
    'ſ': 's'
  };*/


  var Util = {

    /*slugify(s) {
      if(!s) return "";
      var ascii = [];
      var ch;
      var cp;
      for(var i = 0; i < s.length; i++) {
        if((cp = s.charCodeAt(i)) < 0x180) {
          ch = String.fromCharCode(cp);
          ascii.push(charmap[ch] || ch);
        }
      }
      s = ascii.join('');
      s = s.replace(/[^\w\s-]/g, '').trim()
        .toLowerCase();
      return s.replace(/[-\s]+/g, '-');
    },*/
      /**
       * Return a callback or noop function
       *
       * @param  {Function|*} cb - a 'potential' function
       * @return {Function}
       */
    safeCb(cb) {
      return angular.isFunction(cb) ? cb : angular.noop;
    },
    /**
     * Parse a given url with the use of an anchor element
     *
     * @param  {String} url - the url to parse
     * @return {Object}     - the parsed url, anchor element
     */
    urlParse(url) {
      var a = document.createElement('a');
      a.href = url;

      // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
      if(a.host === '') {
        a.href = a.href;
      }

      return a;
    },

    /**
     * Test whether or not a given url is same origin
     *
     * @param  {String}           url       - url to test
     * @param  {String|String[]}  [origins] - additional origins to test against
     * @return {Boolean}                    - true if url is same origin
     */
    isSameOrigin(url, origins) {
      url = Util.urlParse(url);
      origins = origins && [].concat(origins) || [];
      origins = origins.map(Util.urlParse);
      origins.push($window.location);
      origins = origins.filter(function(o) {
        let hostnameCheck = url.hostname === o.hostname;
        let protocolCheck = url.protocol === o.protocol;
        // 2nd part of the special treatment for IE fix (see above):
        // This part is when using well-known ports 80 or 443 with IE,
        // when $window.location.port==='' instead of the real port number.
        // Probably the same cause as this IE bug: https://goo.gl/J9hRta
        let portCheck = url.port === o.port || o.port === '' && (url.port === '80' || url.port ===
          '443');
        return hostnameCheck && protocolCheck && portCheck;
      });
      return origins.length >= 1;
    }
  };

  return Util;
}
