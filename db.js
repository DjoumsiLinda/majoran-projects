const spicedPg = require("spiced-pg");

//heroku
let connetionString = process.env.DATABASE_URL;
if (!connetionString) {
    connetionString = require("./secrets.json").connetionString;
}

const db = spicedPg(connetionString);

module.exports.getSignaturesWithId = (id) => {
    return db.query(`SELECT signature FROM signatures where user_id = $1;`, [
        id,
    ]);
};

module.exports.getSignaturesCount = () => {
    return db.query(`SELECT COUNT (signatures) FROM signatures;`);
};

module.exports.addSignatures = (signature, user_id) => {
    // NEVER EVER use the string interpolation in template literals
    // to construct your SQL queries.
    // Always use the built-in $1, $2... syntax
    return db.query(
        `INSERT INTO signatures (signature, user_id)
        VALUES($1, $2)
        RETURNING id`,
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
        `SELECT first, last, age, city, url 
        FROM users 
        JOIN signatures 
        ON users.id = signatures.user_id
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id;`
    );
};
module.exports.getUsers_profile = (id) => {
    return db.query(
        `SELECT first, last, email, password, age, city, url 
        FROM users 
        JOIN signatures 
        ON users.id = signatures.user_id
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id
        where users.id=$1;`,
        [id]
    );
};

module.exports.getUsersNachCity = (city) => {
    return db.query(
        `SELECT first, last, age, city, url 
        FROM users 
        JOIN signatures 
        ON users.id = signatures.user_id
        JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE LOWER(city) = LOWER($1); `,
        [city]
    );
};
module.exports.getPasswords = (email) => {
    return db.query(`SELECT id, password FROM users where email = $1;`, [
        email,
    ]);
};

module.exports.addUserProfiles = (age, city, url, user_id) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
        VALUES($1, $2, $3, $4)`,
        [age, city, url, user_id]
    );
};
