var express = require('express');
var app = express();
const scrapper = require("./index")

app.get('/ping', function (req, res) {
    res.end( "Successfull!!!" );
})

app.post('/stockDetails', function (req, res) {
    var stockId = req.query.stockId;
    if (stockId){
        scrapper.testHandler(stockId)
    }
})

var server = app.listen(9000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})