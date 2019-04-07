const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/shipping"); 
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
 db.once("open", function(callback) {
     console.log("Connection succeeded.");
});

var Schema = mongoose.Schema;

var shippingSchema = new Schema({
    date: Date,
    vessel: String,
    group: String,
    type: String,
    country: String,
    port: String,
    insp: String,
    company_insp: String
});

var Shipping = mongoose.model('Shipping', shippingSchema);


app.get('/', (request, response) =>  response.sendFile(__dirname+"/form.html"));
app.post('/ship_data', (request, response) => {
    var data = new Shipping(request.body);
    data.save()
    .then(item => {
      console.log("item saved to database");
    })
    .catch(err => {
      console.log("unable to save to database");
    });
    response.setHeader("Content-Type", "text/html");
    response.render('Displaydata', {
      vessel:request.body.vessel,
      country:  request.body.country
   });

});

app.listen(3000, () => console.info('Application running on port 3000'));