var express = require('express');
var app = express();
const scrapper = require("./index")

app.get('/ping', function (req, res) {
    res.end( "Successfull!!!" );
})

app.post('/stockDetails', async function (req, res) {
    var stockId = req.query.stockId;
    try{
        if (stockId){
            await scrapper.testHandler(stockId)
        }
        res.end()
    } catch (error) {
        res.status(error.status || 500);
        res.json({
            error: {
                stockId : stockId,
                message: error.message,
            },
        });
    }
    
})

var server = app.listen(9000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})