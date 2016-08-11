CREATE TABLE users (
    id serial NOT NULL PRIMARY KEY,
    phonenumber text,
    password text,
    textcontent text
);

CREATE TABLE notifications (
    id serial NOT NULL PRIMARY KEY,
    phonenumber text,
    date text,
    text text
);
