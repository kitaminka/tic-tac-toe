# TicTacToe

___
### Installation and launching
- Clone the repository:
```bash
git clone https://github.com/Kitaminka/TicTacToe.git
```
- Install dependencies:
```bash
npm install
```
- Create **.env** file and put your [**Discord application ID and secret**](#discord-application-creation), [**MongoDB URL**](#mongodb-free-hosting) and another settings in this file. Example of **.env** file you can see in the file **.env.example**.
- Start the program:
```bash
npm start
```
___
### Discord application creation
- Go to the [**Discord Developer Portal**](https://discord.com/developers/applications) and create an **application**.

![Screenshot](https://i.imgur.com/wpxEvSK.png)
- Go to the **OAuth2** tab, copy **client ID** and **client secret**. Specify **redirect URL** like this: `http://[your domain]/user/auth` or `https://[your domain]/user/auth`.

![Screenshot](https://i.imgur.com/Jfpi7dk.png)
- Using **OAuth2 URL Generator** create **authorization link** with **identify** scope.
___
### MongoDB free hosting
As a free hosting for the **MongoDB**, you can use a [**MongoDB Atlas**](https://cloud.mongodb.com) free cluster.

![Screenshot](https://i.imgur.com/KmoA8Gc.png)
___