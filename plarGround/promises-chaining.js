 require('../src/db/mongoose');
const User = require('../src/models/user');

 /* User.findByIdAndUpdate('5fd62e20453d6b227489094a',{email : 'rajalal@gmail.com'}).then((user)=>{
         console.log(user);
         return User.countDocuments({age : -1});
 }).then((count)=>{
    console.log(count);
 }).catch();
 */

   User.findByIdAndRemove('5fd465fa94e1f03ccc2fcf90').then((user)=>{
            console.log(user);
            return User.countDocuments({age : 50});
   }).then((count)=>{
         console.log(count);
   }).catch(e => {console.log(e)});
