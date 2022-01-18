import * as React from "react"
import { graphql } from "gatsby"

export default function buildCount({ data }) {
  return data.buildCount.buildCount
}

export const query = graphql`
  query {
    buildCount {
      buildCount
    }
  }
`
