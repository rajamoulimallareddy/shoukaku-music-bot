# Shoukaku-Music-Bot

A music bot which is feature rich and best quality Music.

## Requirements

> For Stable Lavalink refer to [Stable Lavalink](https://github.com/freyacodes/Lavalink/releases)
> For stable/master Branch Lavalink server refer [application.yml](https://github.com/freyacodes/Lavalink/blob/master/LavalinkServer/application.yml.example)

> For Dev branch Lavalink refer to [Dev Branch Lavalink](https://ci.fredboat.com/viewType.html?buildTypeId=Lavalink_Build&branch_Lavalink=refs%2Fheads%2Fdev&tab=buildTypeStatusDiv)
> For Dev branch Lavalink server refer [application.yml](https://github.com/freyacodes/Lavalink/blob/dev/LavalinkServer/application.yml.example)

## Config & Bot Startup

Go to config/config.json.example rename it file's name into config.json.
Do `npm run slash` update slash commands of your bot

```json
{
  "prefix": "Your_Prefix",
  "token": "Your Token",
  "owners": ["Your Discord Id for eval & owner only Commands"],
  "dev": false,
  "guildId": "your guild's id, where you want the slash commands to be updated, when you enabled dev mode, disabling dev mode, means pushes new commands globally",
  "clientId": "Bots id",
  "colors": {
    "default": "606C65",
    "error": "FF4500"
  },
  "nodes": [
    {
      "name": "Your Node name",
      "url": "your host:your port",
      "auth": "youshallnotpass",
      "secure": false
    }
  ]
}
```

Secure Should be False if Your are using local lavalink. If Your node is using ssl keep it to true. To run the Bot just type `npm start`

## ABOUT & INFO

Creation Date: Tuesday, 20 July 2021.  
Published Date: Tuesday, 20 July 2021.  
❱・[Support Server](https://discord.gg/dB6RzCbZhW).  
❱・Discord Id [ARESᴮᴱ ᴿ⁴ᴬ#1773](https://discord.com/users/688028837711446041)

Want to contribute just submit a PR.  
Made With Hate by 🖤 ARESᴮᴱ ᴿ⁴ᴬ#1773

## NOTE $ LINKS

> Shoukaku Docs: https://deivu.github.io/Shoukaku/?api
> Shoukaku support Server: https://discord.gg/FVqbtGu

Some parts of the code has been taken from [Kongou](https://github.com/Deivu/Kongou)
