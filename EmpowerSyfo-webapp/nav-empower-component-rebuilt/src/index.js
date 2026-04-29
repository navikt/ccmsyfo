import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import Cookies from 'universal-cookie';

import {AlertStripeFeil} from 'nav-frontend-alertstriper';
import './index.css';
import EditorApiComponent from "./EditorApiComponent";
import InputFormComponent from "./InputFormComponent";
import LoginComponent from "./LoginComponent";
import axios from "axios";

export default InputFormComponent;

let otdsUrl;
let client_id;
let client_secret;
let scope;
let uname;
let pass;
let access_token;
let csrfCookie;
let csrfHeader;
let csrfToken;
let jsessionId;
let otds_ticket;
let csUrl;
let documentMetadata;
let statusCode = '';
let errorMessage = '';
let resource;
let userIsAuthorizedToEditEmpowerDocuments = "false";
let ewsWsdlLocation;
let ewsPreviewFileName;
let ewsPreviewPubFile;
let ewsPreviewUsers;
const cookies = new Cookies();

// default empowerUrl, it is actually not used but overwritten with a real value later down in Axios.get call
let empowerUrl = "http://localhost:8080/empower";
const username = "user";
const password = "uuu";
const queryString = window.location.search; 
const urlPm = new URLSearchParams(queryString);
const documentid = urlPm.get('docId');
const userfromAdressBar = urlPm.get('uid');


function ferdigstillFunction() {
    console.log("ferdigstillFunction() started");
    ReactDOM.render(<InputFormComponent empowerUrl={empowerUrl} uname={username} pass={password} submitFn={submitFn} />, document.getElementById('root'));
    console.log("ferdigstillFunction() finished");
};


function submitFn(documentId) {
    console.log("submitFn() started: " + documentId);
    if (documentId) {
       ReactDOM.render(<EditorApiComponent applicationUrl={applicationLocation} empowerHost={empowerUrl} docId={documentId} showUserLogs ferdigstillFunction={ferdigstillFunction} enableDelete />, document.getElementById('root'));
    }
    console.log("submitFn() finished.");
}


const applicationLocation = window.location.origin + "/" + window.location.pathname.split('/')[1];
let applicationUrl = new URL(applicationLocation);



async function loginOTDSFn(uname1, pass1) {
    console.group("Login to OTDS, username: " + uname);
    if (uname1 && pass1) {
        //const axios = require('axios');
        const qs = require('qs');
        const data = qs.stringify({
            'grant_type': 'password',
            'username': uname1,
            'password': pass1,
            'client_id': client_id,
            'client_secret': client_secret,
            'scope': scope
        });
        const config = {
            method: 'get',
            url: applicationUrl + '/api/v1/Login'
        };
        console.log("Send GET request via SYFO backend to OTDS to receive access token: " + config.url);
        await axios(config)
        .then(async function (response) {
            console.log("OTDS Access token (Bearer) received. ");
        //	document.getElementById("passfeil").style.display = "none";
        //    await getSecurityTokenWithAuth(response.data.access_token);
            access_token = response.data.access_token;

        })
        .catch(async function (error) {
            console.log("An error occurred when receiving access token from OTDS!");
        //	document.getElementById("passfeil").style.display = "block";
        	console.log(error);
        });
    }
    console.groupEnd();
}


