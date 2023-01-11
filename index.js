//let sqlite3 = require('sqlite3')
const sqlite3 = require('sqlite3')
const express = require('express')
const cors = require('cors')
const app = express()
 
app.disable('x-powered-by')
app.use(cors())

const PORT = 8000
let db = new sqlite3.Database('database.db', (err) => {
        if (!err) {
                db.run('CREATE TABLE IF NOT EXISTS tbl_about_myself (name TEXT, email TEXT, UNIQUE(name, email))', 
                (err2) => {
                        if (!err2) {
                                db.run(
                                        "INSERT OR IGNORE INTO tbl_about_myself (name, email) VALUES ('laon','llallallall@kakako.com')"
                                )
                        }
                })
        }
})

db.run( 'CREATE TABLE IF NOT EXISTS tbl_my_resume (date DATE, title TEXT, content TEXT, url TEXT, UNIQUE(date, title))',
        (err2) => {
                if(!err2) {
                        const resume = [
                                {
                                        date : '1981-12-18',
                                        title : '탄생',
                                        content : '널리 세상을 이롭게 하리라',
                                        URL : null,
                                },
                                {
                                        date : '2000-03-01',
                                        title : '대학',
                                        content : '고려대학교 서양어문학부',
                                        URL : null,
                                },
                                {
                                        date : '2009-11-02',
                                        title : '입사',
                                        content : '취업',
                                        URL : 'http://wwww.at.or.kr'
                                }
                        ]

                        resume.forEach((item) => {
                                const query = `INSERT OR IGNORE INTO tbl_my_resume (date, title, content, URL) VALUES ('${item.title}','${item.title}','${item.content}','${item.URL}')`
                                db.run(query)
                        })
                }
        })
app.listen(PORT, ()=> {
        console.log(`Listening... ${PORT}`)
})

app.get('/', (req, res, next) => {
        res.json({ rsp : 'ok'})
})

app.get('/db/about-me', (req, res, next) => {
        let result = {
                'rsp' : 'fail'
        }

        db.get('SELECT * FROM tbl_about_myself', (err, row) => {
                if(!err) {
                        result.data = row
                        db.all('SELECT * FROM tbl_my_resume ORDER BY date desc', (err2, rows) => {
                                if(!err2) {
                                        result.rsp = 'ok',
                                        result.data.resume = rows
                                        res.json(result)
                                } else {
                                        res.json(result)
                                }
                        })
                        
                } else {
                        res.json(result)
                        console.log('Error Query')
                }
        })
})
