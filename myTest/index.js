var express = require('express');
var bodyParser      = require('body-parser');
 
// sessions        = require('./routes/sessions'),
app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: true
}));
// app.use(methodOverride());      // simulate DELETE and PUT

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
// });


//let demo = require('./Controllers/demo');
//let demoObj =new demo();
// console.log("My function :",demoObj.myfun());
// getData();

app.get('/',function(req, res, next){
   // getData();
   res.send("Hellow Test");
})
let demo = require('./Controllers/demo');

getData();

async function getData(){
    let d = await demo('Himanshu Raval',function(err,data){
        if(err){ console.log("Error :->",err); }
        console.log("Cllback",data);
        return data;
    });
    
    
    console.log("Data 1->",d);
   
    

  //  let responce1 = await demoObj.myfun1();
   // let responce2 = await demoObj.myfun2();
    // console.log("Data Return 1 ",responce1);
    // console.log("Data Return 2 ",responce2);
}

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
