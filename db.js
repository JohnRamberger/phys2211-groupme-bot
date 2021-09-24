const sqlite3 = require("sqlite3").verbose();
let location = './db/database.db';

module.exports = {
    team_exists: function(name) {
        const db = get_db();
        let sql = `SELECT * FROM teams WHERE name = '${name}'`;
        return new Promise((resolve, reject) => {
            db.get(sql, [], (err, row) => {
                close_db(db);
                if (err) {
                    reject(err.message);
                }
                resolve(row);
            });
        });
    },
    insert_team: function(name) {
        const db = get_db();
        let sql = `INSERT INTO teams (name) VALUES ('${name}')`;
        db.run(sql, [], (err, row) => {
            close_db(db);
            if (err) {
                console.log(err.message);
            }
        });
    },
    delete_team: function(name) {
        const db = get_db();
        let sql = `DELETE FROM teams WHERE name = '${name}'`;
        db.run(sql, [], (err, row) => {
            close_db(db);
            if (err) {
                console.log(err.message);
            }
        });
    },
    get_team: function(name, tag) {
        const db = get_db();
        let sql = `SELECT ${tag} data FROM teams WHERE name = '${name}'`;
        return new Promise((resolve, reject) => {
            db.get(sql, [], (err, row) => {
                close_db(db);
                if (err) {
                    reject(err.message);
                }
                resolve(row.data);
            });
        });
    },
    update_team: function(name, tag, value) {
        const db = get_db();
        let sql = `UPDATE teams SET ${tag} = '${value}' WHERE name = '${name}'`;
        db.run(sql, [], (err, row) => {
            close_db(db);
            if (err) {
                console.log(err.message);
            }
        });
    },
    get_all_teams: function() {
        const db = get_db();
        let sql = `SELECT name name FROM teams`;
        return new Promise((resolve, reject) => {
            db.all(sql, (err, rows) => {
                close_db(db);
                if (err) {
                    reject(err.message);
                }
                let results = [];
                rows.forEach(row => {
                    results.push(row.name);
                });
                resolve(results);
            });
        });
    },
    team_count: function() {
        const db = get_db();
        let sql = `SELECT COUNT(*) data FROM teams`;
        return new Promise((resolve, reject) => {
            db.get(sql, [], (err, row) => {
                close_db(db);
                if (err) {
                    reject(err.message);
                }
                resolve(row.data);
            });
        });
    }
}

function get_db() {
    let db = new sqlite3.Database(location, (err) => {
        if (err) {
            console.error(err.message);
        }
        //console.log("connected to database");
    });
    return db;
}

function close_db(db) {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        //console.log("disconnected from database");
    });
}