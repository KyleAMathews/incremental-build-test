let NUM_PAGES = parseInt(process.env.NUM_PAGES2 || 5000, 10);

let recreate = [];
let toDelete = [];
let firstRun = true;

// Create NUM_PAGES nodes, split over NUM_TYPES types. Each node has
// the bare minimum of content
exports.sourceNodes = ({
  getNode,
  actions: { createNode, touchNode, deleteNode, createRedirect },
}) => {
  for (let i = 0; i < NUM_PAGES; i++) {
    createRedirect({ fromPath: `/old-url${i}`, toPath: `/new-url${i}`, isPermanent: true })
  }
  
  if (!firstRun) {
    // Site keeps growing!
    NUM_PAGES += 1;
    // Create the new page.
    recreate.push(NUM_PAGES - 1);

    for (let i = 0; i < 3; i++) {
      toDelete.push(Math.floor(Math.random() * NUM_PAGES));
    }

    for (let i = 0; i < 3; i++) {
      recreate.push(Math.floor(Math.random() * NUM_PAGES));
    }
    // Always recreate the 0 page.
    recreate.push(0);
  }
  console.log({ firstRun, recreate, toDelete });

  for (let i = 0; i < NUM_PAGES; i++) {
    if (toDelete.includes(i)) {
      const node = getNode(i.toString());
      if (node) {
        deleteNode(node);
      }
    }

    // If run before, pick subset of 10 nodes to recreate and touch the rest.
    if (firstRun || recreate.includes(i)) {
      const content = Math.random();
      const id = i.toString();
      const node = {
        id,
        random: content,
        parent: null,
        children: [],
        internal: {
          type: `Benchmark`,
          contentDigest: content.toString(),
        },
      };

      createNode(node);
    } else {
      if (firstRun) {
        touchNode(getNode(i.toString()));
      }
    }
  }

  firstRun = false;
  recreate = [];
  toDelete = [];
};

const blankTemplate = require.resolve(`./src/templates/blank.js`);
exports.createPages = async ({ graphql, actions: { createPage } }) => {
  console.time(`query in createPages`);
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
  );
  console.timeEnd(`query in createPages`);
  result.data.allBenchmark.nodes.forEach((node) => {
    createPage({
      path: `/path/${node.id}/`,
      component: blankTemplate,
      context: {
        id: node.id,
      },
    });
  });

  createPage({
    path: `/always-changing/`,
    component: blankTemplate,
    context: {
      random: Math.random()
    },
  });
};
