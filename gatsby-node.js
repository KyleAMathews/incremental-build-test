const NUM_PAGES = parseInt(process.env.NUM_PAGES2 || 5000, 10)
console.log(NUM_PAGES, process.env)

let recreate = []
let firstRun = true

function makeString(length) {
  var result = ``
  var characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
  var charactersLength = characters.length
  for (var i = 0; i < characters.length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  const multiply = length / result.length
  let array = []
  for (let i = 0; i < multiply; i++) {
    array.push(result)
  }
  return array.join(``)
}

// Create NUM_PAGES nodes, split over NUM_TYPES types. Each node has
// the bare minimum of content
exports.sourceNodes = async ({
  getNode,
  actions: { createNode, touchNode },
}) => {
  // const Inspector = require(`inspector-api`)
  // const inspector = new Inspector({ storage: { type: `fs` } })

  // await inspector.profiler.enable()
  // await inspector.profiler.start()
  // await inspector.heap.enable()
  // await inspector.heap.startSampling()

  // Run some code
  if (!firstRun) {
    for (let i = 0; i < 10; i++) {
      recreate.push(Math.floor(Math.random() * NUM_PAGES))
    }
  }
  console.log({ firstRun, recreate })

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
        // Add a 100kb string (maybe)
        longstring: makeString(100000),
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

  console.log(process.memoryUsage())

  // await inspector.profiler.stop()
  // await inspector.heap.stopSampling()
  // process.exit()
}

const blankTemplate = require.resolve(`./src/templates/blank.js`)
exports.createPages = async ({ graphql, actions: { createPage } }) => {
  console.time(`query in createPages`)
  const result = await graphql(
    `
      {
        allBenchmark {
          nodes {
            id
          }
        }
      }
    `
  )
  console.timeEnd(`query in createPages`)
  result.data.allBenchmark.nodes.forEach((node) => {
    createPage({
      path: `/path/${node.id}/`,
      component: blankTemplate,
      context: {
        id: node.id,
      },
    })
  })
}
