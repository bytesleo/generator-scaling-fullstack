const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');


module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }
  prompting() {

    this.log(yosay('Welcome to ' + chalk.green('SCALING-FULLSTACK') +
      ' generator!'));

    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      store: true,
      default: this.appname // Default to current folder name
    }, {
      type: 'input',
      name: 'description',
      message: 'Description project',
      store: true
    }, {
      type: 'confirm',
      name: 'cool',
      store: true,
      message: 'Would you like to enable the Cool feature?'
    }]).then((answers) => {
      this.log('app', answers.name, 'has been created!');
      this.log('cool feature', answers.cool);
      this.props = answers;
    });
  }

  configuring() {
    //Readme
    // this.fs.copy(this.templatePath('server/README.md'), this.destinationPath(
    //   'README.md'));
    //package.json

    // this.fs.copyTpl(this.templatePath('server/package.json'), this.destinationPath(
    //   'server/package.json'), {
    //   name: this.props.name,
    //   description: this.props.description,
    // });

  }

  writing() {

    //console.log('->', this.props);

    //<----------Server---------->

    this.fs.copy(
      this.templatePath('server/**/*'),
      this.destinationPath('server')
    );

    this.fs.copyTpl(this.templatePath('server/package.json'), this.destinationPath(
      'server/package.json'), {
      name: this.props.name,
      description: this.props.description,
    });

    this.fs.copyTpl(this.templatePath('server/src/config'), this.destinationPath(
      'server/src/config'), {
      name: this.props.name
    });

    this.fs.copy(
      this.templatePath('server/.*'),
      this.destinationPath('server')
    );

    //<----------React---------->

    this.fs.copy(
      this.templatePath('react/**/*'),
      this.destinationPath('react')
    );

    // React Copy all dotfiles
    this.fs.copy(
      this.templatePath('react/.*'),
      this.destinationPath('react')
    );

  }

  initializing() {

    let options = {
      arguments: this.arguments
    };

    //<----------Server---------->

    this.composeWith('scaling-fullstack:server', {
      options: options
    }, {
      local: require.resolve('../server')
    });

    //<----------React---------->

    this.composeWith('scaling-fullstack:react', {
      options: options
    }, {
      local: require.resolve('../react')
    });


  }

  _private_method(param) {


  }

  install() {
    // let npmdir = process.cwd() + '/server';
    if (!this.options['skip-install']) {
      //<----------Server---------->
      process.chdir(`${this.destinationRoot()}/server`);
      this.installDependencies({
        npm: true,
        bower: false,
        yarn: false,
        callback: () => {
          console.log(`npm Server is installed!`);
          //<----------React---------->
          process.chdir(`${this.destinationRoot()}/react`);
          this.installDependencies({
            npm: true,
            bower: false,
            yarn: false,
            callback: () => {
              console.log(`npm React is installed!`);
            }
          });
          //<----------Vue---------->
          //<----------Angular---------->
        }
      });
    }
  }


  end() {
    console.log('END');
  }

};
