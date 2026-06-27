const express = require("express");
const session = require("express-session");
const path = require("path");
const pool = require("./db");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
    secret: "blogsecret",
    resave: false,
    saveUninitialized: false
}));


//Home page
app.get("/", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM blogs ORDER BY date_created DESC"
    );

    res.render("index", {
        posts: result.rows,
        user: req.session.user
    });

});


// SIGN UP
app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const { user_id, password, name } = req.body;
    const check = await pool.query(
        "SELECT * FROM users WHERE user_id=$1",
        [user_id]
    );
    if (check.rows.length > 0) {
        return res.send("User ID already exists.");
    }
    await pool.query(
        "INSERT INTO users(user_id,password,name) VALUES($1,$2,$3)",
        [user_id, password, name]
    );
    res.redirect("/signin");
});


// SIGN IN
app.get("/signin", (req, res) => {
    res.render("signin");
});

app.post("/signin", async (req, res) => {
    const { user_id, password } = req.body;
    const result = await pool.query(
        "SELECT * FROM users WHERE user_id=$1 AND password=$2",
        [user_id, password]
    );
    if (result.rows.length === 0) {
        return res.send("Incorrect User ID or Password");
    }
    req.session.user = result.rows[0];
    res.redirect("/");
});

// Logout
app.get("/logout", (req, res) => {

    req.session.destroy();

    res.redirect("/signin");

});


// CREATE BLOG
app.post("/create", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/signin");
    }

    const { title, content } = req.body;
    await pool.query(
        `INSERT INTO blogs
        (creator_name, creator_user_id, title, body)
        VALUES ($1,$2,$3,$4)`,

        [
            req.session.user.name,
            req.session.user.user_id,
            title,
            content
        ]
    );
    res.redirect("/");

});

// EDIT BLOG
app.get("/edit/:id", async (req, res) => {

    const result = await pool.query(
        "SELECT * FROM blogs WHERE blog_id=$1",
        [req.params.id]
    );
    if (result.rows.length === 0) {
        return res.send("Blog not found.");
    }
    const post = result.rows[0];
    if (!req.session.user ||
        post.creator_user_id !== req.session.user.user_id) {
        return res.send("Unauthorized");
    }
    res.render("edit", { post });
});

app.post("/edit/:id", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM blogs WHERE blog_id=$1",
        [req.params.id]
    );
    if (result.rows.length === 0) {
        return res.send("Blog not found.");
    }

    const post = result.rows[0];
    if (!req.session.user ||
        post.creator_user_id !== req.session.user.user_id) {
        return res.send("Unauthorized");
    }
    await pool.query(
        "UPDATE blogs SET title=$1, body=$2 WHERE blog_id=$3",

        [
            req.body.title,
            req.body.content,
            req.params.id
        ]

    );
    res.redirect("/");
});


// DELETE BLOG
app.post("/delete/:id", async (req, res) => {

    const result = await pool.query(
        "SELECT * FROM blogs WHERE blog_id=$1",
        [req.params.id]
    );

    if (result.rows.length === 0) {
        return res.send("Blog not found.");
    }

    const post = result.rows[0];

    if (!req.session.user ||
        post.creator_user_id !== req.session.user.user_id) {
        return res.send("Unauthorized");
    }

    await pool.query(
        "DELETE FROM blogs WHERE blog_id=$1",
        [req.params.id]
    );

    res.redirect("/");

});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Error: " + err.message);
});

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
