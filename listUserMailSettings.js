require('dotenv').config();
const https = require('https');
const AuthenticationContext = require('adal-node').AuthenticationContext;


var token = "";

const authenticationContext = new AuthenticationContext(process.env.ADAL_AUTHORITY);

authenticationContext.acquireTokenWithClientCredentials("https://graph.microsoft.com/", process.env.ADAL_CLIENTID, process.env.ADAL_CLIENTSECRET, tokenResponse);


function tokenResponse(err, tokenResponse) {
    if (err) {
        console.log('Unable to authenticate with Microsoft Graph Tenant: ' + err.stack);
    } else {
        token = tokenResponse.accessToken;
        
        const options = {
            hostname: 'graph.microsoft.com',
            port: 443,
            path: '/v1.0/users/735844c9-4d54-4e66-8b98-9be943c5e975/mailboxSettings/timeZone',
            method: 'GET',
            headers: {authorization: 'Bearer ' + token}

          };

        getData(options);
    }
}

function getData(options) {
    https.get(options, getResponse).on("error", (err) => {
        console.log("Error: " + err.message);
      });
}

function getResponse(resp) {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.parse(data));
    });
}