# uMessage App 📱

uMessage is a full-stack chat application that allows you to send messages to other users by email address as well as video chat. Previous conversations that can be filtered out by name. The design of the application is inspired by iMessage and Slack. 

# Setup

Refer to the respective stack for instructions on setting up. (still in progress...)

# Current Features

* A user can send a message or start a new conversation to other users with a known email address. 
* The conversation can contain multiple users.
* A user can filter through the list of their conversations to find conversations from a specific user by name.
* SocketIO is implemented to update all users involved in a conversation of new messages.
* A user is also notified of other users typing in real time through the list of conversations in the side bar as well as the main message view.
* The list of message of a specific conversation are organized by date for ease of view for the user.
* Clicking on a specific conversation from the side bar highlights it as well as scrolls to the most recent message.
* The recipient and message input dynamically increase to an extent while adjusting the components. 
* A user can video chat another user. (only one user at the moment)
* The user on the receiving end can choose to accept or decline the video chat call.

# Known Bugs/Issues
* When inputting email recipient, if it's too long it will expand the width. 
* ~~Sending a new message through a new conversation does not redirect to the conversation without redirecting for everyone.~~ (implemented a fix by adding another dispatch on sendMessageToConversation fetch request. But still needs to test.)
* Some issues with conversation container and HTML body width. (fix was to use position fixed for the whole body but it eliminates responsiveness)
* Have not tested issue but possible issue with multiple users calling/video chatting one person.

# Tech Stack

* React
* Redux
* NodeJS
* Express
* Mongoose
* MongoDB
* HTML/SCSS

In progress...

# Tools

* Moment.js (formatting time instances)
* Emoji-Mart (emoji library)
* React-Router
* JSON Web Token
* BCrypt
* Socket.io 
* PeerJS
* Validator (validating instances)
* CORS
* Multer (photo upload)
* Sharp (photo resizing)

In progress...

# Authors
Reinald Reynoso