module.exports = function(app) {
    var multer = require('multer');
    var fileService = require('../service/file.service')
    var insertedFile={};
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            fileName = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
            fileObject = {path:fileName,altValue:file.originalname,type:1}
            fileService.create(fileObject,function(res,err){
                console.log(res);
                insertedFile = res.dataValues;
                cb(null, fileName);
            })
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

                
app.post('/api/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        console.log(insertedFile);
        
         res.json({error_code:0,err_desc:null,insertedFile:insertedFile});
    });
});

}