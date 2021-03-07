const fetch = require('node-fetch');

module.exports = {
    async authUser(req, res) {
        if (!req.query.code) return res.status(403).send('Forbidden');
        const uri = 'http://127.0.0.1/users/auth/';

        const params = new URLSearchParams();
        params.append('client_id', process.env.CLIENT_ID);
        params.append('grant_type', 'authorization_code');
        params.append('client_secret', process.env.CLIENT_SECRET);
        params.append('code', req.query.code);
        params.append('redirect_uri', uri);

        const data = await fetch('https://discord.com/api/v8/oauth2/token', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((res) => res.json());

        const user = await fetch(`https://discord.com/api/v8/users/@me`, {
            method: 'GET',
            headers: {
                'Authorization':`${data.token_type} ${data.access_token}`
            }
        }).then((res) => res.json());
        req.session.username = `${user.username}#${user.discriminator}`;
        res.redirect('/');
    }
}