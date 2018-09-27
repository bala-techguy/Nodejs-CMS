# Client Management System Application

A simple client management system using nodejs and express js with Cloud Firestore as backend.

## Technologies
* Node.js
* Express
* Express Messages, Session, Connect Flash & Validation
* Firebase Admin SDK and Firestore for database
* Pug Templating
* Passport.js Authentication
* BCrypt Hashing

### Version
1.0.0

## Usage

Before starting, you have to setup a firestore database. For setting up firebase please follow the below instructions:

* Login to https://console.firebase.google.com
* Add a New project. 
* Go to the console and create a new Cloud Firestore database. You can set the security rules as public for now. 
* Navigate to Settings --> Service Accounts
* You will find an Admin SDK configuration snippet. At the bottom of the page, there will be a button called "Generate new private key". 
* Click on that button to download your private key. Rename the downloaded file as "serviceAccountKey.json". Please the file in your project folder. (This file is the key to perform any DB operation from your application.)

### Installation

Install the dependencies

```sh
$ npm install
```
Run app

```sh
$ npm start
```
