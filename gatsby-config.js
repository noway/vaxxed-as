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
        icon: "src/images/icon.png"
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
  ]
};
