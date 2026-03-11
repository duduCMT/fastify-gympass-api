# Notations

## Prisma

To init prisma, use:

```sh
npx prisma init
```

The Prisma script are create a new folder in root of the project with name `prisma`.

It is recommended that you use the [Prisma extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) for your VSCode.

Another recommended configuration is to set up the Prisma editor settings in VS Code. This project includes a `settings.json` file inside the `.vscode` folder with the following configuration:

```json
{

  "[prisma]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "Prisma.prisma"
  },
  "prisma.pinToPrisma6": true
}
```

### Generate Typescript

Prisma can generate Typescript based on your schema files. To generate the types, run the following command: 

```sh
npx prisma generate
```

Note: Prisma will generate the TypeScript types in the following file: 
`node_modules/.prisma/client/index.d.ts`

## Docker

To setup the database, run the following command:

```sh
docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=apisolid -p 5432:5432 bitnamilegacy/postgresql
```

After that, you can use the following command to start the Docker:

```sh
docker start api-solid-pg
```

To stop Docker container, use the following command:

```sh
docker stop api-solid-pg
```

To remove the Docker container, use the following command:

```sh
docker rm api-solid-pg
```
