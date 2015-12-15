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

###Seed data

Running the seeds.js script will create the test user, bob@example.com,
with password secret, and some sample data.

    $ npm run ?

###Tests

To run all tests once:

    $ npm test
