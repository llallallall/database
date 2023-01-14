const TYPE = require('./type.js')

function fn_about_me(db) {
        db.run('CREATE TABLE IF NOT EXISTS tbl_about_myself (name TEXT, email TEXT, UNIQUE(name, email))', 
                (err) => {
                        if (!err) {
                                db.run(
                                        "INSERT OR IGNORE INTO tbl_about_myself (name, email) VALUES ('laon','llallallall@kakako.com')"
                                )
                        }
                })
}

function fn_resume(db) {
        db.run('CREATE TABLE IF NOT EXISTS tbl_my_resume (date DATE, title TEXT, content TEXT, url TEXT, UNIQUE(date, title))',
                (err) => {
                        if(!err) {
                                const resume = [
                                        {
                                                date : '1981-12-18',
                                                title: '탄생',
                                                content : '널리 이롭게 하리라',
                                                url : null,
                                        },
                                        {
                                                date : '2000-03-01',
                                                title : '대학 입학',
                                                content : '고려대학교 서어서문',
                                                url : null,
                                        },
                                        {
                                                date : '2009-11-02',
                                                title : '입사',
                                                content : '아씨..',
                                                url : 'https://www.at.or.kr',
                                        }
                                ]

                                resume.forEach((item) => {
                                        const query = `INSERT OR IGNORE INTO tbl_my_resume (date, title, content, URL) VALUES ('${item.date}','${item.title}','${item.content}','${item.URL}')`
                                        db.run(query)
                                })
                        }
                }
        )
}

function fn_applications(db) {
        console.log('fn_applications')
        db.run('CREATE TABLE IF NOT EXISTS tbl_applications (id INT, name TEXT, content TEXT, date DATE, platform TEXT, url TEXT, image TEXT, UNIQUE(name, date))',
                (err) => {
                        if (!err) {
                                const applications = [
                                        {
                                                id:1,
                                                name :'힘을 내라',
                                                content : '응원 어플',
                                                date : '2021-08-01',
                                                platform : 'Web',
                                                url : 'http://triego.kr',
                                                image : 'https://cdn.crowdpic.net/detail-thumb/thumb_d_DB5D105678D987231D0C2757B1714FD4.jpg'
                                        },
                                        {
                                                id:2,
                                                name :'웃어라',
                                                content : '힐링 어플',
                                                date : '2022-08-01',
                                                platform : 'Web',
                                                url : 'http://muso.kr',
                                                image : 'https://image.yes24.com/momo/TopCate02/MidCate10/199084.jpg'
                                        }
                                ]

                                applications.forEach((item) => {
                                        const query = `INSERT OR IGNORE INTO tbl_applications (id, name, content, date, platform, url, image) VALUES ('${item.id}','${item.name}','${item.content}','${item.date}','${item.platform}','${item.url}','${item.image}')`
                                        db.run(query)
                                })
                        }
                }
        )
}

function fn_notification(db) {
        console.log('fn_notification')
        db.run(
                "CREATE TABLE IF NOT EXISTS tbl_notification (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, expiration DATE, type TEXT)",
                (err) => {
                        if(!err) {
                                let query = "DELETE FROM tbl_notification"
                                db.run(query)
                        }

                        query = `INSERT INTO tbl_notification (content, expiration, type) VALUES ('공사중입니다.', '2023-12-31', 'warning')`
                        db.run(query)

                        let result = {
                                rsp : "fail",
                        }
                        db.get(
                                `SELECT * FROM tbl_notification`,
                                (err, row) => {
                                        if (!err) {
                                                result.rsp = !row ? "nodata" : "ok"
                                                //console.log(result)
                                                if (row) {
                                                        result.data = row
                                                        //console.log(result)
                                                }
                                                
                                        } else {
                                                result.error = err.message
                                                
                                        }
                                }
                        )
                }
        )
}


function fn_blog(db) {
        console.log('fn_blog')
        db.run(
                "CREATE TABLE IF NOT EXISTS tbl_blog (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, date DATETIME DEFAULT (datetime('now', 'localtime')), post TEXT)", 
                (err) => {
                        
                        if(!err) {

                                query =`DELETE FROM tbl_blog`
                                db.run(query)

                                query1 =`INSERT INTO tbl_blog (title, post) VALUES ('sample blog test', '<p>contents<h2>body header</h2></p>')`
                                db.run(query1)

                                query2 =`INSERT INTO tbl_blog (title, post) VALUES ('꿈에 - 이정현', '<p>난 너무 가슴이 떨려요<h2>너무 좋아</h2></p>')`
                                db.run(query2)

                                let result = {
                                        rsp : 'ok'
                                }
                                db.all(
                                        `SELECT * FROM tbl_blog`,
                                        (err2, rows) => {
                                                if (!err2) {
                                                        
                                                        console.log(result)
                                                        if (rows) {
                                                                result.data = rows
                                                                console.log(result)
                                                        }
                                                        
                                                } else {
                                                        result.error = err.message
                                                        console.log(result)
                                                }
                                        }
                                )
                        }
                }
        )
        
}

module.exports.run = function (db, type) {
        if (type == TYPE.about_me) {
                fn_about_me(db)
        } else if ( type == TYPE.resume) {
                fn_resume(db)
        } else if ( type == TYPE.applications) {
                fn_applications(db)
        } else if ( type == TYPE.blog) {
                fn_blog(db)
        } else if ( type == TYPE.notification) {
                fn_notification(db)
        } 
}