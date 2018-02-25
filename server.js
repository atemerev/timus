let express = require('express')
let bodyparser = require('body-parser')
let sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./main.db')

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS events(timestamp INTEGER, tag TEXT, content TEXT)")
    db.run("CREATE INDEX IF NOT EXISTS idx_events_tag_timestamp ON events(tag, timestamp)")
})

let insert = db.prepare("INSERT INTO events (timestamp, tag, content) VALUES (?, ?, ?)")
let select = db.prepare("SELECT timestamp, content FROM events WHERE timestamp > ? AND timestamp <= ? AND tag = ?")

let app = express()
app.use(bodyparser.json({type: '*/*'}))

app.post('/put/:tag', (req, res) => {
    let tag = req.params.tag
    let content = req.body
    let timestamp = Date.now()

    insert.run(timestamp, tag, JSON.stringify(content))

    res.json({'time': timestamp})
})

app.get('/get/:tag/:from/:to', (req, res) => {
    let tag = req.params.tag
    let from = req.params.from
    let to = req.params.to

    res.header('Content-Type', 'application/x-ndjson')

    select.each(from, to, tag, (err, row) => {
        let data = {
            'time': row.timestamp,
            'content': JSON.parse(row.content)
        }
        res.write(JSON.stringify(data) + '\n')
    }, () => res.end())
})

app.listen(3000)