module.exports = {
  siteMetadata: {
    siteUrl: "https://vaxxed.as",
    title: "Vaxxed As"
  },
  flags: {
    DEV_SSR: true,
    FAST_DEV: true,
    PARALLEL_SOURCING: false,
    PRESERVE_FILE_DOWNLOAD_CACHE: false,
    PARALLEL_QUERY_RUNNING: false
  },
  plugins: [
    {
      resolve: "gatsby-plugin-loadable-components-ssr",
      options: {
        useHydrate: true
      }
    },
    "gatsby-plugin-postcss",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        background_color: "rgb(55, 65, 81)",
        cache_busting_mode: "none",
        description: "Scan your NZ COVID pass",
        dir: "ltr",
        display: "standalone",
        icon: "src/images/icon.svg",
        lang: "en",
        legacy: true,
        name: "Vaxxed As!",
        short_name: "vaxxed as",
        start_url: "/",
        theme_color: "rgb(55, 65, 81)",
        localize: [
          {
            start_url: "/es/",
            lang: "zh-Hans-CN",
            name: "Vaxxed As!",
            short_name: "vaxxed as",
            description: "Escanee su NZ COVID pass"
          }
        ],
        icon_options: {
          purpose: "any maskable"
        }
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "locale",
        path: `${__dirname}/locales`
      }
    },
    {
      resolve: "gatsby-plugin-react-i18next",
      options: {
        defaultLanguage: "en",
        generateDefaultLanguagePage: false,
        languages: ["en", "es"],
        redirect: true,
        siteUrl: "https://vaxxed.as",
        i18nextOptions: {
          lowerCaseLng: true,
          saveMissing: false,
          interpolation: {
            escapeValue: false
          },
          keySeparator: ".",
          nsSeparator: false
        }
      }
    },
    "gatsby-plugin-workerize-loader",
    "gatsby-plugin-use-query-params",
    "gatsby-plugin-robots-txt",
    "gatsby-plugin-offline"
    // ,{
    //   resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
    //   options: {
    //     analyzerMode: "static",
    //     generateStatsFile: true,
    //     openAnalyzer: true
    //   }
    // }
  ]
};
