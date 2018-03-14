"use strict"

// class demo{
//     // constructor(){
//     //     console.log("Object inistative..");
//     // }
    
//     async myfun1() {
//         console.log("This is My Function 1");
//        setTimeout(function(){
//         console.log("Function 1 Processing...");
//         return {'Name':'hellow'};
//        },2000);
       
//     }
//     async myfun2() {
//         console.log("This is My Function 2");
//         return {'Name':'hellow'};
//     }
// }

//module.exports = demo;

async function myfun (data,callback) { 
    // console.log(nm);
    // return callback(new Error("Invalid Data"));
    setTimeout(function(){
        return callback(null,'All Data');
    },1000);
};

module.exports = myfun;

