'use strict';
var yeoman = require('yeoman-generator')
var chalk = require('chalk')

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async()

    // Have Yeoman greet the user.
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
        name: 'features',
        message: 'Which features would you like to use?',
        choices: [
          { value: 'oneToOne', name: 'One to one mapping', checked: false },
          { value: 'circleCi', name: 'CircleCI integration', checked: true },
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

      var optionMap = {
        author: this.props.author,
        oneToOne: this.props.oneToOne,
        ghUsername: this.props.ghUsername,
        deps: deps,
        features: features
      }

      this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'))
      this.fs.copy(this.templatePath('.npmignore'), this.destinationPath('.npmignore'))

      if (features.circleCi)
        this.fs.copy(this.templatePath('circle.yml'), this.destinationPath('circle.yml'))

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
