require("isomorphic-fetch");
const {Pool} = require("pg");

const slackApiUrl = "https://slack.com/api";

const encodeForm = data =>
    Object.entries(data).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join("&");

const formRequest = (apiMethod, token, body = {}) => new Request(`${slackApiUrl}/${apiMethod}`, {
    body: encodeForm({...body, token}),
    method: "POST",
    headers: new Headers({
        "Content-type": "application/x-www-form-urlencoded"
    })
});

const jsonRequest = (apiMethod, token, body = {}) => new Request(`${slackApiUrl}/${apiMethod}`, {
    body: JSON.stringify(body),
    method: "POST",
    headers: new Headers({
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
    })
});

const getRequest = (apiMethod, token) => new Request(`${slackApiUrl}/${apiMethod}`, {
    headers: new Headers({
        "Authorization": `Bearer ${token}`
    })
});

const fetchJson = request =>
    fetch(request).then(res => res.json());

const getUsers = async token => {
    const userList = await fetchJson(formRequest("users.list", token));
    return Object.assign({}, ...userList.members.map(u => ({[u.id]: {
            name: u.name,
            realName: u.real_name,
            isBot: u.is_bot
        }})
    ));
};

const getUserInfo = async (user, token) =>
    fetchJson(formRequest("users.info", token, {user}));

const getChannels = async token => {
    const channelList = await fetchJson(formRequest("channels.list", token));
    return Object.assign({}, ...channelList.channels.map(c => ({[c.id]: {
            name: c.name
        }})
    ));
};

const postMessage = (message, token) => fetchJson(jsonRequest("chat.postMessage", token, message));

const puraisuDB = (connectionString, source) => {
    const pool = new Pool({connectionString});

    const insertPuraisu = (user, type, content, location, info, pf, coordinates, timestamp = new Date()) => {
        console.log("Inserting puraisu");
        return pool.query(
            `INSERT INTO puraisu (type, content, location, info, source, biter, postfestum, coordinates, timestamp) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [type, content, location, info, source, user, pf, coordinates, timestamp]
        );
    };

    return {
        pool, insertPuraisu
    };
};

module.exports = {
    encodeForm,
    formRequest,
    jsonRequest,
    getRequest,
    fetchJson,
    getUsers,
    getUserInfo,
    getChannels,
    postMessage,
    puraisuDB
};