# tic-tac-toe
Tic-tac-toe game with **room system** and authorization using **Discord**.
___
### Installation
- Clone the repository:
```bash
git clone https://github.com/Kitaminka/tic-tac-toe.git
```
- Install dependencies:
```bash
npm install
```
- Create **.env** file and put your [**Discord application ID, redirect URI and secret**](#discord-application-creation), **MongoDB URL** and another settings in this file. Example of **.env** file you can see in the file **.env.example**.
- Start the program:
```bash
npm start
```
___
### Features
- Authorization using Discord API
- Room system
- Socket usage
- MongoDB usage
- Model-View-Controller pattern
___
### Screenshots
![Screenshot](https://i.imgur.com/GhvXqfl.png)
![Screenshot](https://i.imgur.com/LdEiWJC.png)
___
### Discord application creation
- Go to the [**Discord Developer Portal**](https://discord.com/developers/applications) and create an **application**.

![Screenshot](https://i.imgur.com/wpxEvSK.png)
- Go to the **OAuth2** tab, copy **client ID** and **client secret**. Specify **redirect URL** like this: `http://[your domain]/users/auth` or `https://[your domain]/users/auth`.

![Screenshot](https://i.imgur.com/Jfpi7dk.png)
- Using **OAuth2 URL Generator** create **authorization link** with **identify** scope.
___
