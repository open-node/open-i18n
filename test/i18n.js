var assert      = require('assert')
  , i18n        = require('../');

var LANGS = {
  hello: '你好',
  hello1: '你好, {0}',
  hello2: '你好, {0}, age: {1}'
};

describe("i18n", function() {

  describe("t", function() {

    var t = i18n(LANGS).t;

    it('translate', function(done) {

      assert.equal('你好', t('hello'), 'normal');
      assert.equal('你好, Redstone', t('hello1', 'Redstone'), 'two arguments');
      assert.equal('你好, Redstone, age: 36', t('hello2', 'Redstone', 36), 'three arguments');
      assert.equal('你好, Redstone, age: 36', t('hello2', ['Redstone', 36]), 'Second arguments is array');
      assert.equal(undefined, t(''), 'key is empty string');
      assert.equal(undefined, t(undefined), 'key is undefined');
      assert.equal(undefined, t(null), 'key is null');
      assert.equal(undefined, t(0), 'key is number 0');
      assert.equal('你好, Redstone, age: 36', t('你好, {0}, age: {1}', ['Redstone', 36]), 'key non-exists');

      done();
    });

  });

});

