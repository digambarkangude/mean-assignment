const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const mongodb = require('mongodb');
const mongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const { Readable } = require('stream'); 

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname+'/'))); 
var user_picture = '';

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');


app.get('/',(req, res)=>{
	res.sendFile(__dirname+'/index.html');
});


var db = '';

mongoClient.connect('mongodb://localhost:27017/mean',(err, res)=>{
	if(err){
		console.log(err);
	}
	db = res;
	app.listen('3000',()=>{
		console.log('Server started on port 3000.');
	});

})

app.get('/list',(req, res)=>{
	db.collection("users").find().toArray((err, result)=>{
		if(err){
			console.log(err);
		}
		res.json(result);
	});
});

app.get('/getByID/:id',(req, res)=>{
	var uId = new mongodb.ObjectID(req.params.id);
	db.collection("users").findOne({_id:uId},(err, result)=>{
		if(err){
			console.log(err);
		}
		res.json(result);
		//console.log(util.inspect(result,{depth:1}));
	});
});

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    var exceltojson;
    upload(req,res,function(err){
        if(err){
           res.json({error_code:1,err_desc:err});
           return;
       }
       /** Multer gives us file info in req.file object */
       if(!req.file){
        res.json({error_code:1,err_desc:"No file passed"});
        return;
    }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
             if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    //console.log(result);
                    //res.json({error_code:0,err_desc:null, data: result});
                    console.log ("Number of entries", result.length);
                    if(result.length>0){
                    	var final_obj = [];
                      for( let key in result){
                        var temp_arr = {};
                        for( let k in result[key]){
                            let key_arr = k.split(".");
                            if(key_arr.length>1){
                                if(!temp_arr.hasOwnProperty(key_arr[0]))
                                    temp_arr[key_arr[0]]={};
                                temp_arr[key_arr[0]][key_arr[1]] = result[key][k];
                            }else{
                                temp_arr[k] = result[key][k];
                            }
                            final_obj.push(temp_arr);
                        }
                    }
                    //console.log(JSON.stringify(final_obj));
                    collection = db.collection('users');
                    collection.insertMany(final_obj, { ordered : false });
                    res.redirect('/#/upload');
                }
            });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })

});
