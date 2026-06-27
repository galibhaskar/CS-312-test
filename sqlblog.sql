CREATE TABLE users(
    user_id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

/*Blogs table*/
CREATE TABLE blogs(
    blog_id SERIAL PRIMARY KEY,
    creator_name VARCHAR(255),
    creator_user_id VARCHAR(255),
    title VARCHAR(255),
    body TEXT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_user_id)
        REFERENCES users(user_id)
);

INSERT INTO users(user_id,password,name)
VALUES
('john','1234','John Smith'),
('alice','1234','Alice Brown'),
('david','1234','David Wilson');

INSERT INTO blogs
(creator_name,creator_user_id,title,body)
VALUES
('John Smith','john','Welcome','Welcome to my first blog.'),
('Alice Brown','alice','Learning Node','Node.js is easy to learn.'),
('David Wilson','david','Express','Express makes routing easy.'),
('John Smith','john','PostgreSQL','PostgreSQL stores data permanently.'),
('Alice Brown','alice','EJS','EJS is useful for templates.');

SELECT * FROM users;
SELECT * FROM blogs;