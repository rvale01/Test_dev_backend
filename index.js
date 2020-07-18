var express = require('express');
var jwt = require('jsonwebtoken')
const app = express()

const fs = require('fs');
var mysql = require("mysql");

const dotenv = require("dotenv");
dotenv.config();

// access config var
process.env.TOKEN_SECRET;
const port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
const { isUndefined } = require('util');

var privateKEY = fs.readFileSync('./private.key', 'utf8');
var publicKEY = fs.readFileSync('./public.key', 'utf8');
// if (process.env.JAWSDB_URL) {
//     connection = mysql.createConnection(process.env.JAWSDB_URL);
// } else {


var mysqlPool = mysql.createPool({
    host: "zpfp07ebhm2zgmrm.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "qswn89zx79v1vp14",
    password: "u5fvhdy5hkxuznd2",
    database: "eaq6ki6n4cy9qa28",
    queryFormat: (query, values) => {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return mysql.escape(values[key]);
            }
            return txt;
        });
    }
});


// connection.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('origin'))
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Expose-Headers", "Content-Disposition")


    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});


const checkEmailInDB = (email) => {
    return new Promise(
        (resolve, reject) => {
            mysqlPool.query(`
            SELECT email FROM login WHERE email = :email
            `, { email },
                function (err, results) {
                    if (err) {
                        reject(err);
                    } else if (results.length > 0) {
                        resolve("exists")
                    } else {
                        resolve("not exist")
                    }
                }
            )
        }
    )

}

const insertIntoTable = (name, email, token) => {
    return new Promise(
        (resolve, reject) => {
            mysqlPool.query(`
            INSERT INTO login (name, email, token)
            VALUES
	        (:name, :email, :token);
            `, {
                name, email, token
            },
                function (err, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve('all good')
                    }
                }
            )
        }
    )

}


app.post('/question5/login', async function (req, res) {
    var signOptions = {
        algorithm: "RS256"   // RSASSA [ "RS256", "RS384", "RS512" ]
    };

    const { name, password, email } = req.body;
    const data = {
        name: name,
        password: password,
        email: email
    }
    let checking = await checkEmailInDB(email)

    if (checking === "exists") {
        res.json({ result: 'email exists', checking });
    } else if (checking === "not exist") {
        let token = jwt.sign({ data }, privateKEY, signOptions)
        if (token) {
            insertIntoTable(name, email, token)
                .then((result) => {
                    res.json({ result: result });
                })
        } else {
            res.json({ "result": "problem with token" });
        }
    }
})

const getFromTable = (email) => {
    return new Promise(
        (resolve, reject) => {
            mysqlPool.query(`
            SELECT TOKEN FROM login WHERE email = :email
            `, { email },
                function (err, results) {
                    if (err) {
                        reject(err);
                    } else if (results.length > 0) {
                        resolve(results)
                    }
                    else {
                        resolve("not exists")
                    }
                }
            )
        }
    )

}


app.get('/question6/login', async function (req, res) {
    // connect to db, check for email, get token
    const { password, email } = req.body

    var signOptions = {
        algorithms: "RS256"   // RSASSA [ "RS256", "RS384", "RS512" ]
    };
    let token = await getFromTable(email)

    if (token === 'not exists') {
        res.json({ result: 'email does not exist', req, token })
    } else {

        let tokenValue = token[0]['TOKEN']
        jwt.verify(tokenValue, publicKEY, signOptions, function (err, data) {
            if (err) {
                res.json({ "result": err, data })
            } else {
                if (data.data.password === password) {
                    res.json({ "result": "good" })
                } else {
                    res.json({ "result": 'email or password wrong', })
                }
            }
        })
    }
})


app.listen(port)

