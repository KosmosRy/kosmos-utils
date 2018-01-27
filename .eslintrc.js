module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "globals": {
        "fetch": true,
        "Headers": true,
        "Request": true
    },
    "parserOptions": {
        "ecmaVersion": 8,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "arrowFunctions": true
        },
    },
    "extends": "eslint:recommended",
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off"
    }
};