async function getSecurityTokenWithAuth(access_token) {
    console.group("Getting Empower security token with access token");

    // skip the request if the user is not authorized
    if (userIsAuthorizedToEditEmpowerDocuments === 'true') {
        //const axios = require('axios');
        const config = {
            method: 'post',
            url: applicationUrl + '/api/v1/GetSecurityToken',
            headers: {
                'Content-Type': 'text/plain',
                'user': userfromAdressBar,
                'isAuthorized': userIsAuthorizedToEditEmpowerDocuments
            },
            data: access_token,
            withCredentials: true
        };
        console.log("Send POST request with OTDS access_token to SYFO backend to receive Empower security token (X-CSRF-TOKEN) with session cookies from OTDS: " + config.url);
        await axios(config)
            .then(function (response) {
                console.log("The security token (CSRF) received.");
                const token = response.data;
                csrfCookie = token.body.csrfCookie;
                csrfHeader = token.body.csrfHeader;
                csrfToken = token.body.csrfToken;
                jsessionId = token.jsessionId;
                console.log(csrfHeader + ": ", csrfToken);
                // not necessary, it's here during the testing
                //cookies.set('sessionId', sessionId, { path: empowerUrl.pathname, sameSite: "none", secure: true });


                /*
                const config = {
                    method: 'get',
                    url: empowerUrl + '/login',
                    headers: {
                        'Content-Type': 'text/plain',

                    },
                    data: access_token,
                    withCredentials: true
                };
                axios(config).then(response => {
                    console.log("getToken() from empower");
                })
                */
                //ReactDOM.render(<EditorApiComponent access_token={access_token} applicationUrl={applicationLocation} empowerHost={empowerUrl} uname={uname} userfromAdressBar={userfromAdressBar} docId={documentid} false ferdigstillFunction={ferdigstillFunction} enableDelete />, document.getElementById('root'));
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        console.log("Getting Empower security token is skipped as the user is NOT authorized to access Empower documents!");
    }

    console.groupEnd();
}

function getEmpowerSecurityTokenWithoutAuth() {
    console.log("getEmpowerSecurityTokenWithoutAuth() started.");
    //const axios = require('axios');
    const config = {
        method: 'get',
        url: empowerUrl + '/resource/GetToken',
        headers: {
            'Accept': 'application/json'
        },
        withCredentials: true
    };
    console.log("Send GET request to Empower to receive security token: " + config.url);
    axios(config)
        .then(function (response) {
            console.log("The Empower security token received.");
            console.log("Opening EditorApiComponent.");
            ReactDOM.render(<EditorApiComponent access_token={access_token} applicationUrl={applicationLocation} empowerHost={empowerUrl} uname={uname} userfromAdressBar={userfromAdressBar} docId={documentid} false ferdigstillFunction={ferdigstillFunction} enableDelete />, document.getElementById('root'));
        })
        .catch(function (error) {
            console.log("An error occurred when getting the security token from Empower");
            console.error(error);
            console.log("Opening LoginComponent.");
            ReactDOM.render(<LoginComponent applicationUrl={applicationLocation} empowerUrl={empowerUrl} otdsUrl={otdsUrl} userID={userfromAdressBar} loginFn={loginOTDSFn} />, document.getElementById('root'));
        });
    console.log("getSecurityTokenWithoutAuth() finished.");
}

async function getDocumentMetadata() {
    console.group("Getting document metadata for docId: " + documentid);

    // skip the request if the user is not authorized - testing what happens when it's completely skipped
    if (userIsAuthorizedToEditEmpowerDocuments === 'truexx') {

        //const axios = require('axios');
        const qs = require('qs');
        const data = qs.stringify({
            'docId': documentid,
            'bearerToken': access_token
        });
        const config = {
            method: 'post',
            url: applicationUrl + '/api/v1/GetDocumentMetadata',
            headers: {
                // 'Content-Type': 'text/plain'
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data,
            withCredentials: true
        };
        console.log("Send POST request to SYFO backend to receive document metadata: " + config.url);
        await axios(config)
            .then(function (response) {
                console.log("The document metadata received.");
                documentMetadata = response.data;
            })
            .catch(function (error) {
                console.log("The document metadata could not be received.");
                console.log(error);
            });
    } else {
        console.log("Getting document metadata through SYFO backend has been skipped.");
    }
    console.groupEnd();
}

async function getOTDSTicket() {
    console.group("Getting OTDS Ticket");
    //const axios = require('axios');

    const config = {
        method: 'get',
        url: applicationUrl + '/api/v1/GetOTDSTicket',
        withCredentials: true
    };
    console.log("Send GET request to SYFO backend to receive OTDS ticket: " + config.url);
    await axios(config)
        .then(function (response) {
            console.log("A new OTDS ticket received.");
            otds_ticket = response.data.ticket;
        })
        .catch(function (error) {
            console.log(error);
        });
    console.groupEnd();
}

// Function to filter oTMemberOf values and check if any value contains the resource
function filterOTMemberOfAndCheckResource(data) {
    // Filter for objects where name is 'otMemberOf'
    const oTMembersOf = data.filter(item => item.name === "oTMemberOf")
        .map(item => item.values[0]); // Get only the values
    console.log(oTMembersOf);
    // Check if any of the values contain the string from the resource
    //oTMembersOf.forEach(item => {console.log(item + "  " + (typeof item === "string") + "  " + (typeof item)  )})
    return oTMembersOf.some(values => typeof values === "string" && values.includes(resource));
}

async function getOTDSUser() {
    console.group("Getting OTDS user properties");
    //const axios = require('axios');

    const config = {
        method: 'get',
        url: applicationUrl + '/api/v1/GetOTDSUser',
        params: {
            'OTDSTicket': otds_ticket,
            'user': userfromAdressBar},
        withCredentials: true
    };
    console.log("Send GET request to SYFO backend to receive an OTDS user properties: " + config.url);
    await axios(config)
        .then(function (response) {
            console.log("The OTDS user properties received. The membership in 'oTMemberOf' will be checked now.");
            if( filterOTMemberOfAndCheckResource(response.data.values) ) {
                console.log("Verified OK, the user '" + userfromAdressBar + "' is authorized to edit the Empower document");
                userIsAuthorizedToEditEmpowerDocuments = "true";
            } else {
                console.log("Verified not OK, the user '" + userfromAdressBar + "' is NOT authorized to edit the Empower document. The Empower login window will appear.");
            }
        })
        .catch(function (error) {
            if (error.response && error.response.status === 404) {
                console.log("The user '" + userfromAdressBar + "' could NOT be found in OTDS. Editing the Empower document is not allowed!");
                statusCode = "404";
                errorMessage = "The user '" + userfromAdressBar + "' could NOT be found in OTDS. Editing the Empower document is not allowed!";
            } else {
                console.log(error);
            }
        });
    console.groupEnd();
}

// Here the application starts
console.log("SYFO Application v2.0.2 started. URL: " + applicationUrl.href);
console.log("Send GET request to SYFO backend to receive Empower location and OTDS properties: " + applicationUrl + "/api/v1/GetProperties ");
Axios.get(applicationUrl + "/api/v1/GetProperties", {withCredentials: false}).then((response) => {
    console.group("Empower location and OTDS properties received.")
    empowerUrl = response.data.empowerLocation;
    csUrl = response.data.csUrl;
	otdsUrl = response.data.otds.url;
	client_id = response.data.otds.client_id;
	client_secret = response.data.otds.client_secret;
	scope = response.data.otds.scope;
    uname = response.data.otds.apiUserName;
    pass = response.data.otds.apiPassword;
    resource = response.data.otds.resource;
    ewsWsdlLocation = response.data.ewsWsdlLocation;
    ewsPreviewFileName = response.data.ewsPreviewFileName;
    ewsPreviewPubFile = response.data.ewsPreviewPubFile;
    ewsPreviewUsers = response.data.ewsPreviewUsers;
	console.info("Empower URL: " + empowerUrl);
	console.info("OTDS URL: " + otdsUrl);
    console.info("OTDS ApiUserName: " + uname);
    console.info("OTDS Resource: " + resource);
    console.info("Communication Server URL: " + csUrl);
    const currTime = new Date().toLocaleTimeString();
    cookies.set('syfo', '2.0.2 ' + currTime, { path: '/', sameSite: 'none' });
    console.groupEnd();
	/*
	    ReactDOM.render(<InputFormComponent empowerUrl={empowerUrl} uname={username} pass={password} submitFn={submitFn} />, document.getElementById('root'));               
	                   })
	                .catch(err => {
	                console.log("Something wrong with getting the empower location...");
	                console.log(err);
	                ReactDOM.render(<AlertStripeFeil  className="alertstripe nav-empower-frontend-alertstripe panel-mixin" >Code: {err.response.status}<br/></AlertStripeFeil>, document.getElementById('root'));
	                
	                });
	*/

    loginOTDSFn(uname, pass).then(async Function => {
       // 24.04.2025 - stop calling getEmpowerSecurityTokenWithoutAuth() but opening directly the EditorApiComponent
       //getEmpowerSecurityTokenWithoutAuth();
        await getOTDSTicket().then(async r => {
            await getOTDSUser().then(async user => {
                await getSecurityTokenWithAuth(access_token).then(async r => {
                        await getDocumentMetadata().then(r => {

                            console.log("Opening EditorApiComponent.");
                            ReactDOM.render(<EditorApiComponent access_token={access_token}
                                                                otds_ticket={otds_ticket}
                                                                csrf_header={csrfHeader}
                                                                csrf_token={csrfToken}
                                                                applicationUrl={applicationLocation}
                                                                csUrl={csUrl}
                                                                empowerHost={empowerUrl}
                                                                uname={uname}
                                                                userfromAdressBar={userfromAdressBar}
                                                                docId={documentid}
                                                                userId={userfromAdressBar}
                                                                showUserLogs={false}
                                                                ferdigstillFunction={ferdigstillFunction}
                                                                enableDelete={true}
                                                                documentMetadata={documentMetadata}
                                                                statusCode={statusCode}
                                                                errorMessage={errorMessage}
                                                                ewsWsdlLocation={ewsWsdlLocation}
                                                                ewsPreviewFileName={ewsPreviewFileName}
                                                                ewsPreviewPubFile={ewsPreviewPubFile}
                                                                ewsPreviewUsers={ewsPreviewUsers}
                            />, document.getElementById('root'));

                        });
                    });
            });
        });





    });




}).catch(err => {
			console.log("An error occurred when getting the empower location!");
			console.log(err);
			ReactDOM.render(<AlertStripeFeil  className="alertstripe nav-empower-frontend-alertstripe panel-mixin" >Code: {err.response.status}<br/></AlertStripeFeil>, document.getElementById('root'));
	});    
    /*  // It is something I kept from the old function
    ReactDOM.render(<EditorApiComponent applicationUrl={applicationLocation} empowerHost={empowerUrl} docId={documentId} showUserLogs ferdigstillFunction={ferdigstillFunction} enableDelete />, document.getElementById('root'));
			})
			.catch(err => {
			console.log("Something wrong with getting the empower location...");
			console.log(err);
			ReactDOM.render(<AlertStripeFeil  className="alertstripe nav-empower-frontend-alertstripe panel-mixin" >Code: {err.response.status}<br/></AlertStripeFeil>, document.getElementById('root'));			
			});
	*/
