var express = require('express');
var jwt = require('jsonwebtoken')
var mysql = require("mysql");
// var connection;
// if (process.env.JAWSDB_URL) {
//     connection = mysql.createConnection(process.env.JAWSDB_URL);
// } else {
//     console.log('error')
// }
// connection.connect();
const app = express()

// dotenv.config();
const port = process.env.PORT || 3000;
var bodyParser = require('body-parser')
// var jsonParser = bodyParser.json()
// app.use(express.json({
//     type: ['application/json', 'text/plain']
//   }))
// var connection = mysql.createConnection(process.env.)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('origin'))
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Expose-Headers", "Content-Disposition")


    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});

// const insertIntoTable = (token, username, password, name) => {
//     return new Promise(
//         (resolve, reject) => {
//             mysqlPool.query(`
//         INSERT INTO login (token, username, password, name)
//         VALUES
//         (:token, :username, :password, :name);
//         `, {
//                 token, username, password, name
//             },
//                 function (err, fields) {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         console.log("good it works")
//                     }
//                 }
//             )
//         }
//     )
// }

app.post('/question5/login', function (req, res) {
    console.log('works')
    const { username, password, name } = req.body;
    const token = jwt.sign({ username }, password)

    if (token) {
        res.json({ success: 'post call succeed!', token });
        // insertIntoTable(token, username, password, name)
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

