/**
 * Created by lenovo on 2017/11/22.
 * 从MYSQL数据库中获取
 */

var mysql = require('mysql');
var fs = require('fs');
var config = require('./config.json');

function getFromMysqlDataInfo() {
    var SatID = "H8XX";
    var InstID = "AHIXX";
    var ProdName = "PRJ";
    var Resolution = 500;
    var _SQL = " SELECT  * FROM ProductInfo  " + " where  SatID ='" + SatID + "' and InstrumentName ='" + InstID + "' and ProductName ='" + ProdName + "' and Resolution =" + Resolution + " and IsExitFlag = 1 order by CreatTime desc" + " limit 1000";

    console.log(_SQL);
    var client = mysql.createConnection({
        "host": config.MYSQL.host,
        "user": config.MYSQL.user,
        "password": config.MYSQL.password,
        "database": config.MYSQL.database
    });

    client.connect();
    client.query(_SQL, function selectCb(err, results) {
        client.end();
        if (err) {
            res.end(JSON.stringify(err));
            next();
        }
        if (results) {
            var DataList = [];

            for (var i = 0; i < results.length; i++) {
                var item = results[i];
                if (item.EndTime) {
                    var pushItem = { begintime: item.StartTime, endtime: item.EndTime };
                    DataList.push(pushItem);
                }
            }
            console.log(DataList);
            fs.writeFileSync('PRJ.json', JSON.stringify(DataList));
        }
    });
    client.on('error', function (err) {
        if (err) {
            client.end();
        }
    });
}
getFromMysqlDataInfo();

//# sourceMappingURL=readMYSQL-compiled.js.map

//# sourceMappingURL=readMYSQL-compiled-compiled.js.map