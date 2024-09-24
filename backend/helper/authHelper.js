import bcrypt from 'bcrypt';

export let encryptPassword = (password) => {
    let slat = 10;
    let hashedPass = bcrypt.hash(password, slat);
    return hashedPass
}
export let matchPassword = (password, hashPassword) => {
    return bcrypt.compare(password, hashPassword);
}