const Generator = require('yeoman-generator');
module.exports = class extends Generator {
 
    prompting() {
    	console.log(this.args);
        console.log('prompting - turbod');
    }
    writing() {
        console.log('writing - turbo');
    }
};