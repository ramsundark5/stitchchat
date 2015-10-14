var sqlite = require('../sqlite/sqlite3.ios');

class DBHelper{

    constructor(){
        this.db = null;
    }

    open(){
        let that = this;
        sqlite.open("messages.db", function (error, database) {
            if (error) {
                console.log("Failed to open database:", error);
                return;
            }
            that.db = database;
        });
    }

    executeSQL(){
        var sql = "SELECT a, b FROM table WHERE field=? AND otherfield=?";
        var params = ["somestring", 99];
        this.db.executeSQL(sql, params, this.rowCallback, this.completeCallback);
    }

    rowCallback(rowData) {
        console.log("Got row data:", rowData);
    }

    completeCallback(error) {
        if (error) {
            console.log("Failed to execute query:", error);
            return
        }
        console.log("Query complete!");
        database.close(function (error) {
            if (error) {
                console.log("Failed to close database:", error);
                return
            }
        });
    }

}

module.exports = new DBHelper();