# Group1's Group Assignment
## John Morio Sakaguchi & Korakoch Gerrard

### Setup
First do the following:

1. Copy `knexfile.js.sample` in the root directory to `knexfile.js`
2. Then edit `knexfile.js` to your systems Postgresql server specifications

Then to start the server run the following commands
1. `npm i`
2. `npm run reset-db`
3. `npm run start` if port 8080 is open or <br> 
`PORT=<your_port_number> npm run start` if you'd like to use a different port <br>
`SET PORT=<your_port_number> npm run start` should work on windows

For testing you should also be about to run
1. `npm run db-test` or <br>
`PORT=<your_port_number> npm run db-test` or <br>
`SET PORT=<your_port_number> npm run db-test` on windows <br>
to run the test the first time and use `npm run test` after the database has initially been setup


