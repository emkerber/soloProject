CREATE TABLE notifications (
    id serial NOT NULL PRIMARY KEY,
    phonenumber text REFERENCES users(phonenumber),
    date text,
    text text
);


CREATE TABLE users (
    id serial NOT NULL PRIMARY KEY,
    phonenumber text,
    password text,
    textcontent text
);
