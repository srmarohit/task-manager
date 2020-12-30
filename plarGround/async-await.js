const add = (a,b) => {
     return new Promise((resolve,reject) => {
         setTimeout(()=>{
                if(b < 0){
               return reject("Number must be non-negative");
                  }
                resolve(a+b);
         },2000);
     });
}

const doWork = async ()=>{
       const sum1 = await add(1,5);
       const sum2 = await add(1,-sum1);
       const sum3 = await add(sum2,5);

       return sum3 ;
}

doWork().then((result)=>{
        console.log("result :"+result);
}).catch((e)=>{
       console.log("Error : "+e);
       console.log("End Promise ");
});

/*   Program will not going to CRASH while any ERROR occured there.*/