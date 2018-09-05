require('dotenv').config();

const WebSocket = require('ws');
var crypto = require('crypto');
var hash = crypto.createHash('sha256').update("D0rnB1rn#").digest("hex");

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
  //
  //console.log("Recieved Message Valid "+data);
  
  switch  (msg.uri) {
      case "/stop":
        ws.close();
        break;

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
            
            sendGetServer();
            sendGetLocation();
            sendGetSections();
            sendGetGroups();
            sendGetScenes();
            sendGetEndPoints();
            sendGetDevices();
            sendGetRecipes();
            
            sendStop();
        }
        break;

      case "/xxxendpoints":
        if (noError(msg)) {
            console.log("End Points Received");

            /*
            if (msg.umid == "1001") {
                for (key in msg.body.objects) {
                    var endpoint = msg.body.objects[key];

                    if (endpoint.type=="SENSOR") {
                    console.log(endpoint.type + " " + endpoint.id + " " + endpoint.OCCUPANCY.percent);
                    //  console.log(endpoint);
                    sendSubscribeToEndpoint(endpoint.id);
                    }
                    
                }
            
            }
            */
                

        }
        //ws.close();
        break;

      case "/xxxdevices":
        if (noError(msg)) {
            console.log("Devices Received");
            console.log(data);
            /*
            for (key in msg.body.objects) {
                var device = msg.body.objects[key];

                if (device.deviceType=="SENSOR") {
                    console.log(device.deviceType + " " + device.id + " " + device.endpointId);
                  //  console.log(endpoint.type + " " + endpoint.id + " " + endpoint.OCCUPANCY.percent);
                  //  console.log(endpoint);
                }
                
            }
            */

        }
        
        break;

      default:
        console.log("--START----------------");
        console.log(data);
        console.log("--END----------------");
        //ws.close();  
  }
  

});

function noError(msg) {
    if (msg.type == "ERROR") {
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
            password: hash
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
            newPassword: hash
        }        
    }

    ws.send(JSON.stringify(data));
}

function sendGetEndPoints2() {
    const data = { 
        uri: "/endpoints/a50631f4-57f6-404e-8fc9-c6f580beec9e/capabilities/IDENTIFY/flash",
        type: "execute",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}

function sendGetEndPoints22() {
    const data = { 
        uri: "/endpoints/a50631f4-57f6-404e-8fc9-c6f580beec9e/capabilities/IDENTIFY/flash",
        type: "execute",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}


function sendGetEndPoints() {
    const data = { 
        uri: "/endpoints",
        type: "get",
        umid: "1001",
    }

    ws.send(JSON.stringify(data));
}

function sendGetDevices() {
    const data = { 
        uri: "/devices",
        type: "get",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}

function sendSubscribeToAllEndPoints(endpointId) {
    const data = { 
        uri: "/endpoints",
        type: "subscribe",
        umid: "3000",
    }
    console.log(data);
    ws.send(JSON.stringify(data));
}

function sendSubscribeToEndpoint(endpointId) {
    const data = { 
        uri: "/endpoints/" + endpointId,
        type: "subscribe",
        umid: "2000",
    }
    console.log(data);
    ws.send(JSON.stringify(data));
}

function sendGetLocation() {
    const data = { 
        uri: "/location",
        type: "get",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}

function sendGetGroups() {
    const data = { 
        uri: "/groups",
        type: "get",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}

function sendGetScenes() {
    const data = { 
        uri: "/scenes",
        type: "get",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}

function sendGetServer() {
    const data = { 
        uri: "/server",
        type: "get",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}

function sendGetSections() {
    const data = { 
        uri: "/sections",
        type: "get",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}

function sendGetRecipes() {
    const data = { 
        uri: "/recipes",
        type: "get",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}

function sendStop() {
    const data = { 
        uri: "/stop",
        type: "get",
        umid: "1",
    }

    ws.send(JSON.stringify(data));
}