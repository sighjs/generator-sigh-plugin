var glob, babel, write, pipeline, merge, mocha

module.exports = function(pipelines) {
  var babelOpts = {
    presets: ['es2015-loose', 'stage-1'],
    plugins: ['transform-es2015-modules-commonjs'],
  }

  pipelines['source:js'] = [
    glob({ basePath: 'src' }, '*.js'),
    babel(babelOpts),
    write({ clobber: '!(test)' }, 'lib')
  ]

  pipelines['test:js'] = [
    glob({ basePath: 'src/test' }, '*.js', 'plugin/*.js'),
    babel(babelOpts),
    write({ clobber: true }, 'lib/test')
  ]

  pipelines.alias.build = ['test:js', 'source:js']

  pipelines['tests:run'] = [
    merge(
      pipeline('source:js'),
      pipeline('test:js'),
      { collectInitial: true }
    ),
    pipeline({ activate: true }, 'mocha')
  ]

  pipelines.explicit.mocha = [ mocha({ files: 'lib/test/**/*.spec.js' }) ]
}
