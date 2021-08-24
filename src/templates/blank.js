import React from "react"
import { graphql } from "gatsby"

export default function Blank(props) {
  return (
    <div>
      hi {props.data.benchmark.random}
      {props.data.benchmark.longstring}
    </div>
  )
}

export const query = graphql`
  query ($id: String!) {
    benchmark(id: { eq: $id }) {
      random
      longstring
    }
  }
`
