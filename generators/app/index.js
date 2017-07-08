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

    this.log(yosay(
      `Welcome to ${chalk.greenBright('SCALING-FULLSTACK')} generator!`
    ));

    return this.prompt([{
        type: 'input',
        name: 'name',
        message: 'Your project name',
        store: true,
        default: this.appname // Default to current folder name
      }, {
        type: "list",
        name: "stack",
        message: "Which stack do you want?",
        choices: ["fullstack", "client", "server"],
        default: 0
      }, {
        type: "list",
        name: "client",
        message: "Which Client do you want?",
        choices: [{
          name: 'ReactJS (ARC)',
          value: 'react'
        }, {
          name: 'VueJS',
          value: 'vuejs'
        }, {
          name: 'Angular (CLI',
          value: 'angular'
        }],
        default: 0,
        when: (answersHash) => {
          return answersHash.stack !== "server";
        }
      }, {
        type: "input",
        name: "clientPortDev",
        message: 'Port to run the Client? (Development)',
        default: 3000,
        when: (answersHash) => {
          return answersHash.stack !== "server";
        }
      }, {
        type: "list",
        name: "db",
        message: "Which Datadase do you want?",
        choices: ["Mongoose"],
        default: 0,
        when: (answersHash) => {
          return answersHash.stack !== "client";
        }
      }, {
        type: 'confirm',
        name: 'auth',
        message: 'Do you want to use authentication?',
        default: 'Y',
        when: (answersHash) => {
          return answersHash.stack !== "client";
        }
      }, {
        type: 'confirm',
        name: 'multipleDevices',
        message: 'Want multiple login? (If you only want one device at the time select N)',
        default: 'Y',
        when: (answersHash) => {
          return answersHash.stack !== "auth";
        }
      }, {
        type: "checkbox",
        name: "authList",
        message: "Select the ones you want to integrate:",
        choices: [{
          name: 'Local',
          checked: true,
          value: 'local'
        }, {
          name: 'Google',
          checked: true,
          value: 'google'
        }, {
          name: 'Facebook',
          checked: true,
          value: 'facebook'
        }, {
          name: 'Twitter',
          checked: true,
          value: 'twitter'
        }, {
          name: 'Github',
          checked: false,
          value: 'github'
        }, {
          name: 'Bitbucket',
          checked: false,
          value: 'bitbucket'
        }],
        when: (answersHash) => {
          return answersHash.auth;
        }
      }, {
        type: "input",
        name: "serverPortDev",
        message: 'Port to run the Server? (Development)',
        default: 8000,
        when: (answersHash) => {
          return answersHash.stack !== "client";
        },
        validate: (answer, answersHash) => {
          if (answer == answersHash.clientPortDev) {
            return "Select a different port than the Client";
          }
          return true;
        }
      }, {
        type: "input",
        name: "serverPortPro",
        message: 'Port to run Server + Client? (Production)',
        default: 9000,
        when: (answersHash) => {
          return answersHash.stack !== "client";
        },
        validate: (answer, answersHash) => {
          if (answer == answersHash.clientPortDev) {
            return "Select a different port than the Client";
          }
          return true;
        }
      }

    ]).then((answers) => {
      this.log('app', answers.name, 'has been created!');
      //this.log('cool feature', answers.cool);
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

    console.log('->', this.props);

    return;
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
