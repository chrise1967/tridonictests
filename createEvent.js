require('dotenv').config();
const https = require('https');
const AuthenticationContext = require('adal-node').AuthenticationContext;

setTimeout(doit, 3000);

function doit() {




var token = "";

const authenticationContext = new AuthenticationContext(process.env.ADAL_AUTHORITY);

authenticationContext.acquireTokenWithClientCredentials("https://graph.microsoft.com/", process.env.ADAL_CLIENTID, process.env.ADAL_CLIENTSECRET, tokenResponse);

}

function tokenResponse(err, tokenResponse) {
    if (err) {
        console.log('Unable to authenticate with Microsoft Graph Tenant: ' + err.stack);
    } else {
        token = tokenResponse.accessToken;

        const post_data = JSON.stringify({
            "subject": "Let's go for lunch",
            "body": {
              "contentType": "HTML",
              "content": "Does late morning work for you?"
            },
            "start": {
                "dateTime": "2018-09-20T12:00:00",
                "timeZone": "GMT Standard Time"
            },
            "end": {
                "dateTime": "2018-09-20T14:00:00",
                "timeZone": "GMT Standard Time"
            },
            "location":{
                "displayName":"Harry's Bar"
            }
          });
      
        
        const options = {
            hostname: 'graph.microsoft.com',
            port: 443,
            path: '/v1.0/users/735844c9-4d54-4e66-8b98-9be943c5e975/events',
            method: 'POST',
            headers: {
                authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(post_data)
            }

          };

        postData(options, post_data);
    }
}

function getResponse(resp) {
    let data = '';
    resp.on('error', (err) => {console.log("Error: " + err.message)});

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        console.log("data");
      data += chunk;
    });
  
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.parse(data));
    });
}

function postData(options, post_data) {
    console.log("Post Data");
    const req = https.request(options, getResponse);
    req.write(post_data);
    req.end();
}