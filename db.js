const sqlite3 = require("sqlite3").verbose();
let location = './db/database.db';

module.exports = {
    insert_command: function(user_id, command, datetime) {
        const db = get_db();
        let sql = `INSERT INTO stats (user_id, command, datetime) VALUES ('${user_id}', '${command}', '${datetime}')`;
        db.run(sql, [], (err, row) => {
            close_db(db);
            if (err) {
                console.log(err.message);
            }
        });
    },
    /*delete_team: function(name) {
        const db = get_db();
        let sql = `DELETE FROM teams WHERE name = '${name}'`;
        db.run(sql, [], (err, row) => {
            close_db(db);
            if (err) {
                console.log(err.message);
            }
        });
    },*/
    command_count: function(command) {
        const db = get_db();
        let sql = `SELECT COUNT(*) data FROM stats WHERE command = '${command}'`;
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
    user_command_count: function(user_id) {
            const db = get_db();
            let sql = `SELECT COUNT(*) data FROM stats WHERE user_id = '${user_id}'`;
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
        /*,
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
            }*/
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