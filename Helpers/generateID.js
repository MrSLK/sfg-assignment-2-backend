const models = require("../Models")
const crypto = require("crypto");


const choice = () => {
  const arrayOrString = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz";
  const index = Math.floor(fraction() * arrayOrString.length);
  if (typeof arrayOrString === 'string') {
    return arrayOrString.substr(index, 1);
  }
  return arrayOrString[index];
}

const fraction = () => {
  const digits = 8;
  const numBytes = Math.ceil(digits / 2);
  const bytes = crypto.randomBytes(numBytes);
  const bytesToHex = bytes.toString('hex').substring(0, digits);

  const numerator = Number.parseInt(bytesToHex, 16);
  return numerator * 2.3283064365386963e-10; // 2^-3;
}

const generateCustomID = () => {
  let result = '';
  for (let i = 0; i < 17; i++) {	
    result += choice();
  }
  return result;
}

module.exports = {
  generateCustomID
};
