const spicedPg = require("spiced-pg");

const { connetionString } = require("./secrets.json");

const db = spicedPg(connetionString);

module.exports.getCities = () => {
    return db.query(`SELECT * FROM cities;`);
};
