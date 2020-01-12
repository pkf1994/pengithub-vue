

  module.exports = {
    lintOnSave: false,
    chainWebpack: config => {
      config.module
        .rule('vue')
          .use('vue-loader')
            .tap(args => {
              args.compilerOptions.whitespace = 'preserve'
            })
    }
  }