# CodeJar

CodeJar is an educational platform for Fullstack students and instructors to manage coding exercises. Instructors can create, assign, and review coding exercises (AKA 'stretches') while also keeping track of attendance and the overall performance of their cohort. Students can submit answers, review their work, and track their personal progress throughout their program.

Deployed app is at https://my-codejar.herokuapp.com/

*Tech Stack*

- **backend**: Node, Express, Sequelize, PostgreSQL
- **frontend**: React, Redux, Redux-Thunk, Material-UI, d3
- **tooling/deployment**: Webpack, Babel, Heroku
- **other**: Socket.io

## Setup

**Install OS level dependencies**

- Node
- PostgreSQL

**Install app requirements**

Run following on command line to create database and install packages. "npm install" will also run a postinstall script to helpfully seed data and
webpackify frontend code.

```
createdb snippet_db
npm install
```

## Running App

**Steps to start app locally**

1. Run one of two scripts
   - `npm run start:dev` - this script reseeds data, starts server, and watches for changes in backend (any file in server directory) and frontend (any .js file in client directory) code
   - `npm start` - this script is the one used in production, it only starts the server
2. Go to http://localhost:[process.env.PORT]
3. Login in as instructor or student
   - instructor emails in original seeded data are a@gmail.com, b@gmail.com, and c@gmail.com
   - student emails in original seeded data are next 20 letters of alphabet at gmail, so d@gmail.com to w@gmail.com
   - password is always '12345'
4. Enjoy!

**Environment variables**

- **DATABASE_URL**: If you do not specify it, will be "postgres://localhost/snippet_db" (will work if you follow setup instructions)
- **PORT**: If you do not specify it, will be "3000"
- **GIPHY_API_KEY**: Obtain an API key from https://developers.giphy.com/ and set the key as value of this variable in an .env file

**Other Scripts To Use**

- `npm run seed`: reseed data
- `npm run start-server`: start server and watch for changes to backend code
- `npm run build-watch`: watch for changes to frontend code
