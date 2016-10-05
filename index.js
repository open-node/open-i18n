var _     = require('lodash');

/** 返回 i18n 对象 */
var i18n = function(langs) {
  return {
    /**
     * key "nihao {0}, Today is {1}"
     * i18n.t key, 'zhaoxiongfei', '星期三'
     */
    t: function(key) {
      var result, args;
      args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
      if (!key) return;
      /**
       * 参数如果只有两个的话，第二个就是要替换的数组
       * 之所以这么写是为了支持两种用啊
       * 1. i18n.t("Language key {0}, {1}", "Hello", "world")
       * 2. i18n.t("Language key {0}, {1}", ["Hello", "world"])
       */
      if ((arguments.length == 2) && Array.isArray(arguments[1])) {
        args = arguments[1];
      }
      result = langs[key] || key;
      if (!args.length) return result;
      return result.replace(/\{(\d+)\}/g, function(m, i) { return args[i] });
    }
  };
};

var locales = [
  ['params', '_locale'],
  ['user', 'language'],
  [
    'headers',
    'accept-language',
    (v) => {
      if (!_.isString(v)) return;
      v.split(';')[0].split(',')[1]
    }
  ]
];

i18n.middleWare = function (languages, defaultLanguage, LANGS) {

  var TT = {};
  _.each(languages, function(locale) {
    TT[locale] = i18n(LANGS[locale] || {}).t
  });

  return function (req, res, next) {
    req._locale = defaultLanguage;

    for (var x of locales) {
      var v = req[x[0]][x[1]];
      if (x[2]) v = x[2](v);
      if (languages.indexOf(v) < 0) continue;
      req._locale = v;
      break;
    }

    /** 改写默认的 res.send 为了处理 message */
    var send = res.send;
    res.send = function (code, body, headers) {
      var error, t, translate;
      if (!arguments.length) return send.apply(res, arguments);
      if (typeof code !== 'number') body = code;
      if (!(body instanceof Error)) return send.apply(res, arguments);
      error = body.body;
      if (!error) return send.apply(res, arguments);

      t = TT[req._locale];
      translate = (x) => {
        if (x.value != null) {
          return t(x.message, x.value.value || x.value);
        } else {
          return t(x.message);
        }
      };

      if (_.isArray(error.message)) {
        error.message = _.map(error.message, (x) => {
          x.message = translate(x);
          return x;
        });
      } else if (_.isString(error.message)) {
        error.message = translate(error);
      }

      return send.apply(res, arguments);
    };

    return next();
  };
};

module.exports = i18n;
