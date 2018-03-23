var debug = require('debug')('AppSource:Wheel:Socket:Spin');
module.exports = function (socket) {
    var client = Game.Io.engine.clients[socket.id];
    socket.on('getSpinWheel', function (data, callback) {
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ getSpinWheel EVENT RECEIVED +');
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.AppSource.Wheel.Controllers.Spin.getSpinWheel(client._userData.id)
            .then(function (spin) {
                var spinData = spin.spinData;
                var multiplayer = 1000;
                var rand = Math.floor(Math.random() * 10000) + 1;
                var totalChance = 0;
                let winning_number = 10;
                if(spin.spinType == 'paid'){
                     winning_number = 1000;
                }

               // console.log("rand",rand);
                
                // let found = false;
                // spinData.forEach(function(spn){
                //     //if (!found) {
                //         let rang = parseFloat(spn.percent) * parseInt(multiplayer);
                //         console.log("rang :",rang);
                //         totalChance = totalChance + rang;
                //          if (totalChance >= rand) {
                //             winning_number = spn.value;
                //             found = true;

                //         }
                //     //}
                // });
          
                /** New Code Start */





                function shuffle(array) {
                var currentIndex = array.length, temporaryValue, randomIndex;
                    while (0 !== currentIndex) {
                      randomIndex = Math.floor(Math.random() * currentIndex);
                      currentIndex -= 1;
                      temporaryValue = array[currentIndex];
                      array[currentIndex] = array[randomIndex];
                      array[randomIndex] = temporaryValue;
                    }
                    return array;
                }
                let mainArray = Array();
                                  
                spinData.forEach(function(spn){
                    console.log("spn.percent ==",spn.percent);
                    let per = parseFloat(spn.percent) < 1 ? 1 : parseFloat(spn.percent);
                        let rang = per * parseInt(multiplayer);
                        console.log("rang ==",rang);
                         var arrPer = Array.apply(null, {length: rang}).map(Number.call, Number).fill(spn.value);
                        mainArray = mainArray.concat(arrPer);
                });

                mainArray = shuffle(mainArray);
                if(mainArray[rand] != undefined){
                    winning_number = mainArray[rand];
                  //  console.log("winning_number ::: ",winning_number);
                }

                /** New Code End  */
            

                // var spin_arr = [];
                // spinData.forEach(function(spn){
                //     let count = parseInt(spn.percent);
                //     for(i=1;i<=count;i++){
                //         spin_arr.push(spn.value);
                //     }
                // });

                // var rand = Math.floor(Math.random() * 100) + 1;
                // let winning_number = (spin_arr[rand])? spin_arr[rand] : (spin.spinType == 'paid')? 1000 : 10;

                // var spinobj = [];
                // for (i = 0; i < spinData.length; ++i) {
                //     if (0 < Number(spinData[i]['remaining'])) {
                //         spinobj.push(spinData[i]);
                //     }
                // }
                // var number = Math.floor((Math.random() * spinobj.length) + 1);
                // var winning_number = spinobj[number]['value'];
                 
                return callback({
                    status: '200',
                    result: spinData,
                    type: spin.spinType,
                    winning_number: winning_number,
                    message: 'All Spin list.'
                });

            }, function (err) {
                return callback({
                    status: '500',
                    result: err,
                    message: 'Something is went wrong. please try again later.'
                });

            });

    });
    /**
     * Update Remain Value 
     */
    socket.on('updateRemaining', function (data, callback) {
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.Logger.debug('+ UPDATE WHEEL REMAIN +', data);
        Game.Logger.debug('++++++++++++++++++++++++++++++++++++++++++++');
        Game.AppSource.Wheel.Controllers.Spin.updateRemaining(data, client._userData)
            .then(function (spin) {
                return callback({
                    status: '200',
                    result: '',
                    message: 'Spin Remaining Updated.'
                });
            }, function (err) {
                return callback({
                    status: '500',
                    result: err,
                    message: 'Something Went Wrong'
                });

            });
    });
}
