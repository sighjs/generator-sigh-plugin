'use strict';

var path = require('path')
var assert = require('yeoman-generator').assert
var helpers = require('yeoman-generator').test

describe('sigh template:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ dependencies: [ 'bluebird' ], features: [ 'circleCi' ] })
      .on('end', done)
  })

  it('creates files', function () {
    assert.file([
      'package.json', '.gitignore', '.npmignore', 'sigh.js', 'circle.yml',
      'src/index.js', 'src/test/index.spec.js',
    ])
  })
})
