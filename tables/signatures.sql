-- createdb petition
-- sudo service postgresql start
-- heroku pg:psql -f tables/signatures.sql
-- psql -d petition -f tables/signatures.sql
-- Whenever we change the sql file,
-- we need to run the psql command above again!

--https://blog.codinghorror.com/a-visual-explanation-of-sql-joins/
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;



CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR NOT NULL CHECK (first != ''),
      last VARCHAR NOT NULL CHECK (last != ''),
      email VARCHAR NOT NULL UNIQUE CHECK (email != ''),
      password VARCHAR NOT NULL CHECK (password != ''),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE signatures(
      id SERIAL PRIMARY KEY,
      signature VARCHAR NOT NULL CHECK (signature != ''),
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_profiles(
    id SERIAL PRIMARY KEY,
    age INT,
    city TEXT,
    url TEXT,
    user_id INT REFERENCES users(id) NOT NULL UNIQUE -- unique means each user can only have 1 row
);
