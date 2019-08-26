const normalTpl = require('./normal')

module.exports = {
  htmlTpl: normalTpl,
  ejsTpl: require('./ejs'),
  pugTpl: require('./pug')
}