const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/parking',{
    useNewUrlParser:true,
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>console.log('DB Connect established'))
.catch(err=>console.log('DB Conection error: ',err))