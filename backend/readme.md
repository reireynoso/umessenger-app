# uMessage Server
* The API for the uMessage application

# Getting Started
Before setting up, make sure the server is installed along with Node.js, NPM and MongoDB.

## Prerequisites
If it is not installed, go in your terminal, and follow the steps:

1. Install [Node and NPM](https://www.npmjs.com/get-npm)
2. Install [MongoDB](https://www.mongodb.com/try/download/community)
    - The download is a zip file.
    - Unzip the contents, change the folder name to “mongodb”, and move it to your users home directory.
    - From there, create a “mongodb-data” directory in your user directory to store the database data.
    - You can start the server using the following command in your terminal: `/Users/example/mongodb/bin/mongod --dbpath=/Users/example/mongodb-data`
    - Make sure to swap out `/Users/example/` with the correct path to your users home directory.

## Setup

From your terminal,

1. Clone the repo and `cd` into the folder
2. Install dependencies with `npm install`
3. Open the `index.js` and uncomment `data()` on line 128 for the first time the server runs to load seed files. (Uncomment it again once seeds are loaded.)
4. Launch the server with `npm run dev`

# Built With
NodeJS

# Tools
* Express
* Mongoose
* React-Router
* JSON Web Token
* BCrypt
* Socket.io 
* PeerJS
* Validator (validating instances)
* CORS
* Multer (photo upload)
* Sharp (photo resizing)

# Authors
Reinald Reynoso