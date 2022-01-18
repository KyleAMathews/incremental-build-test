const got = require(`got`)
const { parse } = require(`node-html-parser`)

let startTime = new Date().getTime()
let buildsCount = 0

async function getCount() {
  try {
    const response = await got(process.env.SERVE_URL)
    const root = parse(response.body)
    const selector = `#gatsby-focus-wrapper`

    const value = parseInt(root.querySelector(selector)?.rawText, 10)
    return value
  } catch (error) {
    return
  }
}

async function triggerBuild() {
  got.post(process.env.BUILD_URL)
}

async function triggerAndWait(startCount) {
  await triggerBuild()
  // console.time(`build time`)

  let newCount = 0
  do {
    // Sometimes an error prevents getting the count — ignore that and use
    // the previous value.
    newCount = (await getCount()) || newCount
  } while (newCount <= startCount)

  // console.timeEnd(`build time`)

  return newCount
}

async function main() {
  let startCount = await getCount()
  if (!startCount) {
    throw new Error(
      `could not retrive a build count from SERVE_URL: 
      ${process.env.SERVE_URL}`
    )
  }
  for (let i = 0; i < 100; i++) {
    startCount = (await triggerAndWait(startCount)) || startCount
    buildsCount += 1
    const totalMillis = new Date().getTime() - startTime
    const totalMinutes = totalMillis / 1000 / 60
    console.log({ buildsCount })
    console.log(`publishes/minute: ${(buildsCount / totalMinutes).toFixed(1)}`)
    console.log(`average build time: ${(totalMillis / buildsCount).toFixed(1)}`)
    console.log(`\n`)
  }
}

main()
