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
        choices: [
          "fullstack", "client", "server"
        ],
        default: 0
      }, {
        type: "list",
        name: "client",
        message: "Which Client do you want?",
        choices: [{
          name: 'ReactJS (ARC)',
          value: 'react'
        }, {
          name: 'VueJS (Soon)',
          value: 'vue'
        }, {
          name: 'Angular (Soon)',
          value: 'angular'
        }],
        store: true,
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
          return answersHash.auth;
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

    let npm = {
      start: '',
      install: '',
      build: '',
      test: ''
    }

    //package.json
    if (this.props.stack != 'client') {
      npm.start += " 'cd server && npm start' ";
      npm.install += " 'cd server && npm i' ";
      npm.build += " 'cd server && npm run build' ";
      npm.test += " 'cd server && npm test' ";
    }

    if (this.props.stack != 'server') {
      switch (this.props.client) {
        case 'react':
          npm.start += " 'cd react && npm start' ";
          npm.install += " 'cd react && npm i' ";
          npm.build += " 'cd react && npm run build' ";
          break;
        case 'vue':
          npm.start += " 'cd vue && npm start' ";
          npm.install += " 'cd vue && npm i' ";
          npm.build += " 'cd vue && npm run build' ";
          break;
        case 'angular':
          npm.start += " 'cd angular && npm start' ";
          npm.install += " 'cd angular && npm i' ";
          npm.build += " 'cd angular && npm run build' ";
          break;
        default:
      }
    }

    this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath(
      'package.json'), {
      name: this.props.name,
      npm: npm
    });

  }

  writing() {

    // console.log('->', this.props);

    //<----------Server---------->

    if (this.props.stack != 'client') {

      this.fs.copy(
        this.templatePath('server/**/*'),
        this.destinationPath('server')
      );

      let optionsServer = {
        name: this.props.name,
        multipleDevices: this.props.multipleDevices || false,
        auth: {
          enabled: this.props.auth,
          local: this.props.auth && (this.props.authList.indexOf('local') > -1),
          google: this.props.auth && (this.props.authList.indexOf('google') > -1),
          facebook: this.props.auth && (this.props.authList.indexOf('facebook') > -1),
          twitter: this.props.auth && (this.props.authList.indexOf('twitter') > -1),
          github: this.props.auth && (this.props.authList.indexOf('github') > -1),
          bitbucket: this.props.auth && (this.props.authList.indexOf('bitbucket') > -1)
        },
        serverPortDev: this.props.serverPortDev,
        serverPortPro: this.props.serverPortPro,
        pathDistServerPro: `${this.props.client}`
      }

      this.fs.copyTpl(this.templatePath('server/**/*.js'), this.destinationPath(
        'server'), optionsServer);

      this.fs.copyTpl(this.templatePath('server/*'), this.destinationPath(
        'server'), optionsServer);

      this.fs.copy(this.templatePath('server/.*'), this.destinationPath(
        'server'));

    }


    //<----------Client---------->

    if (this.props.stack != 'server') {

      switch (this.props.client) {
        //<----------React---------->
        case 'react':

          this.fs.copy(this.templatePath('react/**/*'), this.destinationPath(
            'react'));

          let optionsReact = {
            name: this.props.name,
            client: `${this.props.client}`,
            clientPortDev: this.props.clientPortDev,
            pathDistClient: `../server/dist/${this.props.client}`
              // pathDistClient: `dist`
          }

          this.fs.copyTpl(this.templatePath('react/webpack.config.js'),
            this.destinationPath(
              'react/webpack.config.js'), optionsReact);

          this.fs.copyTpl(this.templatePath('react/package.json'), this.destinationPath(
            'react/package.json'), optionsReact);

          // React Copy all dotfiles
          this.fs.copy(this.templatePath('react/.*'), this.destinationPath(
            'react'));

          break;

          //<----------React---------->
        case 'vue':

          this.fs.copy(this.templatePath('vue/**/*'), this.destinationPath(
            'vue'));

          break;
          //<----------Angular---------->
        case 'angular':

          this.fs.copy(this.templatePath('angular/**/*'), this.destinationPath(
            'angular'));

          break;
        default:
      }

    }

  }

  initializing() {

    let options = {
      arguments: this.arguments,
      props: this.props,
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

    //<----------Vue---------->
    this.composeWith('scaling-fullstack:vue', {
      options: options
    }, {
      local: require.resolve('../vue')
    });

    //<----------Angular---------->
    this.composeWith('scaling-fullstack:angular', {
      options: options
    }, {
      local: require.resolve('../angular')
    });

  }

  // Private methods

  _private_server() {

    if (this.props.stack != 'client') {
      process.chdir(`${this.destinationRoot()}/server`);
      this.installDependencies({
        npm: true,
        bower: false,
        yarn: false,
        callback: () => {
          console.log(`npm Server is installed!`);
        }
      });
    }

  }

  _private_client() {

    process.chdir(`${this.destinationRoot()}/${this.props.client}`);
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false,
      callback: () => {
        console.log(`npm Client is installed!`);
        this._private_server();
      }
    });

  }

  install() {

    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false,
      callback: () => {
        // if (this.props.stack === 'server') {
        //this._private_server();
        // } else {
        //this._private_client();
        // }
      }
    });

  }

  end() {

    console.log(chalk.greenBright(
      '\n-----------\nSCALING-FULLSTACK SUCCESS!\n-----------\n'));
  }



};
