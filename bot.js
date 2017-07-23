console.log('Bot hazirlaniyor...');

var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);


var stream = T.stream('user');


function callbackHandler(id) { 
  T.post('direct_messages/destroy', {
    id: id
  }, function (err) {
    if (err) { console.error(err); }
 });
}

stream.on('direct_message', function (eventMsg) {
  var msg = eventMsg.direct_message.text;
  var screenName = eventMsg.direct_message.sender.screen_name;
  var msgID = eventMsg.direct_message.id_str;

  if (screenName === 'botkafa') {
    return callbackHandler(msgID);
  }

  else if(msg.startsWith("\"") && msg.endsWith("\""))  //if (msg.search('"*"') !== -1) 
  {
    msg= msg.replace(/"/g,"");
      msg= msg.replace("@","");
      
            
    return T.post('statuses/update', {
      status: msg
    }, function () {
      callbackHandler(msgID);
    });
  }
        

  else {
    return T.post('direct_messages/new', {
      screen_name: screenName,
      text: 'sadece tırnak içerisinde yazdıklarınızı okuyorum.'
    }, function () {
      callbackHandler(msgID);
    });
  }
});
