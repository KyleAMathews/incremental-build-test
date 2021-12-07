import React from "react"

export default function Blank (props) {
  return <div>hi I'm always changing due to {props.pageContext.random}</div>
}

// export const query = graphql`
  // query($id: String!) {
    // benchmark(id: { eq: $id }) {
      // random
    // }
  // }
// `
