var express = require('express');
var jwt = require('jsonwebtoken')
const app = express()

var mysql = require("mysql");
var connection;

const port = process.env.PORT || 3000;
var bodyParser = require('body-parser')

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
        port: 3306,
        host: "localhost",
        user: "root",
        password: "",
        database: "burgers_db"
    })
}

connection.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('origin'))
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Expose-Headers", "Content-Disposition")


    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});
app.post('/question5/login', function (req, res) {
    console.log('works')
    const { username, password } = req.body;
    const token = jwt.sign({ username }, password)

    if (token) {
        res.json({ success: 'post call succeed!', token });
    } else {
        res.json({ error: 'call failed!', url: req.url, result });
    }
})

app.get('/question6/login', function (req, res) {
    // connect to db, check for email, get token
    const { token, password } = req.body
    jwt.verify(token, password, function (err, data) {
        if (err) {
            res.json("error")
        } else {
            res.json("Done")
        }
    })
})


app.listen(port)

