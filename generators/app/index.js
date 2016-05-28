'use strict';
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var camelize = require('camelize')

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async()

    this.log(chalk.red('sigh plugin') + ' generator')

    var prompts = [
      {
        type: 'input',
        name: 'pluginName',
        message: 'What is the name of this plugin?',
        default: this.appname.replace(/^sigh /, ''),
      },
      {
        type: 'input',
        name: 'ghUsername',
        message: 'Which github username/organisation should own this plugin?',
        store: true,
        default: 'unknown-user'
      },
      {
        type: 'input',
        name: 'author',
        message: 'What\'s your github author?',
        default: 'Anonymous <not.a.real@email.com>',
        store: true
      },
      {
        type: 'checkbox',
        name: 'options',
        message: 'Which of the following apply to your plugin?',
        choices: [
          { value: 'oneToOne', name: 'Maps input files to output files 1:1', checked: false },
          { value: 'multiCpu', name: 'Spreads work over multiple CPUs', checked: false },
        ]
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which features would you like to use?',
        choices: [
          { value: 'circleCi', name: 'CircleCI integration', checked: false },
          { value: 'travisCi', name: 'TravisCI integration', checked: false },
        ],
        store: true
      }
    ]

    this.prompt(prompts, function (props) {
      this.props = props

      var depChoices = [
        { value: 'bluebird', checked: true },
      ]

      // next two options can be forced "on" depending on options
      if (props.options.indexOf('oneToOne') === -1)
        depChoices.push({ value: 'sigh-core', checked: true })

      if (props.options.indexOf('multiCpu') === -1)
        depChoices.push({ value: 'lodash', checked: true })

      this.prompt([{
        type: 'checkbox',
        name: 'dependencies',
        message: 'Which dependencies do you need?',
        choices: depChoices
      }], function(depProps) {
        props.dependencies = depProps.dependencies

        if (props.options.indexOf('oneToOne') !== -1)
          props.dependencies.push('sigh-core')

        if (props.options.indexOf('multiCpu') !== -1)
          props.dependencies.push('lodash')

        done()
      })

    }.bind(this))
  },

  writing: {
    app: function () {
      var hashArray = function(array) {
        var obj = {}
        array.forEach(function(val) { obj[val] = true })
        return obj
      }

      var deps = hashArray(this.props.dependencies)
      var features = hashArray(this.props.features)
      var options = hashArray(this.props.options)

      var pluginName = this.props.pluginName.replace(/ /g, '-')

      var optionMap = {
        author: this.props.author,
        oneToOne: this.props.oneToOne,
        ghUsername: this.props.ghUsername,
        pluginName: pluginName,
        pluginNameCamelized: camelize(pluginName),
        deps: deps,
        features: features,
        options: options,
      }

      this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'))
      this.fs.copy(this.templatePath('_npmignore'), this.destinationPath('.npmignore'))

      if (features.circleCi)
        this.fs.copy(this.templatePath('circle.yml'), this.destinationPath('circle.yml'))

      if (features.travisCi)
        this.fs.copy(this.templatePath('_travis.yml'), this.destinationPath('.travis.yml'))

      var copy = function(file) {
        this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), optionMap)
      }.bind(this)

      copy('README.markdown')
      copy('package.json')
      copy('sigh.js')
      copy('src/index.js')
      copy('src/test/index.spec.js')
    },
  },

  install: function () {
    // return
    this.npmInstall(this.props.dependencies, { save: true })

    var devDeps = [
      'chai',
      'mocha',
      'sigh',
      'sigh-babel',
      'sigh-cli',
      'sigh-mocha',
      'source-map-support',
      'babel-core',
      'babel-plugin-transform-es2015-modules-commonjs',
      'babel-preset-es2015',
      'babel-preset-es2015-loose',
      'babel-preset-stage-1',
    ]
    if (this.props.dependencies.indexOf('sigh-core') === -1)
      devDeps.push('sigh-core')

    if (this.props.options.indexOf('multiCpu') !== -1)
      devDeps.push('process-pool')

    this.npmInstall(devDeps, { saveDev: true })
  }
})
