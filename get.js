module.exports.setup = function (app, db) {
        app.get('/', (req, res, next) => {
                res.json({ 'rsp' : 'ok'})
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

        app.get('/db/applications', (req, res, next) => {
                let result = {
                        'rsp' : 'fail',
                }
                db.all('SELECT * FROM tbl_applications ORDER BY date desc', (err, rows) => {
                        if (!err) {
                                result.rsp = 'ok'
                                result.data = rows
                                res.json(result)
                                console.log(`${rows[0].name}`)
                        } else {
                                res.json(result)
                                console.log('Error Query')
                        }
                })
        })

        app.get('/db/notification/:id',(req, res, next) => {
                let result = {
                        rsp : "fail",
                }
                db.get(
                        `SELECT * FROM tbl_notification WHERE expiration > date('now') AND id > ${req.params.id} ORDER BY id desc`,
                        (err, row) => {
                                if (!err) {
                                        result.rsp = !row ? "nodata" : "ok"
                                        console.log(result)
                                        if (row) {
                                                result.data = row
                                                console.log(result)
                                        }
                                        res.json(result)
                                } else {
                                        result.error = err.message
                                        res.json(result)
                                }
                        }
                )
        })
}