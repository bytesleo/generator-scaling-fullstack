const Generator = require('yeoman-generator');
module.exports = class extends Generator {

  initializing() {
    console.log('react 1');

  }

  prompting() {
    console.log(this.args);
    console.log('react - prompting');
  }
  writing() {
    console.log('react - writing');
  }
};
