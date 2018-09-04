require('dotenv').config();

const WebSocket = require('ws');
var crypto = require('crypto');
var hash = crypto.createHash('sha256').update("password").digest("hex");

const ws = new WebSocket(process.env.LINK_SERVER);

ws.on('open', function open() {
  console.log('connected');
  sendAuth();

});

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function incoming(data) {
  const msg = JSON.parse(data);
  if (!msg.hasOwnProperty("type") || !msg.hasOwnProperty("uri")) {
      console.log("Recieved Message Invalid: " + data);
      ws.close();
      return;
  }
  console.log("Recieved Message Valid "+data);
  
  switch  (msg.uri) {
      case "/auth":
        if (msg.body.hasOwnProperty("firstTimeSetup")) {
            if (msg.body.firstTimeSetup) {
                console.log("Set Password for the first time use");
                sendSetPassword();
                ws.close();
                return;
            }
        }
        console.log("Is Link Server setup.");
        console.log("Attempt to login.");
        sendLogin();
        break;
      case "/auth/login":
        if (noError(msg)) {
            console.log("Login successfull.");
            sendGetEndPoints();
        }
        break;

      case "/endpoints":
        if (noError(msg)) {
            console.log("End Points Received");
        }
        

      default:
        console.log(msg);      
  }
  

});

function noError(msg) {
    if (msg.type == "error") {
        console.log("Error")
        console.log(msg);
        ws.close();
        return false;
    }
    return true;
}

function sendAuth() {
    const data = { 
        uri: "/auth",
        type: "get",
        umid: "1"
      }
    
      ws.send(JSON.stringify(data));
}

function sendLogin() {
    const data = { 
        uri: "/auth/login",
        type: "execute",
        umid: "1",
        body: {
            password: "MariaTrezzi"
        }
      }
    
      ws.send(JSON.stringify(data));
}

function sendSetPassword() {
    const data = { 
        uri: "/auth/password",
        type: "set",
        umid: "1",
        body: {
            newPassword: "MariaTrezzi"
        }        
    }

    ws.send(JSON.stringify(data));
}

function sendGetEndPoints() {
    const data = { 
        uri: "/endpoints",
        type: "get",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}
