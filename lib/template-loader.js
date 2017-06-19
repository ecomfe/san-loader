var cons = require('consolidate')
var MarkdownIt = require('markdown-it')
var loaderUtils = require('loader-utils')
var extname = require('path').extname

module.exports = function (content) {

  this.cacheable && this.cacheable()

  var callback = this.async()
  var opt = loaderUtils.getOptions(this) || {}

  function exportContent (content) {
    if (opt.raw) {
      callback(null, content)
    } else {
      callback(null, 'module.exports = ' + JSON.stringify(content))
    }
  }

  // with no engine given, use the file extension as engine
  if (!opt.engine) {
    opt.engine = extname(this.request).substr(1).toLowerCase()
  }

  if (!cons[opt.engine] && opt.engine !== 'markdown' && opt.engine !== 'md') {
    return callback(new Error(
      'Template engine \'' + opt.engine + '\' ' +
      'isn\'t available in Consolidate.js'
    ))
  }

  // for relative includes
  opt.filename = this.resourcePath

  switch (opt.engine) {
    case 'md':
    case 'markdown':
      var md = new MarkdownIt()
      exportContent('<div>' + md.render(content) + '</div>')
      break
    default:
      cons[opt.engine].render(content, opt, function (err, html) {
        if (err) {
          callback(err)
        } else {
          exportContent(html)
        }
      })
  }
}
