// @flow

import {
  buildClientSchema,
  introspectionQuery,
  printSchema,
} from 'graphql/utilities'
import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'

type Options = {
  graphql?: boolean,
  json?: boolean,
  outputPath?: string,
}

const writeFile = ({filePath, contents}: {filePath: string, contents: string}) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, contents, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export default async (url: string, options: Options = {}) => {
  // If no option is set, consider it's all
  if (!options.graphql && !options.json) {
    options.graphql = true
    options.json = true
  }
  const pathPrefix = options.outputPath || './'

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: introspectionQuery,
    }),
  })
  const schema = await res.json()

  const files = []
  if (options.graphql) {
    files.push({
      filePath: path.resolve(pathPrefix, 'schema.graphql'),
      contents: printSchema(buildClientSchema(schema.data)),
    })
  }
  if (options.json) {
    files.push({
      filePath: path.resolve(pathPrefix, 'schema.json'),
      contents: JSON.stringify(schema, null, 2),
    })
  }

  await Promise.all(files.map(writeFile))
  return files
}
