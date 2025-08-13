const bcrypt = require("bcryptjs");

const hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const compareHash = async function (password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, compareHash };
