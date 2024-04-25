const bcrypt = require('bcrypt');

let encryptPassword=(password)=> {
    let slat = 10;
    let hashedPass =bcrypt.hash(password, slat);
    return hashedPass
}
let matchPassword = (password, hashPassword) => {
    return   bcrypt.compare(password, hashPassword);
}

module.exports = { encryptPassword, matchPassword }