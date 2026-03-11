# Fastify GymPass API

[![](https://img.shields.io/badge/NodeJS-project-green?logo=nodedotjs)](https://nodejs.org/en)
[![](https://img.shields.io/badge/Fastify-framework-darkgray?logo=fastify)](https://fastify.dev/)
[![](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![](https://img.shields.io/badge/Build%20to-learn-blue?logo=github)](#)

<!--
[![](https://img.shields.io/badge/Production-On%20Render-blue)]()
-->

## 📝 Description

A GymPass-style API that allows users to register, authenticate, and interact with nearby gyms. Users can search gyms by name or proximity, perform check-ins, view their check-in history, and track the total number of visits. The application enforces business rules such as unique user emails, location-based check-ins within 100 meters, and limiting users to one check-in per day. Check-ins can only be validated by administrators within 20 minutes of creation, and gyms can only be registered by admins. The system uses JWT for authentication, encrypted passwords, PostgreSQL for data persistence, and paginated responses (20 items per page) for all list endpoints.

## ⚡ Technologies

- [NodeJS](https://nodejs.org/en) with Typescript
- [Fastify](https://fastify.dev/) for API
- [PostgresSQL](https://www.postgresql.org/) to Database
- [Prisma](https://www.prisma.io/) to Database ORM

## 🚩 Setup

First of all, create a `.env` file at the root of the project following the `.env.example`.

Next, proceed by configuring the node version correctly.

If you are using nvm, run:

```bash
nvm install && nvm use
```

Else, change your Node Version to `18.14.0`.

Install Dependencies With:

```bash
npm install
```

To run the project in developer mode, use:

```bash
npm run start:dev
```

To run the project, use:

```bash
npm run build && npm start
```

<!--
## Notations

I'm recording here some important lessons learned during the project implementation.

## 🔎 API Documentation

See the complete API documentation in this file:

- [API Documentation](./docs/api.md)

If you use Insomnia, you can import the endpoints with examples

- [Insomnia_Fastify_Simple_Transaction_API](./docs/.json)
-->
