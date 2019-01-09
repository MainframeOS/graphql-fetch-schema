# graphql-fetch-schema

Fetch a GraphQL schema from a server and write it to file

## Installation

```sh
npm install graphql-fetch-schema
```

## CLI Usage

```sh
graphql-fetch-schema <url> [options]
```

### Options

```
-h, --help                output usage information
-V, --version             output the version number
-c, --cookie              pass additional Cookie header
-g, --graphql             write schema.graphql file
-j, --json                write schema.json file
-o, --output <directory>  write to specified directory
```

## API usage

```js
import fetchSchema from 'graphql-fetch-schema'

fetchSchema('https://api.myserver.com/graphql', {
  json: true,
  graphql: false,
  outputPath: '../schema',
  cookie: 'cookiename=foo;',
  headers: {
    Authorization: 'Bearer token'
  }
}).then(
  () => {
    console.log('Schema successfully written')
  },
  err => {
    console.error(err)
  },
)
```

## License

MIT
