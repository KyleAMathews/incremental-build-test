const NUM_PAGES = parseInt(process.env.NUM_PAGES2 || 5000, 10)
console.log(process.env)

const blankTemplate = require.resolve(`./src/templates/blank.js`)
exports.createPages = ({ actions: { createPage } }) => {
  for (let step = 0; step < NUM_PAGES; step++) {
    createPage({
      path: `/path/${step}/`,
      component: blankTemplate,
      context: {
        id: step,
      },
    })
  }
}
