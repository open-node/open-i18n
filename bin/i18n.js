#! /usr/bin/env node

var _           = require("underscore")
  , fs          = require("fs")
  , action = process.argv[2]
  , regxps = {
      eco: [
        /\@t\s(["'])([^\n]*?)\1.*/,
        2
      ],
      hbs: [
        /{{\s*t\s(["'])([^\n]*?)\1.*}}/,
        2
      ],
      es: [
        /error[\( ](['"])([^\n]*?)\1/i,
        2
      ]
    };

if (action !== 'write') action = 'read';

var pkg = require(process.cwd() + '/package.json');

if (pkg && pkg.openI18n && pkg.openI18n.regxps) regxps = pkg.openI18n.regxps;

var i18n = {
  read: function(argv) {
    var stdin       = ''
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function() {
      var chunk = process.stdin.read();
      if (chunk === null) return;
      stdin += chunk;
    });

    var read = function() {
      var files = stdin.trim().split('\n');
      var translations = {};
      var outPut = "";
      _.each(files, function(file) {
        var ext = file.split('.').pop();
        var lines = fs.readFileSync(file).toString().trim().split('\n');
        var reg = regxps[ext];
        if (!reg) return;
        _.each(lines, function(line, lineCounter) {
          var found = line.match(reg[0]);
          if (!found) return;
          var key = found[reg[1]];
          if (!key) return;
          if (!translations[key]) translations[key] = [];
          translations[key].push("#: " + file + ": " + (lineCounter + 1));
        });
      });


      // Write the POT file out of the _translation hash
      _.each(translations, function(value, key) {
        outPut += value.join('\n') + "\n";
        outPut += "msgid \"" + key.replace(/"/g, '\\"') + "\"\n";
        outPut += 'msgstr ""\n\n';
      });

      process.stdout.write(outPut);
    };

    process.stdin.on('end', read);
  },
  write: function(argv) {
    var po2json = function(str) {
      var translate = {};
      var regxp = /\nmsgid "([^\n]+)"\nmsgstr "([^\n]+)"/g;
      str.replace(regxp, function(txt, key, value) {
        translate[key] = value;
      });
      return JSON.stringify(translate, null, 2);
    };

    var write = function(poFile, lang) {
      var str = fs.readFileSync(poFile).toString();
      process.stdout.write(po2json(str));
    };

    write.apply(null, process.argv.slice(2));
  }
};

i18n[action](process.argv);
