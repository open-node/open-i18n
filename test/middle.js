var assert      = require('assert')
  , rest        = require('open-rest')
  , i18n        = require('../');

var LANGS = {
  hello: '你好',
  hello1: '你好, {0}',
  hello2: '你好, {0}, age: {1}',
  'Resource not found.': '找不到资源'
};

describe("i18n", function() {

  describe("middle-ware", function() {

    it('headers accept-language', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'zh';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {},
        user: {
          id: 1,
          language: undefined
        },
        headers: {
          'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,es;q=0.2'
        }
      };

      var res = {
        send: function() {
        }
      };

      middle(req, res, function(error) {
        assert.equal(null, error);
        assert.equal('zh', req._locale);

        done();
      });

    });

    it('headers accept-language unexpection', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'en';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {},
        user: {
          id: 1,
          language: undefined
        },
        headers: {
          'accept-language': {}
        }
      };

      var res = {
        send: function() {
        }
      };

      middle(req, res, function(error) {
        assert.equal(null, error);
        assert.equal('en', req._locale);

        done();
      });

    });

    it('The priority of the calculation, params._locale has the highest priority', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'en';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {_locale: 'zh-tw'},
        user: {
          id: 1,
          language: 'en'
        },
        headers: {
          'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,es;q=0.2'
        }
      };

      var res = {
        send: function() {
        }
      };

      middle(req, res, function(error) {
        assert.equal(null, error);
        assert.equal('zh-tw', req._locale);

        done();
      });

    });

    it('The priority of the calculation, user.language has the second priority', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'en';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {},
        user: {
          id: 1,
          language: 'en'
        },
        headers: {
          'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,es;q=0.2'
        }
      };

      var res = {
        send: function() {
        }
      };

      middle(req, res, function(error) {
        assert.equal(null, error);
        assert.equal('en', req._locale);

        done();
      });

    });

    it('Error handle, send arguments.length is 0', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'en';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {_locale: 'zh'},
        user: {
          id: 1,
          language: 'en'
        },
        headers: {
          'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,es;q=0.2'
        }
      };

      var res = {
        send: function() {
          assert.ok(true);
        }
      };

      middle(req, res, function(error) {
        assert.equal(null, error);
        assert.equal('zh', req._locale);

        res.send()

        done();
      });

    });

    it('Error handle, send arguments code is a number', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'en';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {_locale: 'zh'},
        user: {
          id: 1,
          language: 'en'
        },
        headers: {
          'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,es;q=0.2'
        }
      };

      var res = {
        send: function(code, body, headers) {
          assert.equal(403, code);
          assert.deepEqual({
            code: 'ResourceNotFound',
            message: '找不到资源'
          }, body.body);
        }
      };

      middle(req, res, function(error) {
        assert.equal(null, error);
        assert.equal('zh', req._locale);

        res.send(403, rest.errors.notFound());

        done();
      });

    });

    it('Error handle, send arguments code isnt a number', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'en';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {_locale: 'zh'},
        user: {
          id: 1,
          language: 'en'
        },
        headers: {
          'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,es;q=0.2'
        }
      };

      var res = {
        send: function(body, headers) {
          assert.deepEqual({
            code: 'ResourceNotFound',
            message: '找不到资源'
          }, body.body);
        }
      };

      middle(req, res, function(error) {
        assert.equal(null, error);
        assert.equal('zh', req._locale);

        res.send(rest.errors.notFound());

        done();
      });

    });

    it('Error handle, send arguments body isnt a error', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'en';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {_locale: 'zh'},
        user: {
          id: 1,
          language: 'en'
        },
        headers: {
          'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,es;q=0.2'
        }
      };

      var data = {
        name: 'Redstone',
        age: 36
      };

      var res = {
        send: function(body, headers) {
          assert.deepEqual({
            name: 'Redstone',
            age: 36
          }, body);
        }
      };

      middle(req, res, function(error) {
        assert.equal(null, error);
        assert.equal('zh', req._locale);

        res.send(data);

        done();
      });

    });

    it('Error handle, send arguments body.body is empty', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'en';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {_locale: 'zh'},
        user: {
          id: 1,
          language: 'en'
        },
        headers: {
          'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,es;q=0.2'
        }
      };

      var data = {
        name: 'Redstone',
        age: 36
      };

      var res = {
        send: function(body, headers) {
          assert.equal(null, body.body);
        }
      };

      middle(req, res, function(error) {
        var err = rest.errors.notFound();
        err.body = null
        assert.equal(null, error);
        assert.equal('zh', req._locale);

        res.send(err);

        done();
      });

    });

    it('Error handle, send arguments body.body.message is an array', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'en';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {_locale: 'zh'},
        user: {
          id: 1,
          language: 'en'
        },
        headers: {
          'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,es;q=0.2'
        }
      };

      var data = {
        name: 'Redstone',
        age: 36
      };

      var res = {
        send: function(body, headers) {
          assert.deepEqual({
            code: 'ResourceNotFound',
            message: [{
              message: '你好, open-node',
              value: ['open-node']
            }]
          }, body.body);
        }
      };

      middle(req, res, function(error) {
        var err = rest.errors.notFound();
        err.body.message = [{
          message: 'hello1',
          value: ['open-node']
        }]
        assert.equal(null, error);
        assert.equal('zh', req._locale);

        res.send(err);

        done();
      });

    });

    it('Error handle, send arguments body.body.message isnt a string', function(done) {

      var languages = ['zh', 'en', 'zh-tw'];
      var defaultLanguage = 'en';

      var middle = i18n.middleWare(languages, defaultLanguage, {zh: LANGS});

      var req = {
        params: {_locale: 'zh'},
        user: {
          id: 1,
          language: 'en'
        },
        headers: {
          'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,es;q=0.2'
        }
      };

      var data = {
        name: 'Redstone',
        age: 36
      };

      var res = {
        send: function(body, headers) {
          assert.deepEqual({
            code: 'ResourceNotFound',
            message: {
              message: 'hello1',
              value: ['open-node']
            }
          }, body.body);
        }
      };

      middle(req, res, function(error) {
        var err = rest.errors.notFound();
        err.body.message = {
          message: 'hello1',
          value: ['open-node']
        }
        assert.equal(null, error);
        assert.equal('zh', req._locale);

        res.send(err);

        done();
      });

    });
  });

});


