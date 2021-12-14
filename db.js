const spicedPg = require("spiced-pg");

const { connetionString } = require("./secrets.json");

const db = spicedPg(connetionString);

module.exports.getSignaturesWithId = (id) => {
    return db.query(`SELECT signature FROM signatures where user_id = $1;`, [
        id,
    ]);
};

module.exports.getSignaturesCount = () => {
    return db.query(`SELECT COUNT (*) FROM signatures;`);
};

module.exports.addSignatures = (signature, user_id) => {
    // NEVER EVER use the string interpolation in template literals
    // to construct your SQL queries.
    // Always use the built-in $1, $2... syntax
    return db.query(
        `INSERT INTO signatures (signature, user_id)
        VALUES($1, $2)`,
        [signature, user_id]
    );
};

module.exports.addUsers = (first, last, email, password) => {
    // NEVER EVER use the string interpolation in template literals
    // to construct your SQL queries.
    // Always use the built-in $1, $2... syntax
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES($1, $2, $3, $4)
        RETURNING id;`,
        [first, last, email, password]
    );
};
module.exports.getUsers = () => {
    return db.query(
        `SELECT first, last FROM users join signatures on users.id = signatures.user_id;`
    );
};
module.exports.getPasswords = (email) => {
    return db.query(`SELECT id, password FROM users where email = $1;`, [
        email,
    ]);
};
