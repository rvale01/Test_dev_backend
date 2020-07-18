var express = require('express');
var jwt = require('jsonwebtoken')
const app = express()
const fs = require('fs');
var mysql = require("mysql");
var connection;

const port = process.env.PORT || 3000;
var bodyParser = require('body-parser')
var privateKEY  = fs.readFileSync('./private.key', 'utf8');
var publicKEY  = fs.readFileSync('./public.key', 'utf8');
// if (process.env.JAWSDB_URL) {
//     connection = mysql.createConnection(process.env.JAWSDB_URL);
// } else {


// var mysqlPool = mysql.createPool({
//     connectionLimit: 10,
//     host: "zpfp07ebhm2zgmrm.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
//     user: "qswn89zx79v1vp14",
//     password: "u5fvhdy5hkxuznd2",
//     database: "eaq6ki6n4cy9qa28",
//     queryFormat: (query, values) => {
//         if (!values) return query;
//         return query.replace(/\:(\w+)/g, function (txt, key) {
//             if (values.hasOwnProperty(key)) {
//                 return mysql.escape(values[key]);
//             }
//             return txt;
//         });
//     }
// });
// }

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


app.post('/question5/login', function (req, res) {
    console.log('works')
    // var signOptions = {
    //     issuer:  i,
    //     subject:  s,
    //     audience:  a,
    //     expiresIn:  "12h",
    //     algorithm:  "RS256"   // RSASSA [ "RS256", "RS384", "RS512" ]
    //    };
       
    // const { name, password, email } = req.body;
    // const body = req.body
    // const token = jwt.sign(body, privateKEY, )

    // if (token) {
        // let result = insertIntoTable(name, email, token)
        res.json({ result: "success" });
    // } else {
        // res.json({ result: 'call failed!', url: req.url });
    // }
})

const getFromTable = (email) => {
    return new Promise(
        (resolve, reject) => {
            mysqlPool.query(`
            SELECT TOKEN FROM login WHERE email = :email
            `, { email},
                function (err, results, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results)
                    }
                }
            )
        }
    )

}


app.get('/question6/login', async function (req, res) {
    // connect to db, check for email, get token
    const { password, email } = req.body
    let token = await getFromTable(email)
    if(token){
        jwt.verify(token[0]['TOKEN'], password, function (err, data) {
            if (err) {
                res.json({"result":err})
            } else {
                res.json({"result":'good'})
            }
        })
    }else{
        res.json({result:'email or password wrong'})
    }
})


app.listen(port)

