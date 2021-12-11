-- createdb petition
-- psql -d petition -f tables/signatures.sql
-- Whenever we change the sql file,
-- we need to run the psql command above again!

DROP TABLE IF EXISTS signature;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    first TEXT NOT NULL CHECK (first != ''),
    last TEXT NOT NULL CHECK (last != ''),
    signature TEXT NOT NULL CHECK (signature != '') 
)