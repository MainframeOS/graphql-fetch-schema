// @flow

import program from 'commander'
import ora from 'ora'

import pckg from '../package.json'
import fetchSchema from './index'

const run = async (url: string, options: Object) => {
  const spinner = ora().start()

  try {
    const files = await fetchSchema(url, options)
    spinner.succeed(files.map((file: Object) => file.filePath).join(' '))
  } catch (err) {
    spinner.fail(err.message)
  }
}

program
  .version(pckg.version)
  .usage('<url> [options]')
  .option('-g, --graphql', 'write schema.graphql file')
  .option('-c, --cookie <cookie>', 'pass additional Cookie header')
  .option('-j, --json', 'write schema.json file')
  .option('-o, --output <directory>', 'write to specified directory')
  .parse(process.argv)

run(program.args[0], {
  graphql: !!program.graphql,
  json: !!program.json,
  outputPath: program.output,
  cookie: program.cookie,
})
