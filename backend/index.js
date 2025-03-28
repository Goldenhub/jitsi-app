const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const generateJitsiToken = (mentorEmail, mentorName, roomName) => {
    const payload = {
        "aud": "jitsi",
        "context": {
            "user": {
                "name": mentorName,
                // "avatar": "",
                "email": mentorEmail,
                "moderator": "true"
            },
            "features": {
                "livestreaming": "true",
                "recording": "true",
                "moderation": "true"
            },
        },
        "exp": (Date.now() / 1000) + 3600, // 1hr
        "iss": "chat",
        "nbf": 1596197652,
        "room": "*",
        "sub": process.env.JAAS_APP_ID
    }
    const header = {
        kid: process.env.JAAS_API_KEY_ID,
        alg: "RS256",
        typ: "JWT",
    };
    return jwt.sign(payload, process.env.JAAS_PRIVATE_KEY, { algorithm: "RS256", header })
}

app.get("/api/jitsi-token", (req, res) => {
    const { name, email, room } = req.query;
    if (!name || !email || !room) {
        return res.status(400).json({ error: "Missing required parameters" });
    }
    const token = generateJitsiToken(name, email, room);
    res.json({ token });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})