# open-i18n
=================

[![Build status](https://api.travis-ci.org/open-node/open-i18n.svg?branch=master)](https://travis-ci.org/open-node/open-i18n)
[![codecov](https://codecov.io/gh/open-node/open-i18n/branch/master/graph/badge.svg)](https://codecov.io/gh/open-node/open-i18n)

## Quick start
<pre>npm install open-i18n --save</pre>

## Usage
```js
var i18n = require('i18n');

// languages System allow language
// locale Current request use lanuage
// language packages,
/*
  {
    "zh": {
      "hello world": "你好世界。"
    },
    "en": {
      "hello world": "Hello world."
    }
  }
 */
var t = i18n(languages, locale, LANGS).t;

t('hello world'); // return "你好世界"

// middle-ware auto handle res.body when request error
server.use(i18n.middleWare(languages, defaultLanguage, LANGS))
```

## Collect language items
<pre>
  find ./src/app -type f | node_modules/.bin/open-i18n read > bin/locale/application.pot
  msgmerge -UN --no-wrap ./bin/locale/en.po ./bin/locale/application.pot
  msgmerge -UN --no-wrap ./bin/locale/zh.po ./bin/locale/application.pot
</pre>

## Translate language items

Edit `en.po`, `zh.po` to translate.

## Make language package
<pre>
  node_modules/.bin/open-i18n write ./bin/locale/zh.po zh > locale/zh.json
</pre>
