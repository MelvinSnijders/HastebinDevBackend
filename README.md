## Description
NestJS Backend server for [hastebin.dev](https://hastebin.dev)
Check out the live version (OpenAPI spec) at [api.hastebin.dev](https://api.hastebin.dev)

Current status:
- Support for basic documents
- Working on user support

## Installation

```bash
$ yarn install
```

Configure your database connection in the `ormconfig.json` file.

```bash
$ cp ormconfig.example.json ormconfig.json
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```