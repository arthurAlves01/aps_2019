const express = require('express');
const app = express();
const session = require("express-session")
const api = require("./api.js")

app.set('view engine', 'pug')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '9pf48z74ur',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use("/api", api)

app.get(["/","/*"], (req, res, next) => {
    if(req.session.loggedin||req.path.substring(0,5)=="/css/"||req.path.substring(0,5)=="/script/") {
        next()
    } else {
        res.render("login")
    }
})

app.use(express.static(__dirname))

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});