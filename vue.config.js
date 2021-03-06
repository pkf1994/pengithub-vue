const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir)
}

  module.exports = {
    css: {
      sourceMap:true,
    },
    lintOnSave: false,
      chainWebpack: config => {
        config.module
          .rule('vue')
            .use('vue-loader')
              .tap(args => {
                args.compilerOptions.whitespace = 'preserve'
              })
      config.resolve.alias
      .set('@', resolve('src'))
    }
  }