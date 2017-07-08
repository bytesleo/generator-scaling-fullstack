const Generator = require('yeoman-generator');
module.exports = class extends Generator {

  initializing() {
    // console.log('server 1');
  }

  prompting() {
    // console.log(this.args);
    // console.log('server - prompting');
  }
  writing() {
    // console.log('server - writing');
  }
};
