const top = require('process-top')()

setInterval(function () {
  // Prints out a string containing stats about your Node.js process.
  console.log(top.toString())
}, 1000)

module.exports = {
  flags: {
    PARALLEL_QUERY_RUNNING: true,
    LMDB_STORE: true,
  },
  siteMetadata: {
    title: `Gatsby Benchmark Create Pages`,
    description: `The createPages benchmark`,
    author: `@gatsbyjs`,
  },
  plugins: [`gatsby-plugin-gatsby-cloud`],
}
