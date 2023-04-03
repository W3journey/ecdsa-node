## ECDSA Node

This project demonstrates the utilization of a client-server model to enable transfers between distinct addresses. However, the system operates in a highly centralized manner, with a single server on the backend responsible for handling all transfers. To enhance security, Public Key Cryptography is incorporated into the system, ensuring that the server authorizes only those transfers that have been digitally signed by the rightful owner of the associated address.

### Video instructions

For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4

### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder
2. Run `npm install` to install all the depedencies
3. Run `node index` to start the server

The application should connect to the default server port (3042) automatically!

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.

### Generate New account

1. Open a terminal within the `/server` folder
2. Run `node scripts/generate.js [balance]` to generate a new account with an optional initial balance
