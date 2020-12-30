const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_DB,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

