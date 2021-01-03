## Mongo

MongoDB is required to run this tool. This can be run using docker:

    docker run -p 27017:27017 -v ~/Documents/family/database/db:/data/db mongo

## Run Locally

Running locally requires MongoDB running. See [Mongo](#Mongo)

    npm start

## Test

Test require MongoDB running. See [Mongo](#Mongo)

    npm run test
