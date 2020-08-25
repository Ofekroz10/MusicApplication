import multer = require('multer')

export const upload = multer({
    
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('please use [.jpg,.jpeg,.png] file'))
        }

        cb(null,true);
    }
}) 