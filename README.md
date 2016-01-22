#node-todo

A simple Node.js/Express server that implements an API for a Todo
application.

The back-end is an API server implemented in Node.js on a Postgresql
database.

##Setting up development environment

###Database
You will need a couple of new Postgres databases:

    $ createdb --no-password node_todo_development
    $ createdb --no-password node_todo_test

Create the schema from the SQL schema script provided:

    $ psql -d node_todo_development < server/data/schema.sql
    $ psql -d node_todo_test < server/data/schema.sql

###Seed data

Running the seeds.js script will create the test user, bob@example.com,
with password secret, and some sample data.

    $ npm run seed

###Tests

Tests are written in Mocha. To run all tests:

    $ npm test
