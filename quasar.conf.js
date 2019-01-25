// Configuration for your app
const fs = require('fs')

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons' // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
        // workaround of iconv-lite's dynamic requiring problem
        // see https://github.com/ashtuchkin/iconv-lite/issues/204
        cfg.module.rules.push({
          test: /node_modules[/\\](iconv-lite)[/\\].+/,
          resolve: {
            aliasFields: ['main']
          }
        })
        cfg.module.rules.push({
          test: /\.txt$/,
          use: {
            loader: 'raw-loader'
          }
        })
        // the following config is needed to use pdfjs in dev mode, but it
        // will cause a blank window in built app.
        // Since now we know that pdfjs works now, these lines are not needed
        // in dev mode.
        if (ctx.dev) {
          console.log('developing')
          cfg.output = {
            globalObject: 'this'
          }
        }
        // fs.writeFileSync('/tmp/webpack.cfg', JSON.stringify(cfg, null, 2))
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QAlert',
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QModal',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QCheckbox',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QInput',
        'QField',
        'QTable',
        'QTr',
        'QTd',
        'QTh',
        'QBtnDropdown',
        'QSearch'
      ],
      directives: [
        // 'Ripple',
        'CloseOverlay'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Dialog'
      ]
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        console.log('webpack target is: ', cfg.target)
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration
        'copyright': 'Copyright © 2019 Zhenlei Jia',
        'productName': 'Word Frequency',
        'asar': true,
        appId: 'com.gmail.zhenlei.jia.word.freq.counter',
        'win': {
          'legalTrademarks': 'Copyright © 2019 Zhenlei Jia',
          'publisherName': 'Zhenlei Jia'
        }
      }
    }
  }
}
