const fetch = require('node-fetch');

module.exports = {
    async authUser(req, res) {
        if (!req.query.code) return res.status(403).send('Forbidden');

        const params = new URLSearchParams();
        params.append('client_id', '815550306351710238');
        params.append('grant_type', 'authorization_code');
        params.append('client_secret', 'zgpuHBkzdQRhsaOn0oulXIFJvw7YoU1l');
        params.append('code', req.query.code);
        params.append('redirect_uri', 'https://google.com');
        params.append('scope', 'identify email connections');

        const data = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((res) => res.json());
        console.log(data);
    },
    getUsers(req, res) {
        res.send('Список пользователей');
    }
}