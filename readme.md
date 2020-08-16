# uMessage App 📱

uMessage is a full-stack chat application that allows you to send messages to other users by email address as well as video chat. Previous conversations that can be filtered out by name. The design of the application is inspired by iMessage and Slack. 

*NOTE: This was styled with Google Chrome in mind. Style may not be consistent with other browsers. Advised to be used on screens larger than 540px. Style for smaller screens including mobile not fully supported.*

* [Deployed Version](https://umessenger-frontend.herokuapp.com/)

## Message Interface Sample

![Image of Message](frontend/public/sample-image/message-sample.png)

## Video Interface Sample

![Image of Video](frontend/public/sample-image/video-sample.png)

# Setup

Refer to the respective stack's README for instructions on setting up.

# Current Features

* A user can send a message or start a new conversation to other users with a known email address. 
* The conversation can contain multiple users.
* A user can filter through the list of their conversations to find conversations from a specific user by name.
* SocketIO is implemented to update all users involved in a conversation of new messages.
* A user is also notified of other users typing in real time through the list of conversations in the side bar as well as the main message view.
* The list of message of a specific conversation are organized by date for ease of view for the user.
* Clicking on a specific conversation from the side bar highlights it as well as scrolls to the most recent message.
* The recipient and message input dynamically increase to an extent while adjusting the components size.
* A user can video chat another user. (only one user at the moment). PeerJS establishes the connection between users.
* The user on the receiving end can choose to accept or decline the video chat call.
* A user can react on a message. They can also un-react.

# Known Bugs/Issues
* Minor bug involving who's typing. At some point, if the user keeps typing, the user's own name is included in the list of typing (which it shouldn't) and is not removed even after they're not typing anymore. (consider refactoring or restructuring typing feature.)
* Refactor code

# Tech Stack

* React
* Redux
* NodeJS
* Express
* Mongoose
* MongoDB
* HTML/SCSS

# Tools

* Moment.js (formatting time instances)
* Emoji-Mart (emoji library)
* React-Router (client-side routing)
* JSON Web Token 
* BCrypt (password hashing algorithm)
* Socket.io (live updates of users typing and new messages) 
* PeerJS (establish connection between users for video chat)
* Validator (validating instances)
* CORS
* Multer (photo upload)
* Sharp (photo resizing)
* Font Awesome (icons)

# Authors
Reinald Reynoso