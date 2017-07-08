const Generator = require('yeoman-generator');
module.exports = class extends Generator {

  initializing() {
    // console.log('Vue 1');
  }

  prompting() {
    // console.log(this.args);
    // console.log('Vue - prompting');
  }
  writing() {
    // console.log('Vue - writing');
  }
};
