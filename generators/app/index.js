'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag
    }
    prompting() {

    	this.log(yosay(
      		'Welcome to ' + chalk.cyan('NODETOMIC') + ' generator!'
    	));

        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Your project name',
            store: true,
            default: this.appname // Default to current folder name
        }, {
            type: 'confirm',
            name: 'cool',
            store: true,
            message: 'Would you like to enable the Cool feature?'
        }]).then((answers) => {
            this.log('app name', answers.name);
            this.log('cool feature', answers.cool);
            this.props = answers;
        });
    }
    writing() {
        //console.log('->', this.props);
        // console.log('->', this);
        this.fs.copy(this.templatePath('package.json'), this.destinationPath('package.json'))
        this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
        this.fs.copy(this.templatePath('dummyfile.txt'), this.destinationPath('dummyfile.txt'));
        this.fs.copyTpl(this.templatePath('example.js'), this.destinationPath('server/sf.js'), {
            title: 'Templating with Yeoman'
        });

  

    }

    initializing() {


        let options = {arguments: this.arguments};

        this.composeWith('nodetomic:turbo', {
            options: options
        }, {
            local: require.resolve('../turbo')
        }); 

        this.composeWith('nodetomic:server', {
            options: options
        }, {
            local: require.resolve('../server')
        });

    }
    install() {
        this.installDependencies({
            npm: true,
            bower: false,
            yarn: false
        });
    }
};