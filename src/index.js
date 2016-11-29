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

const sortType = (type: object) => {
  if (type['kind'] === 'OBJECT') {
    return sortObject(type)
  } else if (type['kind'] === 'INTERFACE') {
    return sortInterface(type)
  } else if (type['kind'] === 'ENUM') {
    return sortEnum(type)
  } else if (type['kind'] === 'INPUT_OBJECT') {
    return sortInputObject(type)
  } else if (type['kind'] === 'UNION') {
    return type
  } else if (type.kind === 'SCALAR') {
    return type
  }

  throw new Error("Unknown kind")
}

const sortObject = (type: object) => {
  type.interfaces = type.interfaces
    .sort((int1, int2) => int1.name.localeCompare(int2.name))
  type.fields = type.fields
    .sort((field1, field2) => field1.name.localeCompare(field2.name))
    .map(sortArgs)
  return type
}

const sortInterface = (type: object) => {
  type.fields = type.fields
    .sort((field1, field2) => field1.name.localeCompare(field2.name))
  return type
}

const sortEnum = (type: object) => {
  type.enumValues = type.enumValues
    .sort((value1, value2) => value1.name.localeCompare(value2.name))
  return type
}

const sortInputObject = (type: object) => {
  type.inputFields = type.inputFields
    .sort((field1,field2) => field1.name.localeCompare(field2.name))
  return type
}


const sortArgs = (field: object) => {
  field.args = field.args
    .sort((arg1, arg2) => arg1.name.localeCompare(arg2.name))
  return field
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
  if (options.sort) {
    const types = schema.data.__schema.types.map(sortType)
    schema.data.__schema.types = types
  }

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
