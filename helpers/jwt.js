const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "Apaajadehyangpentingjalan";

const generateToken = async function (payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn: "1d" }, (err, token) => {
            if (err) {
                return reject(err);
            }
            resolve(token);
        });
    });
};

const decodeToken = async function (token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
};

module.exports = { generateToken, decodeToken };
