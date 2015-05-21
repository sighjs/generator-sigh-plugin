'use strict';
var yeoman = require('yeoman-generator')
var chalk = require('chalk')

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async()

    this.log(chalk.red('sigh plugin') + ' generator')

    var prompts = [
      {
        type: 'input',
        name: 'ghUsername',
        message: 'What\'s your github username?',
        store: true,
        default: 'unknown-user'
      },
      {
        type: 'input',
        name: 'author',
        message: 'What\'s your github author?',
        default: 'Unknown <invalid@email.com>',
        store: true
      },
      {
        type: 'input',
        name: 'name',
        message: 'What\'s the name of your sigh plugin (should begin with "sigh ")?',
        default: this.appname,
      },
      {
        type: 'checkbox',
        name: 'options',
        message: 'Please describe how your plugin will work:',
        choices: [
          { value: 'oneToOne', name: 'Maps input files to output files 1:1', checked: false },
        ]
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Which features would you like to use?',
        choices: [
          { value: 'circleCi', name: 'CircleCI integration', checked: false },
          { value: 'travisCi', name: 'TravisCI integration', checked: false },
        ]
      }
    ]

    this.prompt(prompts, function (props) {
      this.props = props

      var depChoices = [
        { value: 'bluebird', checked: true },
        { value: 'lodash', checked: true },
      ]

      // sigh-core option is forced on when one-to-one mapping so don't bother
      // offering the choice
      if (props.features.indexOf('oneToOne') === -1)
        depChoices.push({ value: 'sigh-core', checked: true })

      this.prompt([{
        type: 'checkbox',
        name: 'dependencies',
        message: 'Which dependencies do you need?',
        choices: depChoices
      }], function(depProps) {
        props.dependencies = depProps.dependencies

        if (props.features.indexOf('oneToOne') !== -1)
          props.dependencies.push('sigh-core')

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

      var optionMap = {
        author: this.props.author,
        oneToOne: this.props.oneToOne,
        ghUsername: this.props.ghUsername,
        deps: deps,
        features: features,
        options: options
      }

      this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'))
      this.fs.copy(this.templatePath('.npmignore'), this.destinationPath('.npmignore'))

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
      'babel',
      'chai',
      'mocha',
      'sigh',
      'sigh-babel',
      'sigh-cli',
      'sigh-mocha',
      'source-map-support',
    ]
    if (this.props.dependencies.indexOf('sigh-core') === -1)
      devDeps.push('sigh-core')

    this.npmInstall(devDeps, { saveDev: true })
  }
})
