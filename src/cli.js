// @flow

import program from 'commander'

import fetchSchema from './index'

const run = async (url: string, options: Object) => {
  try {
    const files = await fetchSchema(url, options)
    files.forEach((file: Object) => {
      console.log(file.filePath)
    })
  } catch (err) {
    console.error(err)
  }
}

program
  .version('0.1.0')
  .usage('<url> [options]')
  .option('-g, --graphql', 'write schema.graphql file')
  .option('-j, --json', 'write schema.json file')
  .option('-o, --output <directory>', 'write to specified directory')
  .parse(process.argv)

run(program.args[0], {
  graphql: !!program.graphql,
  json: !!program.json,
  outputPath: program.output,
})
