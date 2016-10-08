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

var currentLocale = function(req, languages) {
  var locale = req.params._locale || req.user.language;
  if (!locale && _.isString(req.headers['accept-language'])) {
    locale = req.headers['accept-language'].split(';')[0].split(',')[1];
  }
  return languages.indexOf(locale) > -1 && locale;
};

var translate = function(t, x) {
  if (x.value != null) {
    return t(x.message, x.value.value || x.value);
  } else {
    return t(x.message);
  }
};

i18n.middleWare = function (languages, defaultLanguage, LANGS) {

  var TT = {};
  _.each(languages, function(locale) {
    TT[locale] = i18n(LANGS[locale] || {}).t
  });

  return function (req, res, next) {
    req._locale = currentLocale(req, languages) || defaultLanguage;

    /** 改写默认的 res.send 为了处理 message */
    var send = res.send;
    res.send = function (code, body, headers) {
      var error, t;
      if (!arguments.length) return send.apply(res, arguments);
      if (typeof code !== 'number') body = code;
      if (!(body instanceof Error)) return send.apply(res, arguments);
      error = body.body;
      if (!error) return send.apply(res, arguments);

      t = TT[req._locale];
      if (_.isArray(error.message)) {
        error.message = _.map(error.message, function (x) {
          x.message = translate(t, x);
          return x;
        });
      } else if (_.isString(error.message)) {
        error.message = translate(t, error);
      }

      return send.apply(res, arguments);
    };

    return next();
  };
};

module.exports = i18n;
