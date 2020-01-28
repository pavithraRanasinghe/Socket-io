const moment = require('moment');

var generateMessage = (from,text) =>{
  return{
      from,
      text,
      createdAt: moment().valueOf()
  }
};

var generateLocationMessage = (from,latitude,longitute)=>{
    return{
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitute}`,
        createdAt: moment().valueOf()
    }
};


module.exports = {generateMessage,generateLocationMessage};