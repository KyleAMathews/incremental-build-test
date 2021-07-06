const NUM_PAGES = parseInt(process.env.NUM_PAGES2 || 5000, 10)
console.log(NUM_PAGES, process.env)

let recreate = []
let firstRun = true

// Create NUM_PAGES nodes, split over NUM_TYPES types. Each node has
// the bare minimum of content
exports.sourceNodes = ({ getNode, actions: { createNode, touchNode } }) => {
  if (!firstRun) {
    for (let i = 0; i < 10; i++) {
      recreate.push(Math.floor(Math.random() * NUM_PAGES))
    }
  }
  console.log({firstRun, recreate})

  for (let i = 0; i < NUM_PAGES; i++) {
    // If run before, pick subset of 10 nodes to recreate and touch the rest.
    if (firstRun || recreate.includes(i)) {
      const content = Math.random()
      const id = i.toString()
      const node = {
        id,
        random: content,
        parent: null,
        children: [],
        internal: {
          type: `Benchmark`,
          contentDigest: content.toString(),
        },
      }

      createNode(node)
    } else {
      touchNode(getNode(i.toString()))
    }
  }

  firstRun = false
  recreate = []
}


const blankTemplate = require.resolve(`./src/templates/blank.js`)
exports.createPages = ({ actions: { createPage } }) => {
  for (let step = 0; step < NUM_PAGES; step++) {
    createPage({
      path: `/path/${step}/`,
      component: blankTemplate,
      context: {
        id: step.toString(),
      },
    })
  }
}
