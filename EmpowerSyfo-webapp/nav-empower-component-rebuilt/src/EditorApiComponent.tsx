import React, {Component} from "react";
import * as uuid from "uuid";
import {format} from "date-fns";
import NavEmpowerComponent from "./NavEmpowerComponent";
import {decode as base64_decode, encode as base64_encode} from 'base-64';
import isFunction from './isFunction'
import axios from 'axios'
import Axios, {AxiosResponse} from 'axios'

type editorApiPathProps = {
	access_token: string,
	otds_ticket: string;
	csrf_header: string;
	csrf_token: string;
	applicationUrl: string,
    path: string,
	csUrl: string;
    ferdigstillFunction?: Function,
	ferdigstillFunctionLokalPrint?: Function,
	ferdigstillFunctionMellomlagre?: Function,
	ferdigstillFunctionGodkjenn?: Function,
	ferdigstillFunctionRetuner?: Function,
	send2LOGthroughRestApi?: Function,
    enableDelete: boolean,
	uname: string,
	userfromAdressBar: string,
	statusCode: string,
	errorMessage: string,
	showVeiledning: boolean
};

type editorApiOptionProps = {
	access_token: string,
	otds_ticket: string,
	csrf_header: string,
	csrf_token: string,
	applicationUrl: string,
	csUrl: string,
    empowerHost: string,
    version?: string,
    locale?: string,
    docId: string,
	userId: string,
    showUserLogs: string | boolean,
    documentNumber?: string | number,
    page?: string | number,
    ferdigstillFunction?: Function,
	ferdigstillFunctionLokalPrint?: Function,
	ferdigstillFunctionMellomlagre?: Function,
	ferdigstillFunctionGodskjenn?: Function,
	ferdigstillFunctionReturner?: Function,
    enableDelete: boolean,
	userfromAdressBar: string,
	documentMetadata: documentMetadata,
	statusCode: string,
	errorMessage: string,
	ewsWsdlLocation: string,
	ewsPreviewFileName: string,
	ewsPreviewPubFile: string,
	ewsPreviewUsers: string,
	showVeiledning: boolean
};

export type editorApiState = {
    callbacks: callbackType,
    targetWindow: Window | undefined,
	/**
	 * URL in the iFrame (target)Window, Empower application, for example https://localhost:9443/empower
	 */
    targetURL: URL,
    targetURLEdit: URL,
    targetURLPreview: URL,
	opacityIframe: any,
	/**
	 * URL of the SYFO application, for example https://localhost:9444/syfo
	 */
	applicationUrl: string,
	applicationPath: string,
	csUrl: string,
	docId: string,
    previewFunctionDisabled: boolean,
    previewSpinner: boolean,	
	enableMellomlagre: boolean,
	enableTilbakeSist: boolean,
	enableSentralUtsending: boolean,
	enableLokalUtskrift: boolean,
	enableSendTilGodjenning: boolean,
	enableGodkjennSentral: boolean,
	enableGodkjennLokal: boolean,
	enableForhondsvisning: boolean,
	enableReturner: boolean,
	buttonsDisabled: boolean,
	txtForhondsvisning: string,
    refreshSpinner: boolean,
    securityToken: string,
	ewsWsdlLocation: string,
	ewsPreviewFileName: string,
	ewsPreviewPubFile: string,
	ewsPreviewUsers: string,
    documentMetadata: documentMetadata,
    statusCode: string,
    errorMessage: string,
    uname: string,
    pass: string,
	userId: string,
	showVeiledning: boolean
};

type callObject = {
    uniqueIdentifier: string,
    methodName: string,
    args: any,
    action: string
}

type documentMetadata = {
    applicationName: string,
    creationDate: string,
    deleted: string,
    docId: string,
	docTags: string[],
    documentVersion: string,
    editorVersion: string,
    engineVersion: string,
    exportDate: string,
    fileName: string,
    importDate: string,
    lastEditDate: string,
    lastSaveDate: string,
    packageFileName: string,
    packageVersion: string,
    ownerIds: string[]
}


type callbackType = { [index:string] : Function }
const METHOD_RESPONSE = "method response";


export class EditorApiComponent extends Component<editorApiPathProps | editorApiOptionProps, editorApiState> {

    constructor(props: editorApiOptionProps) {
        super(props);
        this.setIframeWindow = this.setIframeWindow.bind(this);
        this.refreshWindow = this.refreshWindow.bind(this);
		this.refreshWindowAfterDel = this.refreshWindowAfterDel.bind(this);
        this.previewFunction = this.previewFunction.bind(this);
        this.simpleCall = this.simpleCall.bind(this);
        this.handleMessageFromEmpower = this.handleMessageFromEmpower.bind(this);
		this.send2LOGthroughRestApi = this.send2LOGthroughRestApi.bind(this);
        this.ferdigstillFunctionAvbrytBrev = this.ferdigstillFunctionAvbrytBrev.bind(this);
        this.getMetadata = this.getMetadata.bind(this);
        this.getSecurityToken = this.getSecurityToken.bind(this);
        this.checkAccess = this.checkAccess.bind(this);
		this.ferdigstillFunction = this.ferdigstillFunction.bind(this);
		this.ferdigstillFunctionLokalPrint = this.ferdigstillFunctionLokalPrint.bind(this);
		this.ferdigstillFunctionMellomlagre = this.ferdigstillFunctionMellomlagre.bind(this);
		this.ferdigstillFunctionGodkjenn = this.ferdigstillFunctionGodkjenn.bind(this);
		this.ferdigstillFunctionReturner = this.ferdigstillFunctionReturner.bind(this);
		this.whoami = this.whoami.bind(this);
		this.updateMetadata = this.updateMetadata.bind(this);
		this.deleteDocument = this.deleteDocument.bind(this);
		this.exportDocument = this.exportDocument.bind(this);
		this.addTheTitle = this.addTheTitle.bind(this);  
		this.knappenVisForhondsvisning = this.knappenVisForhondsvisning.bind(this);
		this.afterSend2CS = this.afterSend2CS.bind(this);
		this.getApplicationUrl = this.getApplicationUrl.bind(this);
		this.enableButtonsFunction = this.enableButtonsFunction.bind(this);
		this.showVeiledningFunction = this.showVeiledningFunction.bind(this);
        this.state = {
            callbacks: {},
			targetWindow: undefined,
            targetURL: parseUrlEdit(this.props),
            targetURLEdit: parseUrlEdit(this.props),
            targetURLPreview: parseUrlPreview(this.props),
			opacityIframe: 1,
			applicationUrl: this.getApplicationUrl(this.props),
			applicationPath: '',
			csUrl: props.csUrl,
			docId: props.docId,

            previewFunctionDisabled: false,
            previewSpinner: false,
            refreshSpinner: false,
			enableMellomlagre: false,
			enableTilbakeSist: false,
			enableSentralUtsending: false,
			enableLokalUtskrift: false,
			enableSendTilGodjenning: false,
			enableGodkjennSentral: false,
			enableGodkjennLokal: false,
			enableForhondsvisning: false,
			enableReturner: false,
			buttonsDisabled: false,
			txtForhondsvisning: 'Forhåndsvisning',
            securityToken: '',
			ewsWsdlLocation: props.ewsWsdlLocation,
			ewsPreviewFileName: props.ewsPreviewFileName,
			ewsPreviewPubFile: props.ewsPreviewPubFile,
			ewsPreviewUsers: props.ewsPreviewUsers,
            documentMetadata: {
                applicationName: '',
                creationDate: '',
                deleted: '',
                docId: '',
				docTags: [''],
                documentVersion: '',
                editorVersion: '20.4.0.49234',
                engineVersion: '',
                exportDate: '',
                fileName: '',
                importDate: '',
                lastEditDate: '',
                lastSaveDate: '',
                packageFileName: '',
                packageVersion: '',
                ownerIds:['']                
            },
            statusCode: props.statusCode,
            errorMessage: props.errorMessage,
            uname: '',
            pass: '',
			userId: props.userId,
			showVeiledning: props.showVeiledning
		}
    };

    componentDidMount(): void {
		console.group("EditorApiComponentDidMount(): start");

		document.title = this.addTheTitle(); //"SYFO breveditor";

		// 04.05.2025 the call to whoami is not needed
	    //this.whoami(this.props);

		window.addEventListener("message", this.handleMessageFromEmpower);


		if (this.state.errorMessage !== null && this.state.errorMessage !== '') {
			const newURL = new URL(this.state.applicationUrl + "/DokumentForbudt.html", this.state.targetURL.origin);
			console.log("New target (error) URL: " + newURL);
			this.setState({
				targetURL: newURL,
				previewFunctionDisabled: true,
				buttonsDisabled: true
			});
			console.log("ErrorMessage: " + this.state.errorMessage);
			this.send2LOGthroughRestApi(this.state.docId, this.state.statusCode, this.state.errorMessage);
		} else {
			this.knappenVisForhondsvisning().then(r => {});
			//this.getSecurityToken(this.props);
			//this.checkAccess(this.props);
			// 04.05.2025 enable getMetadata()
			this.getMetadata(this.props)
				.then((val) => console.log("DDDDDDDDDDDDDDDDD" + val))
				.catch((err) => this.setState({documentMetadata: err}));
			console.log("EditorApiComponentDidMount(): editorVersion = " + this.state.documentMetadata.editorVersion + " (default)");
			console.log("Empower document Url: " + this.state.targetURL);
		}
		console.log("EditorApiComponentDidMount(): finished");
		console.groupEnd();
    };

    componentWillUnmount(): void {
        window.removeEventListener("message", this.handleMessageFromEmpower);
    };

	enableButtonsFunction(enabled: boolean): void {
		this.setState({buttonsDisabled: enabled})
	};

	showVeiledningFunction(show: boolean): void {
		this.setState({showVeiledning: show})
	};

	async send2LOGthroughRestApi(docId: string, restOperation: string, restPayload64: string): Promise<void>{
		console.log("send2LOGthroughRestApi() started.");
		const params2Log = new URLSearchParams();		
		params2Log.append('docId', docId);
		params2Log.append('restOperation', restOperation);
		params2Log.append('restPayload64', restPayload64);
		//const send2Log = await axios.post(this.state.targetURL.origin + "/" + this.state.applicationPath + "/api/v1/saveInLog", params2Log);
		// 24.04.2025 - fix
		console.log("Sending POST request to SYFO backend with a logging information. Link: " + this.state.applicationUrl + "/api/v1/saveInLog");
		const send2Log = await axios.post(this.state.applicationUrl + "/api/v1/saveInLog", params2Log);

	};

	async deleteDocument() {
		//const axios = require('axios');
		this.setState({ errorMessage: '', statusCode: ''});
		const qs = require('qs');
		const data = qs.stringify({
			'docId': this.state.docId,
			'bearerToken': this.props.access_token,
			'xsrfHeader': this.props.csrf_header,
			'xsrfToken': this.props.csrf_token
		});
		const config = {
			method: 'delete',
			url: this.state.applicationUrl + '/api/v1/DeleteDocument',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: data,
			withCredentials: true
		};
		console.log("Send DELETE request to SYFO backend to delete the document. " + config.url);
		await axios(config)
			.then(function(response: AxiosResponse) {
				console.log("The document has been deleted. ");
				console.log(response.data);
			})
			.catch(err => {
				console.log("The document could not be deleted.");
				console.log(err);
				if (err.response.status === 401) {
					this.setState({ errorMessage: 'UNAUTHORIZED (delete the document)', statusCode: '401'});
				}
				if (err.response.status === 403) {
					this.setState({ errorMessage: 'FORBIDDEN (delete the document)', statusCode: '403'});
				}
			});
	//		.catch(function (error: any) {
	//			console.log("The document could not be deleted.");
	//			console.log(error);
	//			if (error.response.status === 401) {
	//				this.setState
	//			}
	//		});
	}

    async ferdigstillFunctionAvbrytBrev(): Promise<void> {
		this.setState({ buttonsDisabled: true });
		console.group("AVBRYT BREV");
		console.info("The %cAVBRYT BREV", "color: blue; font-size: 1.15em;", " button was clicked. The buttons are disabled.\nThe delay 100ms starts here."); console.time("From click to finish");
		sleep(100);	// This function is put here for preventing multiple clicks on this button
		console.info("The AVBRYT BREV button. The delay 100ms is done.");

		let canWeDelete = window.confirm('Er du sikker på at du vil slette dette dokumentet?');
		sleep(200);	// This function is put here for preventing multiple clicks on this button
		if(canWeDelete) {
			// 15.05.2025 - a new function to delete the Empower document
			await this.deleteDocument();

	/*
		const documentID = this.state.docId;
        const securityTokenURL = new URL("empower/resource/GetToken", this.state.targetURL.origin);
        const deleteDocumentURL = new URL("empower/resource/documents/" + documentID, this.state.targetURL.origin);
        console.log("deleteDocument(): securityToken: " + this.state.securityToken);
		this.send2LOGthroughRestApi(documentID + "", "AVBRUTT", "Saving changes if the changes exist.");
		if(canWeDelete){
	        try {
	            const tokenResponse = await axios.get(securityTokenURL.href, {withCredentials: true});
	            const tokenBody = tokenResponse.data.body;
	            console.log("deleteDocument(): " + tokenBody.csrfToken);
	            const deleteResponse = await axios.delete(deleteDocumentURL.href, {
	                withCredentials: false,
	                headers: {"X-CSRF-TOKEN": tokenBody.csrfToken} // this.state.securityToken					
	            }).then(async () => {
					//SENDING MESSAGE TO CS
					try {
				            console.log("This is the TOKEN(): " + tokenBody.csrfToken);
							console.table(tokenBody);	          
							var otdsApiUrl = "";
							var otdsApiUserName = "";
							var otdsApiPassword = "";
							var csUrl = "";
							Axios.get(this.state.targetURL.origin + "/" + this.state.applicationPath + "/api/v1/GetProperties", {withCredentials: false}).then(async (response) => {
								    otdsApiUrl = response.data.otds.apiUrl;
								    otdsApiUserName = response.data.otds.apiUserName;
				    				otdsApiPassword = response.data.otds.apiPassword;
									csUrl = response.data.csUrl;						
									const dataOtdsUserPass = JSON.stringify({"userName": otdsApiUserName,"password": otdsApiPassword});
									const headerOptions = {
									  headers: {'Content-Type': 'application/json'}
									};	
									const urlOtds = new URL(otdsApiUrl);
									try{
										console.info("Send post request to: " + urlOtds.href);
										const getOTDSticket = await axios.post(urlOtds.href, dataOtdsUserPass, headerOptions);				
										const OTDSticket = getOTDSticket.data.ticket;

										*/
										try { // Now, we try to go further. Sending to CS
										//	let documentID = this.state.targetURL.searchParams.get("docId") + "";
											let docId64encoded = base64_encode(this.state.docId);
											const send2csURL = new URL(this.props.csUrl);
											const data2cs = JSON.stringify({
												    "content": {
												        "contentType": "text/xml",
												        "data": docId64encoded,
												        "async": "true"
												    },
												"FUNKSJON" : "AVBRUTT",
											    "USERID": this.state.userId
												 });
											const headersOptions2cs = {headers: {"Content-Type": "application/json", "OTDSTicket": this.props.otds_ticket }};
											const send2cs = await axios.post(send2csURL.href, data2cs, headersOptions2cs);
										//	await this.send2LOGthroughRestApi(this.state.docId + "", "AVBRUTT", docId64encoded);
											this.afterSend2CS(send2cs, this.state.docId, docId64encoded, "AVBRYT BREV","DokumentFjernet.html");
										} catch(e) {
								            console.error("Send to Communication Server: Error occurred while trying to post to CS", e);
								            return;
							       		} 					
			/*						} 	catch(e) {
							            console.error("Get OTDS ticket: Error occurred while trying to get OTDS ticket", e);
							            return
						       		}
							}).catch(err => {
										console.log("Something wrong with getting the properties location...");
										console.log(err);			
							});		         			
				        } catch(e) {
				            console.error("restoreDocument(): Error occurred while trying to send data to CS", e);
							alert("Feil! \nDet er noe problem med å få dokumentet avbrutt.");
				            return
				        }
						//SENDING MESSAGE TO CS (END)
				});	
				console.info(deleteResponse);
				sleep(400);
	            setTimeout(this.refreshWindowAfterDel, 1000);				
	        } catch(e) {
	            console.error("deleteDocument(): Error occurred while trying to delete " + documentID, e);
				sleep(400);
	            this.refreshWindow();
	            return
	        }
	        */
		} else {
			//this.setState({ buttonsDisabled: true });
			sleep(700);	// This function is put here for preventing multiple clicks on this button
			this.setState({ buttonsDisabled: false });	
		}

    }

    static call(uniqueIdentifier: string, methodName: string, args: any): callObject {
        return { uniqueIdentifier, methodName, args, action: "method call" }
    };

    setIframeWindow (iframeWindow: Window): void {
        this.setState({targetWindow: iframeWindow});
        this.setState({previewSpinner: false,
                       refreshSpinner: false });
    };

    refreshWindow (): void {
        if(this.state.targetWindow === undefined){
            console.error("refreshWindow(): iFrame window is undefined");
            return
        }
        this.setState({refreshSpinner: true});
        this.checkAccess(this.props);
        // Reloads by passing a new url with a different iframeInstance uuid
        // The host window can't directly call functions of an iframe window without disabling sandbox
        const newURL = this.state.targetURLEdit;
        newURL.searchParams.set("iframeInstance", uuid.v4());
        this.setState({
            targetURL: newURL,
            previewFunctionDisabled: false,
			txtForhondsvisning: 'Forhåndsvisning'
        });
    };

	refreshWindowAfterDel (): void {
        if(this.state.targetWindow === undefined){
            console.error("refreshWindow(): iFrame window is undefined");
            return
        }
        this.setState({refreshSpinner: true});
        this.checkAccess(this.props);
        // Reloads by passing a new url with a different iframeInstance uuid
        // The host window can't directly call functions of an iframe window without disabling sandbox
        const newURL = new URL(this.state.applicationPath + "/DokumentFjernet.html", this.state.targetURL.origin);
		this.setState({
            targetURL: newURL,
            previewFunctionDisabled: false,
			buttonsDisabled: true
        });        
    };


	exportDocument(preserveDoc: boolean): String | any {
		const axios = require('axios');
		const qs = require('qs');
		const data = qs.stringify({
			'docId': this.state.docId,
			'bearerToken': this.props.access_token,
			'xsrfHeader': this.props.csrf_header,
			'xsrfToken': this.props.csrf_token,
			'preserveDoc': 'preserveDoc=' + preserveDoc
		});
		const config = {
			method: 'post',
			url: this.state.applicationUrl + '/api/v1/ExportDocument',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: data,
			withCredentials: true
		};
		console.log("Send POST request to SYFO backend to export the Empower document: " + config.url);

		axios(config)
			.then(function(response: AxiosResponse) {
				console.log("The document was exported with 'preserveDoc=" + preserveDoc + "'");
				return Buffer.from(response.data, 'binary').toString('base64');
			})
			.catch(function (error: any) {
				console.log("The document could not be exported.");
				console.log(error);
				return error;
			});

	}

	prepareEWSRequest( base64_Empower : string): string {
		return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:eng="urn:hpexstream-services/Engine">\
				 <soapenv:Header/>\
				 <soapenv:Body>\
				  <eng:Compose>\
				   <EWSComposeRequest>\
				    <driver>\
						<driver>' + base64_Empower + '</driver>\
				   		<fileName>' + this.state.ewsPreviewFileName + '</fileName>\
					</driver>\
					<includeHeader>true</includeHeader>\
					<includeMessageFile>true</includeMessageFile>\
					<outputFile>\
					</outputFile>\
					<pubFile>' + this.state.ewsPreviewPubFile + '</pubFile>\
				   </EWSComposeRequest>\
				  </eng:Compose>\
				 </soapenv:Body>\
				</soapenv:Envelope>';
	}

	previewFunction (): void {
        this.setState({previewSpinner: true, buttonsDisabled: true });
		sleep(100);
        console.log("previewFunction(): start");
		setTimeout(() => {this.setState({  buttonsDisabled: false });}, 400);
		//const documentID = this.state.targetURLPreview.href;
		// fix 11.05.2025
		const documentID = this.state.docId;
        console.log("previewFunction(): (DocID)" + documentID);


		let response = this.exportDocument(true);

		// Empower document was successfully exported and converted into String base64
		if (response as String) {
			
		} else {
			this.setState({previewSpinner: false, opacityIframe: 1});
			alert("Det er et problem med å vise PDF-en.");
			this.send2LOGthroughRestApi(this.state.docId, "Preview PDF SOAP ERROR", response).then(r => {});
			return;
		}

		// all after here will be commented out
		const empowerUrl = new URL(this.state.targetURL.origin);
		const securityTokenURL = new URL("empower/resource/GetToken", this.state.targetURL.origin);
		//const docId = this.state.targetURL.searchParams.get("docId");
		// fix 11.05.2025
		const docId = this.state.docId;
		empowerUrl.pathname = empowerUrl.pathname + "empower/resource/documents/" + docId + "/export";
		console.log(("previewFunction() - empowerUrl: " + empowerUrl));
		axios.get(securityTokenURL.href, {withCredentials: true}).then(async (tokenResp) => {
			const csrfToken = tokenResp.data.body.csrfToken;
			const qs = require('qs');
			const data = qs.stringify({'preserveDoc': 'true'});
			axios({url: empowerUrl.href, method: 'POST', responseType: 'arraybuffer', headers: {'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-TOKEN': csrfToken }, data: data})
				.then(async (response) => {
				const buff = Buffer.from(response.data, 'binary').toString('base64');
				await this.send2LOGthroughRestApi(empowerUrl.href, "Preview PDF: Get the document base64_Encode", "The document is in buffer now. And it will be sent through SOAP to EWS.");
				const xmlParser = require('fast-xml-parser');
				let xmls= this.prepareEWSRequest(buff);

				console.log("SOAP LOCATION: " + this.state.ewsWsdlLocation);	//'http://localhost:8080/EngineService/EngineService?wsdl'
				console.log("ewsPreviewFile: " + this.state.ewsPreviewPubFile);
				await axios.post(this.state.ewsWsdlLocation, xmls,{headers: {'Content-Type': 'text/xml'} })
					.then(res=> {
				        console.log(":: SOAP-status: " + res.status);
						let options = {
				            attributeNamePrefix : '',
				            attrNodeName: 'attr',
				            ignoreNameSpace: true,
				            ignoreAttributes: false
				        };
				   		const soapenv = xmlParser.parse(res.data,options);
						const getBody = soapenv.Envelope.Body;
						const docId = this.state.targetURL.searchParams.get("docId") + "";
						this.send2LOGthroughRestApi(docId, "Preview PDF SOAP response", getBody.ComposeResponse.return.statusMessage);
						this.send2LOGthroughRestApi(docId, "Preview PDF SOAP response", base64_decode(getBody.ComposeResponse.return.engineMessage));
						console.log("Engine - status message: " + getBody.ComposeResponse.return.statusMessage);
						if (getBody.ComposeResponse.return.statusMessage.indexOf("Error") > -1) {
							console.log("Exstream Engine log:\n" + base64_decode(getBody.ComposeResponse.return.engineMessage));
						}
						console.log("Engine - filename: " + getBody.ComposeResponse.return.files.fileName);
						setTimeout(() => {this.setState({ opacityIframe: 1 });}, 300);
						let t = getBody.ComposeResponse.return.files.fileOutput;
						const newUrlPdf = new URL("data:application/pdf;base64," + t);
						this.setState({
				            targetURL: newUrlPdf,
				            previewFunctionDisabled: true,
							txtForhondsvisning: 'Tilbake til redigering'
				        });
				    })
					.catch(err => {
						this.setState({previewSpinner: false, opacityIframe: 1});
						alert("Det er et problem med å vise PDF-en.");
						console.log(err);
						const docId = this.state.targetURL.searchParams.get("docId") + "";
						this.send2LOGthroughRestApi(docId, "Preview PDF SOAP ERROR", err);
					});
			})
			.catch(ex => {
				this.setState({previewSpinner: false, opacityIframe: 1});
				alert("Det er et problem med å vise PDF-en.");
				const docId = this.state.targetURL.searchParams.get("docId") + "";
				this.send2LOGthroughRestApi(docId, "Preview PDF SOAP ERROR", ex);
			    console.error(ex);
			});
		}).catch(ex => {
		    console.error("The error appeared at checking getToken: " + ex);
			this.setState({previewSpinner: false, opacityIframe: 1});
		});     
    };

/*
    previewFunctionOld (): void { // not used anymore
        this.setState({previewSpinner: true});
        console.log("previewFunction(): start");
        const documentID = this.state.targetURLPreview.href;
        console.log("previewFunction(): " + documentID);
        const newURL = this.state.targetURLPreview;
        newURL.searchParams.set("iframeInstance", uuid.v4());
        this.setState({
            targetURL: newURL,
            previewFunctionDisabled: true,
			txtForhondsvisning: 'Tilbake til redigering'
        });
        console.log("previewFunction(): " + this.state.targetURL);        
    };*/

	getApplicationUrl(props: editorApiOptionProps | editorApiPathProps): string {
		return props.applicationUrl;
	}
    
    getSecurityToken(props: editorApiPathProps | editorApiOptionProps): void {
        const options = props as editorApiOptionProps;
        var empowerUrl = new URL(options.empowerHost);
        empowerUrl.pathname = empowerUrl.pathname + "/resource/GetToken";
        console.log("getSecurityToken(): " + empowerUrl.href);
        Axios.get(empowerUrl.href, {withCredentials: false, 
                                   //     auth: {
                                   //              username: this.state.uname,
                                   //              password: this.state.pass
                                   //           }
            }).then((response) => {
                   console.log(response.data);
				   console.table(response.data);
                   const tokenBody = response.data.body;
                   this.setState( {securityToken: tokenBody.csrfToken});
                   })
                .catch(err => {
                console.log("getSecurityToken(): Something wrong with getting the csrf token...");
                console.log(err);                
                });
    }

    checkAccess(props: editorApiPathProps | editorApiOptionProps): void {
        const options = props as editorApiOptionProps;
        var empowerUrl = new URL(options.empowerHost);
		console.log("empowerUrl.pathname: " + empowerUrl.pathname);
        empowerUrl.pathname = empowerUrl.pathname + "/resource/docedit/" + options.docId + "/open";
        Axios.get(empowerUrl.href, {withCredentials: true, headers: {'Authorization' : 'Bearer ' + this.props.access_token}}).then((response) => {
                   console.log("checkAccess(): verified.");
                   this.setState({ statusCode: '',
                                   errorMessage: ''});
                   })
                .catch(err => {
				console.log("checkAccess(): Something wrong with opening the document...");
                const errorResponse = err.response;
                this.setState({ statusCode: errorResponse.data.header.status.code,
                                errorMessage: errorResponse.data.header.status.msg});
                console.log(errorResponse);                
                });
    }

	    
    async getMetadata(props: editorApiPathProps | editorApiOptionProps): Promise<documentMetadata> {
		console.group("Getting document metadata for docId: " + this.state.docId);
	//	this.setState({ errorMessage: '', statusCode: ''});
        const options = props as editorApiOptionProps;
        var empowerUrl = new URL(options.empowerHost);
	//	console.log("EditorApiComponent:empowerUrl.pathname: " + empowerUrl.pathname);
        empowerUrl.pathname = empowerUrl.pathname + "/resource/documents/" + options.docId + "/meta";
    //    console.log("EditorApiComponent:getMetadata() empower: " + empowerUrl.href);
		const syfoUrl = new URL(this.props.applicationUrl);
		syfoUrl.pathname = syfoUrl.pathname + "/api/v1/GetDocumentMetadata";
		const qs = require('qs');
		const data = qs.stringify({
			'docId': this.state.docId,
			'bearerToken': this.props.access_token
		});
		const config = {
			//method: 'post',
			//url: syfoUrl + '/api/v1/GetDocumentMetadata',
			headers: {
				// 'Content-Type': 'text/plain'
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: data,
			withCredentials: true
		};
        let defaultMetadata = {
                applicationName: 'could not retrieve',
                creationDate: 'could not retrieve',
                deleted: 'could not retrieve',
                docId: 'could not retrieve',
				docTags: ['could not retrieve'],
                documentVersion: 'could not retrieve',
                editorVersion: 'could not retrieve',
                engineVersion: 'could not retrieve',
                exportDate: 'could not retrieve',
                fileName: 'could not retrieve',
                importDate: 'could not retrieve',
                lastEditDate: 'could not retrieve',
                lastSaveDate: 'could not retrieve',
                packageFileName: 'could not retrieve',
                packageVersion: 'could not retrieve',
                ownerIds:['could not retrieve']                
            };
        return new Promise(async(resolve, reject) => {

			// 1. option to send directly towards Empower just with using cookies
             axios.get(empowerUrl.href,  {withCredentials: true}).then((response) => {
				 console.log("Send GET request to Empower to receive document metadata: " + empowerUrl.href);

			 // 2. option to send to SYFO backend and with using Bearer token authentication (between SYFO backend and Empower)
			 //await axios.post(syfoUrl.href, data, config).then((response) => {
			 //	 console.log("Send POST request to SYFO backend to receive document metadata: " + syfoUrl.href);

				 if (response) {
							console.log("Document metadata received.");
                            const metadata = response.data.body.document;
                            defaultMetadata.applicationName = metadata.applicationName;
                            defaultMetadata.creationDate=format(new Date(metadata.creationDate), "yyyy-MM-dd HH:mm:ss");
                            defaultMetadata.deleted=metadata.deleted;
                            defaultMetadata.docId = metadata.docId;
							defaultMetadata.docTags = metadata.docTags;
                            defaultMetadata.documentVersion=metadata.documentVersion;
                            defaultMetadata.editorVersion=metadata.editorVersion;
                            defaultMetadata.engineVersion=metadata.engineVersion;
                            defaultMetadata.fileName=metadata.fileName;
                            defaultMetadata.importDate=format(new Date(metadata.importDate), "yyyy-MM-dd HH:mm:ss");
							// lastEditDate is missing in metadata when a document is created from scratch
							if (metadata.lastEditDate !== undefined) {
								defaultMetadata.lastEditDate=format(new Date(metadata.lastEditDate), "yyyy-MM-dd HH:mm:ss");
							}
							defaultMetadata.lastSaveDate=format(new Date(metadata.lastSaveDate), "yyyy-MM-dd HH:mm:ss");
							defaultMetadata.packageFileName=metadata.packageFileName;
                            defaultMetadata.packageVersion=metadata.packageVersion;
                            defaultMetadata.ownerIds=metadata.ownerIds;
                            this.setState({documentMetadata: defaultMetadata});
                            if (this.state.targetURL.pathname.includes('editor')) {
								console.log("pathname includes 'editor'. this.state.targetURL.pathname: " + this.state.targetURL.pathname);
                                this.state.targetURL.pathname = "empower/resource/docedit/editor/" + metadata.editorVersion + "/empower.html";
                                this.state.targetURLEdit.pathname = "empower/resource/docedit/editor/" + metadata.editorVersion + "/empower.html";
                                console.log("EditorApiComponent:getMetadata(): editorVersion changed to: " + metadata.editorVersion);
                            }

							console.log(" lastSaveDate: " + defaultMetadata.lastSaveDate + "; lastEditDate: " + defaultMetadata.lastEditDate);

                            if(defaultMetadata.docTags.length > 0) {
								if(defaultMetadata.docTags[0] === "2TRINNSAK_1") {
									console.log(" - Buttons will be displayed for 2TRINNSAK_1.");
									this.setState({
										enableMellomlagre: true,
										enableSendTilGodjenning: true
									})
								} else if(defaultMetadata.docTags[0] === "2TRINNSAK_2") {
									console.log(" - Buttons will be displayed for 2TRINNSAK_2.");
									this.setState({
										enableMellomlagre: true,
										enableGodkjennSentral: true,
										enableGodkjennLokal: true,
										enableReturner: true
									})
								} else {
									console.log(" - Default menu will be displayed because an unknown user tag has been found: " + defaultMetadata.docTags[0]);
									this.setState({
										enableSentralUtsending: true,
										enableLokalUtskrift: true
									})
								}
							} else {
								console.log(" - EMPTY docTags (The document does not contain any user defined tags).");
								this.setState({
										enableSentralUtsending: true,
										enableLokalUtskrift: true
									})
							}
							resolve(defaultMetadata);
						} else {
                            console.log("EditorApiComponent:getMetadata(): The response does not return an error but it is empty!");
                            resolve(defaultMetadata);
                        }
				 		console.log("EditorApiComponent:getMetadata() finished.");
						console.groupEnd();
			 }).catch(err2 => {
				 console.log("EditorApiComponent:getMetadata(): An error occured when getting the document metadata");
				 console.log("Response status code: " + err2.response.status);
				 if (err2.response.status === 401) {
					 this.setState({documentMetadata: defaultMetadata, errorMessage: "UNAUTHORIZED (get the document metadata)", statusCode: '401'});
				 } else {
					 this.setState({documentMetadata: defaultMetadata, errorMessage: err2.header.status.msg});
				 }
				 this.send2LOGthroughRestApi(this.state.docId + "", "getMetadata() failed.", "ERROR: "  + err2);
				 reject(defaultMetadata);
                   });
			 console.groupEnd();
        });
    }

	
    simpleCall (methodName: string, args: any, fnCallback: Function): void {
		console.log("simpleCall() - methodName: " + methodName);
		this.setState({ buttonsDisabled: true });
        if(this.state.targetWindow === undefined){
            console.error("simpleCall(): iFrame window is undefined");
            return
        }
        if (!isFunction(fnCallback)) {
            console.error("The method '" + methodName + "' expects a callback function");
            return
        }
        const callId = uuid.v4();
		const callToSend = EditorApiComponent.call(callId, methodName, args);
		this.setState({callbacks: {...this.state.callbacks, [callId]: fnCallback}});
		console.log("Before postMessage");
		this.state.targetWindow.postMessage(JSON.stringify(callToSend), this.state.targetURL.origin);
		console.log("After postMessage");
		setTimeout(() => {this.setState({ opacityIframe: 0 });}, 200);

		// 08.12.2025 - added the rule to only call getMetadata if the methodName is "save"
		//if (methodName === "EditorAPI.document.save") {
		//	setTimeout(() => {this.setState({ opacityIframe: 0 });}, 1000);
		//	this.getMetadata(this.props).then(r => {});
		//}

		setTimeout(() => {this.setState({ opacityIframe: 1 });}, 2000); // This is just a secure comming back for IFRAME if it is not working in ferdigstillFunction...()
    };

    static parseMessage (messageEvent: any): any|undefined {
        console.log("parseMessage()...");
        if(messageEvent && messageEvent.data && messageEvent.data.source){ 
            if(messageEvent.data.source === "react-devtools-content-script") return undefined;
            if(messageEvent.data.source === "react-devtools-detector") return undefined;
            if(messageEvent.data.source === "react-devtools-bridge") return undefined;
            if(messageEvent.data.source === "react-devtools-inject-backend") return undefined;
        }
        try { return JSON.parse(messageEvent.data); }
        catch (_) {
			console.log("ERRROR");
            console.error(`EditorAPI is unable to parse a message received as JSON. The data was ${messageEvent}`);
            return undefined
        }
    };

    static validateMethodResponse (response: any, callBacks: callbackType): boolean {
		console.log("validateMethodResponse()...");
        const fnCallback = callBacks[response.uniqueIdentifier];
        if (fnCallback) {
            if (response.action === METHOD_RESPONSE) {
                return true
            } else {
                console.error(`EditorAPI received an Unexpected action '${response.action}' in response.`);
                return false;
            }
        } else {
            console.error("EditorAPI received a response with an unknown uniqueIdentifier");
            return false;
        }
    };

 	handleMessageFromEmpower (messageEvent: any): void {
		 console.log("handleMessageFromEmpower()...");
			 const response = EditorApiComponent.parseMessage(messageEvent);
			 if(!response || !EditorApiComponent.validateMethodResponse(response, this.state.callbacks)){
				 console.log("handleMessageFromEmpower(): response is empty or not valid");
				 return
			 }
			 console.log("handleMessageFromEmpower() - response: " + JSON.stringify(response));
			 const routeIndex = response.returnValue.routeIndex;
			 if (routeIndex !== undefined) {
				 this.setState({buttonsDisabled: false});
			 }
			 this.state.callbacks[response.uniqueIdentifier](response.returnValue);
			 let newCallbacks = this.state.callbacks;
			 //console.log("uniqueIdentifier to delete: " + response.uniqueIdentifier);
			 delete newCallbacks[response.uniqueIdentifier];
			 this.setState({callbacks: newCallbacks});

    };

	async whoami(props: editorApiPathProps | editorApiOptionProps): Promise<void> {
		console.log("whoami() started.")
		const options = props as editorApiOptionProps;
	    const axios = require('axios');
	    const config = {
	        method: 'get',
	        url: options.empowerHost + '/resource/users/whoami',
	        headers: {
	            'Accept': 'application/json'
	        },
			withCredentials: true
	    };
		const applicationPath = window.location.pathname.split('/')[1];
		this.setState({applicationPath: applicationPath});
		axios(config)
	        .then(async (response: any) => {				
				let uid = this.props.userfromAdressBar + '';
				this.setState({userId: response.data.body.userId});
				if(this.props.userfromAdressBar !== null){
					this.setState({userId: uid});
				}            
				this.getMetadata(this.props);
	        })
	        .catch((error: any) => {
	            console.log(error);
	        });
		console.log("whoami() finished.")
	};
	
	addTheTitle(): string{ // this function changes the title of the page according to 
		let theTitle = "SYFO breveditor";
		const queryString = window.location.search; 
		const urlPm = new URLSearchParams(queryString);
		if(urlPm.get('addTitle') == null) {
			return theTitle;
		} else {
			const addTitle = urlPm.get('addTitle') + '';
			if(addTitle.length > 0){
				theTitle = theTitle + " " + addTitle ;
			}	
			return theTitle;
		}		
	};
	
	afterSend2CS(send2cs: any, documentID: string, docId64encoded: string, buttonClicked: string, htmlMessage: string): void{ 
		//buttonClicked: SENTRALPRINT, LOKALPRINT, MELLOMLAGRE .... 
		//htmlMessage: DokumentSendt2CS.html, ... 
		if(send2cs.data.status === "success"){	
			this.send2LOGthroughRestApi(documentID, buttonClicked, docId64encoded);
			setTimeout(() => {this.setState({ opacityIframe: 1 }); console.info("The %c" + buttonClicked, "color: blue; font-size: 1.15em;", " button. The SPINNER is hidden.  The IFRAME is back."); console.timeEnd("From click to finish"); }, 50); //this closes the spinner opened in the function simpleCall() and goes back to iframe

			// 12.05.2025 fix
			// const newURL = new URL(this.state.applicationPath + "/" + htmlMessage, this.state.targetURL.origin);
			const newURL = new URL(this.state.applicationUrl + "/" + htmlMessage, this.state.targetURL.origin);
			console.log("newURL: " + newURL);
			this.setState({
		        targetURL: newURL,
		        previewFunctionDisabled: true,
				buttonsDisabled: true
		    });
			console.info("The %c" + buttonClicked, "color: blue; font-size: 1.12em;", " button. The back processes (async) are finished.");
		} else {
			this.send2LOGthroughRestApi(documentID + ". Det er noen problemer", buttonClicked + " fungerer IKKE", docId64encoded);
			alert("Det er noen problemer med kommunikasjonen. \nPrøver igjen om 5 minutter eller Avbryt dokumentet! \n \nTakk!");
		}
		console.groupEnd(); // here it is closing the console.group which is opened in functions as ferdigstillFunctionMellomlagre() ....
	}
	
	
	async knappenVisForhondsvisning(): Promise<void> {
		console.group("Preview button check");
		//const applicationPath = window.location.pathname.split('/')[1];
		//Axios.get(this.state.applicationUrl + "/api/v1/GetProperties", {withCredentials: false}).then(async (response) => {
			//Axios.get(this.state.targetURL.origin + "/" + applicationPath + "/api/v1/GetProperties", {withCredentials: false}).then(async (response) => {
		//	const ewsWsdlLocation = response.data.ewsWsdlLocation;
		//	const ewsPreviewFileName = response.data.ewsPreviewFileName;
		//  const ewsPreviewPubFile = response.data.ewsPreviewPubFile;
		//	const ewsPreviewUsers = response.data.ewsPreviewUsers;
			//const uid = this.state.userId;
			const uid = this.props.userfromAdressBar;
			console.log("User from the address bar: " + uid);
			if(this.state.ewsPreviewUsers.indexOf(uid) !== -1) {
				console.log("Forhaandsvisning button: enabled");
				this.setState({
					enableForhondsvisning: true
				});
			} else {
				console.log("Forhaandsvisning button: disabled (the user is NOT in the EWS preview user list)");
			}
	//		this.setState({
	//			ewsWsdlLocation: ewsWsdlLocation,
	//			ewsPreviewFileName: ewsPreviewFileName,
	//			ewsPreviewPubFile: ewsPreviewPubFile
	//		});
	//	}).catch(err => {
	//			console.log("Something wrong with getting the properties location...");
	//			console.log(err);
	//	});
		console.groupEnd();
	}


	async ferdigstillFunction(): Promise<void> {
		this.setState({ buttonsDisabled: true });
		console.group("SENTRALPRINT");
		console.info("The %cSENTRALPRINT", "color: blue; font-size: 1.15em;", " button was clicked. The buttons are disabled.\nThe delay 100ms starts here.");
		console.time("From click to finish");
		sleep(100);	// This function is put here for preventing multiple clicks on this button
		console.info("The SENTRALPRINT button. The delay 100ms is done.");

		const documentMetadata = this.getMetadata(this.props);
		documentMetadata.then((resultObject) => {
			console.log("HELLO: " + JSON.stringify(resultObject))});
		// 12.05.2025 - Comment out the code as we already have all the necessary parameters
		/*
		const securityTokenURL = new URL("empower/resource/GetToken", this.state.targetURL.origin);
		let docId = this.state.targetURL.searchParams.get("docId");
		try {
	            const tokenResponse = await axios.get(securityTokenURL.href, {withCredentials: true});
	            const tokenBody = tokenResponse.data.body;
				// These consts are the default values when we tried without proper properties file
				//const dataOtdsUserPass = JSON.stringify({"userName": "otadmin@otds.admin","password": "xxx"});
				//const dataOtdsUserPass = JSON.stringify({"userName":"tenantadmin@strs.role","password":"Edp_Exstream05!"});
				//const urlOtds = new URL("http://localhost:9999/otdsws/rest/authentication/credentials");
				var otdsApiUrl = "";
				var otdsApiUserName = "";
				var otdsApiPassword = "";
				var csUrl = "";				
				Axios.get(this.state.targetURL.origin + "/" + this.state.applicationPath + "/api/v1/GetProperties", {withCredentials: false}).then(async (response) => {
					    otdsApiUrl = response.data.otds.apiUrl;
					    otdsApiUserName = response.data.otds.apiUserName;
	    				otdsApiPassword = response.data.otds.apiPassword;
						csUrl = response.data.csUrl;	
						const dataOtdsUserPass = JSON.stringify({"userName": otdsApiUserName,"password": otdsApiPassword});
						const headerOptions = {
						  headers: {'Content-Type': 'application/json'}
						};	
						const urlOtds = new URL(otdsApiUrl);
						//console.info("Get OTDSticket url: " + otdsApiUrl);
						try{
							console.info("Send post request to: " + urlOtds.href);
							const getOTDSticket = await axios.post(urlOtds.href, dataOtdsUserPass, headerOptions);				
							const OTDSticket = getOTDSticket.data.ticket;
				*/
							try { // Now, we try to go further. Sending to CS
							//	let documentID = docId + "";
								let docId64encoded = base64_encode(this.state.docId);
								const send2csURL = new URL(this.state.csUrl);
								const data2cs = JSON.stringify({
									    "content": {
									        "contentType": "text/xml",
									        "data": docId64encoded,
									        "async": "true"
									    },
									"FUNKSJON" : "SENTRALPRINT",
								    "USERID": this.state.userId, 
									"DOCID": this.state.docId,
								    "RETURNFORMAT": "PDF",
								    "RETURNDATA": "TRUE"
									 });
								console.log("Send to CS.");
								console.log(data2cs);
								const headersOptions2cs = {headers: {"Content-Type": "application/json", "OTDSTicket": this.props.otds_ticket }};
								const send2cs = await axios.post(send2csURL.href, data2cs, headersOptions2cs);
								this.afterSend2CS(send2cs, this.state.docId, docId64encoded, "SENTRALPRINT","DokumentSendt2CS.html");
							} catch(e) {
					            console.error("Send to CS: Error occurred while trying to post to CS", e);
								this.send2LOGthroughRestApi(this.state.docId + "", "SENTRALPRINT fungerer IKKE", "Feil med å sende til CS. POST til " + this.state.csUrl + ". " + e);
								alert("Det er noen problemer med kommunikasjonen. Feil med å sende til CS. \nPrøver igjen om 5 minutter eller Avbryt dokumentet! \n \nTakk!");								
					            return
				       		}
		/*
                } 	catch(e) {
                    console.error("Get OTDS ticket: Error occurred while trying to get OTDS ticket", e);
                    return
                   }
        }).catch(err => {
                    console.log("Something wrong with getting the properties location...");
                    console.log(err);
        });
    } catch(e) {
        alert("Det er et problem: \nDu skal prøve igjen senere.");
        console.error("restoreDocument(): Error occured while trying to send data to CS", e);
        return
    }
    */
	} //ferdigstillFunction()
	
	
	async ferdigstillFunctionLokalPrint(): Promise<void> {
		this.setState({ buttonsDisabled: true });
		console.group("Lokalprint");
		console.info("The %cLOKALPRINT", "color: blue; font-size: 1.21em;", " button was clicked. The buttons are disabled.\nThe delay starts here."); console.time("From click to finish");
		sleep(100);	// This function is put here for preventing multiple clicks on this button
		console.info("The LOKALPRINT button. The delay stops here.");

		// 12.05.2025 - Comment out the code as we already have all the necessary parameters
		/*
		const securityTokenURL = new URL("empower/resource/GetToken", this.state.targetURL.origin);
		let docId = this.state.targetURL.searchParams.get("docId");
		try {
	            const tokenResponse = await axios.get(securityTokenURL.href, {withCredentials: true});
	            const tokenBody = tokenResponse.data.body;
	            var otdsApiUrl = "";
				var otdsApiUserName = "";
				var otdsApiPassword = "";
				var csUrl = "";
				Axios.get(this.state.targetURL.origin + "/" + this.state.applicationPath + "/api/v1/GetProperties", {withCredentials: false}).then(async (response) => {
					    otdsApiUrl = response.data.otds.apiUrl;
					    otdsApiUserName = response.data.otds.apiUserName;
	    				otdsApiPassword = response.data.otds.apiPassword;
						csUrl = response.data.csUrl;	
						const dataOtdsUserPass = JSON.stringify({"userName": otdsApiUserName,"password": otdsApiPassword});
						const headerOptions = {
						  headers: {'Content-Type': 'application/json'}
						};	
						const urlOtds = new URL(otdsApiUrl);
						try{
							console.info("Send post request to: " + urlOtds.href);
							const getOTDSticket = await axios.post(urlOtds.href, dataOtdsUserPass, headerOptions);				
							const OTDSticket = getOTDSticket.data.ticket;
							*/
							try{ // Now, we try to go further. Sending to CS
							//	let documentID = docId + "";
								let docId64encoded = base64_encode(this.state.docId);
								const send2csURL = new URL(this.props.csUrl);
								const data2cs = JSON.stringify({
									    "content": {
									        "contentType": "text/xml",
									        "data": docId64encoded,
									        "async": "true"
									    },
									"FUNKSJON" : "LOKALPRINT",
								    "USERID": this.state.userId, 
									"DOCID": this.state.docId,
								    "RETURNFORMAT": "PDF",
								    "RETURNDATA": "TRUE"
									 });
								console.log("Send to CS: " + data2cs);
								const headersOptions2cs = {headers: {"Content-Type": "application/json", "OTDSTicket": this.props.otds_ticket }};
								const send2cs = await axios.post(send2csURL.href, data2cs, headersOptions2cs);
								this.afterSend2CS(send2cs, this.state.docId, docId64encoded, "LOKALPRINT","DokumentLokalPrintSendt2CS.html");
							} catch(e) {
					            console.error("Send to CS: Error occurred while trying to post to CS", e);
								this.send2LOGthroughRestApi(this.state.docId + "", "LOKALPRINT fungerer IKKE", "Feil med å sende til CS. POST til " + this.props.csUrl + ". " + e);
								alert("Det er noen problemer med kommunikasjonen. Feil med å sende til CS. \nPrøver igjen om 5 minutter eller Avbryt dokumentet! \n \nTakk!");								
					            return
				       		} 					
		/*				} 	catch(e) {
				            console.error("Get OTDS ticket: Error occurred while trying to get OTDS ticket", e);
				            return
			       		}
				}).catch(err => {
							console.log("Something wrong with getting the properties location...");
							console.log(err);			
				});		         			
	        } catch(e) {
	            console.error("restoreDocument(): Error occurred while trying to send data to CS", e);
	            return
	        }*/
	} //function ferdigstillFunctionLokalPrint()
	
	
	async ferdigstillFunctionMellomlagre(): Promise<void> {
		this.setState({ buttonsDisabled: true });
		console.group("Mellomlagre");
		console.info("The %cMELLOMLAGRE", "color: blue; font-size:1.21em;"," button was clicked. The buttons are disabled.\nThe delay 100ms starts here."); console.time("From click to finish");
		sleep(100);	// This function is put here for preventing multiple clicks on this button
		console.info("The MELLOMLAGRE button. The delay 100ms is done.");

		// 12.05.2025 - Comment out the code as we already have all the necessary parameters
		/*
		const securityTokenURL = new URL("empower/resource/GetToken", this.state.targetURL.origin);
		let docId = this.state.targetURL.searchParams.get("docId");
		try {
	            const tokenResponse = await axios.get(securityTokenURL.href, {withCredentials: true});
	            const tokenBody = tokenResponse.data.body;
	            var otdsApiUrl = "";
				var otdsApiUserName = "";
				var otdsApiPassword = "";
				var csUrl = ""; 
				console.log("Url Get properties " + this.state.targetURL.origin + "/" + this.state.applicationPath + "/api/v1/GetProperties");
				Axios.get(this.state.targetURL.origin + "/" + this.state.applicationPath + "/api/v1/GetProperties", {withCredentials: false}).then(async (response) => {
					// otdsApiUrl is: https://localhost:9445/otdsws/rest/authentication/credentials
					otdsApiUrl = response.data.otds.apiUrl;
					    otdsApiUserName = response.data.otds.apiUserName;
	    				otdsApiPassword = response.data.otds.apiPassword;
						csUrl = response.data.csUrl;	
						const dataOtdsUserPass = JSON.stringify({"userName": otdsApiUserName,"password": otdsApiPassword});
						const headerOptions = {
						  headers: {'Content-Type': 'application/json'}
						};	
						const urlOtds = new URL(otdsApiUrl);
						try{
							console.info("Send post request to: " + urlOtds.href);
							const getOTDSticket = await axios.post(urlOtds.href, dataOtdsUserPass, headerOptions);				
							const OTDSticket = getOTDSticket.data.ticket;
				*/
							try { // Now, we try to go further. Sending to CS
				//				let documentID = docId + "";
								let docId64encoded = base64_encode(this.state.docId);
								const send2csURL = new URL(this.state.csUrl);
								const data2cs = JSON.stringify({
									    "content": {
									        "contentType": "text/xml",
									        "data": docId64encoded,
									        "async": "true"
									    },
									"FUNKSJON" : "MELLOMLAGRING",
									"DOCID": this.state.docId,
								    "USERID": this.state.userId
									 });
								console.log("Send to CS");
								console.log(data2cs);
								const headersOptions2cs = {headers: {"Content-Type": "application/json", "OTDSTicket": this.props.otds_ticket }};
								const send2cs = await axios.post(send2csURL.href, data2cs, headersOptions2cs);
								this.afterSend2CS(send2cs, this.state.docId, docId64encoded, "MELLOMLAGRING","DokumentMellomlagreSendt2CS.html");
							} catch(e) {
					            console.error("Send to CS: Error occurred while trying to post to CS", e);
								await this.send2LOGthroughRestApi(this.state.docId + "", "MELLOMLAGRING fungerer IKKE", "Feil med å sende til CS. POST til " + this.state.csUrl + ". " + e);
								alert("Det er noen problemer med kommunikasjonen. Feil med å sende til CS. \nPrøver igjen om 5 minutter eller Avbryt dokumentet! \n \nTakk!");
					            return
				       		} 					
			/*			} 	catch(e) {
				            console.error("Get OTDS ticket: Error occured while trying to get OTDS ticket", e);
				            return
			       		}
				}).catch(err => {
							console.log("Something wrong with getting the properties location...");
							console.log(err);			
				});		         			
	        } catch(e) {
				alert("Det er et problem: \nDu skal prøve igjen senere.");
	            console.error("restoreDocument(): Error occured while trying to send data to CS", e);
	            return
	        }
			*/
	} //function mellomlagreFunction()

	async updateMetadata(metadata: String) {
		//const axios = require('axios');
		const qs = require('qs');
		const data = qs.stringify({
			'docId': this.state.docId,
			'bearerToken': this.props.access_token,
			'xsrfHeader': this.props.csrf_header,
			'xsrfToken': this.props.csrf_token,
			'docTags': metadata
		});
		const config = {
			method: 'post',
			url: this.state.applicationUrl + '/api/v1/UpdateDocumentMetadata',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: data,
			withCredentials: true
		};
		console.log("Send POST request to SYFO backend to update document metadata: " + config.url);
		await axios(config)
			.then(function(response: AxiosResponse) {
				console.log("The document metadata updated with: " + metadata);
				console.log(response.data);
			})
			.catch(err => {
				console.log("The document metadata could not be updated.");
				console.log(err);
				if (err.response.status === 403) {
					this.setState({ errorMessage: 'FORBIDDEN (update the document metadata)', statusCode: '403'});
				}
			});
//	.catch(function (error: any) {
//				console.log("The document metadata could not be updated.");
//				console.log(error);
//				if (error.response.status === 403) {
//					this.setState({ errorMessage: '403 FORBIDDEN'});
//				}
 //			});
	}
	
	async ferdigstillFunctionGodkjenn(): Promise<void> {
		this.setState({ buttonsDisabled: true });	
		console.group("Send til godkjenning");
		console.info("The %cSEND TIL GODKJENNING ", "color: blue; font-size: 1.21em", "button was clicked. The buttons are disabled.\nThe delay 100ms starts here."); console.time("From click to finish");
		sleep(100);	// This function is put here for preventing multiple clicks on this button
		console.info("The SEND TIL GODKJENNING button. The delay 100ms is done.");
		// 14.05.2025 - a new function to update the document metadata
		await this.updateMetadata("docTag=2TRINNSAK_2");

		// 12.05.2025 - Comment out the code as we already have all the necessary parameters
		/*
		const securityTokenURL = new URL("empower/resource/GetToken", this.state.targetURL.origin);		
		const documentID = this.state.targetURL.searchParams.get("docId");
        const updateMetadataDocumentURL = new URL("empower/resource/documents/" + documentID + "/meta", this.state.targetURL.origin);
		try {		
	            const tokenResponse = await axios.get(securityTokenURL.href, {withCredentials: true});
	            const tokenBody = tokenResponse.data.body;				
				var headers = {headers: {'X-CSRF-TOKEN': tokenBody.csrfToken, 'Content-Type': 'application/x-www-form-urlencoded'}};
				const params = new URLSearchParams();
				params.append('docTag', '2TRINNSAK_2');

	            const godkjennResponse = await axios.post(updateMetadataDocumentURL.href, params, headers).then(async () => {
					//SENDING MESSAGE TO CS
					try {
			            var otdsApiUrl = "";
						var otdsApiUserName = "";
						var otdsApiPassword = "";
						var csUrl = "";								
						Axios.get(this.state.targetURL.origin + "/" + this.state.applicationPath + "/api/v1/GetProperties", {withCredentials: false}).then(async (response) => {
							    otdsApiUrl = response.data.otds.apiUrl;
							    otdsApiUserName = response.data.otds.apiUserName;
			    				otdsApiPassword = response.data.otds.apiPassword;
								csUrl = response.data.csUrl;						
								const dataOtdsUserPass = JSON.stringify({"userName": otdsApiUserName,"password": otdsApiPassword});
								const headerOptions = {
								  headers: {'Content-Type': 'application/json'}
								};	
								const urlOtds = new URL(otdsApiUrl);
								try{
									console.info("Send post request to: " + urlOtds.href);
									const getOTDSticket = await axios.post(urlOtds.href, dataOtdsUserPass, headerOptions);				
									const OTDSticket = getOTDSticket.data.ticket;

									*/
									try { // Now, we try to go further. Sending to CS
									//	let documentID = this.state.targetURL.searchParams.get("docId") + "";
										let docId64encoded = base64_encode(this.state.docId);
										const send2csURL = new URL(this.props.csUrl);
										const data2cs = JSON.stringify({
											    "content": {
											        "contentType": "text/xml",
											        "data": docId64encoded,
											        "async": "true"
											    },
											"FUNKSJON" : "GODKJENNING",
											"DOCID": this.state.docId,
										    "USERID": this.state.userId
											 });
										console.log("Send data to CS");
										console.log(data2cs);
										const headersOptions2cs = {headers: {"Content-Type": "application/json", "OTDSTicket": this.props.otds_ticket }};
										const send2cs = await axios.post(send2csURL.href, data2cs, headersOptions2cs);
										this.afterSend2CS(send2cs, this.state.docId, docId64encoded, "GODKJENNING","DokumentGodkjennSendt2CS.html");
									} catch(e) {
							            console.error("Send to CS: Error occurred while trying to post to CS", e);
										await this.send2LOGthroughRestApi(this.state.docId + "", "GODKJENNING fungerer IKKE", "Feil med å sende til CS. POST til " + this.props.csUrl + ". " + e);
										alert("Det er noen problemer med kommunikasjonen. Feil med å sende til CS. \nPrøver igjen om 5 minutter eller Avbryt dokumentet! \n \nTakk!");							
							            return
						       		}
									   // unnecessary code
		/*
								} 	catch(e) {
						            console.error("Get OTDS ticket: Error occurred while trying to get OTDS ticket", e);
						            return
					       		}
						}).catch(err => {
									console.log("Something wrong with getting the properties location...");
									console.log(err);			
						});													         			
			        } catch(e) {
			            console.error("godkjennDocument(): Error occured while trying to send data to CS", e);
			            return
			        }
				});
		 } catch(e) {
				alert("FEIL med å GODKJENNE dokumentet!");
				this.send2LOGthroughRestApi(documentID + "", "GODKJENNING fungerer IKKE", "Error occured while trying to add docTags. " + e);
	            console.error("Godkjenn Dokument: Error occured while trying to add docTags " + documentID, e);
	            return
	   }
	   */
	}	//function ferdigstillGodkjenning()
	
	
	async ferdigstillFunctionReturner(): Promise<void> {
		this.setState({ buttonsDisabled: true });
		console.group("Returner");
		console.info("The %cRETURNER ", "color: blue; font-size: 1.21em", "button was clicked. The buttons are disabled.\nThe delay 100ms starts here."); console.time("From click to finish");
		sleep(100);	// This function is put here for preventing multiple clicks on this button
		console.info("The RETURNER button. The delay 100ms is done.");

		// 14.05.2025 - a new function to update the document metadata
		await this.updateMetadata("docTag=2TRINNSAK_1");

		// 12.05.2025 - Comment out the code as we already have all the necessary parameters
/*
		const securityTokenURL = new URL("empower/resource/GetToken", this.state.targetURL.origin);
		const documentID = this.state.targetURL.searchParams.get("docId");
		const metadataDocumentURL = new URL("empower/resource/documents/" + documentID + "/meta", this.state.targetURL.origin);
try {
        const tokenResponse = await axios.get(securityTokenURL.href, {withCredentials: true});
        const tokenBody = tokenResponse.data.body;
        var headers = {headers: {'X-CSRF-TOKEN': tokenBody.csrfToken, 'Content-Type': 'application/x-www-form-urlencoded'}};
        const params = new URLSearchParams();
        params.append('docTag', '2TRINNSAK_1');
        const godkjennResponse = await axios.post(metadataDocumentURL.href, params, headers).then(async () => {
            try {
                const tokenResponse = await axios.get(securityTokenURL.href, {withCredentials: true});
                const tokenBody = tokenResponse.data.body;
                var otdsApiUrl = "";
                var otdsApiUserName = "";
                var otdsApiPassword = "";
                var csUrl = "";
                Axios.get(this.state.targetURL.origin + "/" + this.state.applicationPath + "/api/v1/GetProperties", {withCredentials: false}).then(async (response) => {
                        otdsApiUrl = response.data.otds.apiUrl;
                        otdsApiUserName = response.data.otds.apiUserName;
                        otdsApiPassword = response.data.otds.apiPassword;
                        csUrl = response.data.csUrl;
                        const dataOtdsUserPass = JSON.stringify({"userName": otdsApiUserName,"password": otdsApiPassword});
                        const headerOptions = {
                          headers: {'Content-Type': 'application/json'}
                        };
                        const urlOtds = new URL(otdsApiUrl);
                        try{
                            console.info("Send post request to: " + urlOtds.href);
                            const getOTDSticket = await axios.post(urlOtds.href, dataOtdsUserPass, headerOptions);
                            const OTDSticket = getOTDSticket.data.ticket;

 */
                            try { // Now, we try to go further. Sending to CS
                             //   let documentID = this.state.targetURL.searchParams.get("docId") + "";
                                let docId64encoded = base64_encode(this.state.docId);
                                const send2csURL = new URL(this.state.csUrl);
                                const data2cs = JSON.stringify({
                                        "content": {
                                            "contentType": "text/xml",
                                            "data": docId64encoded,
                                            "async": "true"
                                        },
                                    "FUNKSJON" : "IKKEGODKJENT",
                                    "DOCID": this.state.docId,
                                    "USERID": this.state.userId
                                     });
                                console.log("Send to CS.");
								console.log(data2cs);
                                const headersOptions2cs = {headers: {"Content-Type": "application/json", "OTDSTicket": this.props.otds_ticket }};
                                const send2cs = await axios.post(send2csURL.href, data2cs, headersOptions2cs);
                                this.afterSend2CS(send2cs, this.state.docId, docId64encoded, "RETURNER","DokumentReturnSendt2CS.html");
                            } catch(e) {
                                console.error("Send to CS: Error occurred while trying to post to CS", e);
                                await this.send2LOGthroughRestApi(this.state.docId + "", "RETURNERER/IKKEGODKJENT fungerer IKKE", "Feil med å sende til CS. POST til " + this.props.csUrl + ". " + e);
                                alert("Det er noen problemer med kommunikasjonen. Feil med å sende til CS. \nPrøver igjen om 5 minutter eller Avbryt dokumentet! \n \nTakk!");
                                return
                               }
							   /*
                        } 	catch(e) {
                            console.error("Get OTDS ticket: Error occured while trying to get OTDS ticket", e);
                            return
                           }
                }).catch(err => {
                            console.log("Something wrong with getting the properties location...");
                            console.log(err);
                });
            } catch(e) {
                console.error("restoreDocument(): Error occured while trying to send data to CS", e);
                return
            }
    });
 } catch(e) {
        alert("Det er en feil. Du kan prøve igjen senere.");
        this.send2LOGthroughRestApi(documentID + "", "RETURNER/IKKEGODKJENT fungerer IKKE", "Error occured while trying to add docTags  "  + e);
        console.error("Returner Dokument: Error occured while trying to add docTags " + documentID, e);
        return
}

							    */
}	//function ferdigstillReturner()


render() {
	return <>
	    <NavEmpowerComponent
	        applicationUrl={this.state.applicationUrl}
	        empowerServerUrl={this.state.targetURL.href}
    	    opacityIframe={this.state.opacityIframe}
        	setIframeWindow={this.setIframeWindow}
        	simpleCall={this.simpleCall}
        	refreshWindow={this.refreshWindow}
        	previewFunction={this.previewFunction}
        	previewFunctionDisabled={this.state.previewFunctionDisabled}
        	previewSpinner={this.state.previewSpinner}
        	refreshSpinner={this.state.refreshSpinner}
        	buttonsDisabled={this.state.buttonsDisabled}
        	txtForhondsvisning={this.state.txtForhondsvisning}
        	send2LOGthroughRestApi={this.send2LOGthroughRestApi}
        	ferdigstillFunctionAvbrytBrev={this.ferdigstillFunctionAvbrytBrev}
        	ferdigstillFunction={this.ferdigstillFunction}
        	ferdigstillFunctionGodkjenn={this.ferdigstillFunctionGodkjenn}
        	ferdigstillFunctionReturner={this.ferdigstillFunctionReturner}
        	ferdigstillFunctionLokalPrint={this.ferdigstillFunctionLokalPrint}
        	ferdigstillFunctionMellomlagre={this.ferdigstillFunctionMellomlagre}
			enableButtonsFunction={this.enableButtonsFunction}
        	enableDelete={this.props.enableDelete}
        	userfromAdressBar={this.props.userfromAdressBar}
        	enableLokalUtskrift={this.state.enableLokalUtskrift}
        	enableMellomlagre={this.state.enableMellomlagre}
        	enableSentralUtsending={this.state.enableSentralUtsending}
        	enableSendTilGodjenning={this.state.enableSendTilGodjenning}
        	enableGodkjennSentral={this.state.enableGodkjennSentral}
        	enableGodkjennLokal={this.state.enableGodkjennLokal}
        	enableForhondsvisning={this.state.enableForhondsvisning}
        	enableReturner={this.state.enableReturner}
        	enableTilbakeSist={this.state.enableTilbakeSist}
        	documentMetadata={this.state.documentMetadata}
        	statusCode={this.state.statusCode}
        	errorMessage={this.state.errorMessage}
        	securityToken={this.state.securityToken}
        	userId={this.state.userId}
			showVeiledning={this.state.showVeiledning}
			showVeiledningFunction={this.showVeiledningFunction}
	    />
	 </>
};
}

function parseUrlEdit(props: editorApiPathProps | editorApiOptionProps): URL {
	if((props as editorApiPathProps).path !== undefined) {
		console.log("parseUrlEdit(): editorApiPathProps defined..");
		const path = (props as editorApiPathProps).path;
		const empowerUrl = new URL(path);
		empowerUrl.searchParams.set("iframeInstance", uuid.v4());
		return empowerUrl;
	}
	//console.log("parseUrlEdit(): editorApiOptionProps defined..");
	const options = props as editorApiOptionProps;
	const empowerUrl = new URL(options.empowerHost);
	//console.log("empowerUrl: " + empowerUrl);
	//console.log(("empowerUrl.pathname: " + empowerUrl.pathname));
	empowerUrl.searchParams.set("locale", options.locale || "en_US"); // en_US, nb_NO would be Norwegian bokmaal
	//empowerUrl.searchParams.set("docId", options.docId);
	empowerUrl.searchParams.set("hosted", "true");
	// showUserLogs might be a boolean so we have to either use a conditional
	// or just run toString which is essentially a no-op if the value is already a string.
	empowerUrl.searchParams.set("showUserLogs", (options.showUserLogs || "false").toString());
	empowerUrl.searchParams.set("iframeInstance", uuid.v4());
	empowerUrl.hash = "/document/" + (options.documentNumber || "1") + "/page/" + (options.page || "1");
	//empowerUrl.pathname = "empower/resource/docedit/editor/" + (options.version || "20.4.0.49234") + "/empower.html";
	empowerUrl.pathname = empowerUrl.pathname + "/resource/docedit/" + options.docId + "/open";
	//console.log("empowerUrl.searchParams: " + empowerUrl.searchParams);
	//console.log(("empowerUrl.pathname: " + empowerUrl.pathname));
	//console.log("empowerUrl: " + empowerUrl);
	return empowerUrl;
}

function parseUrlPreview(props: editorApiPathProps | editorApiOptionProps): URL {
	if((props as editorApiPathProps).path !== undefined) {
		const path = (props as editorApiPathProps).path;
		const empowerUrl = new URL(path);
		empowerUrl.searchParams.set("iframeInstance", uuid.v4());
		return empowerUrl;
	}
	const options = props as editorApiOptionProps;
	const empowerUrl = new URL(options.empowerHost);
	empowerUrl.searchParams.set("iframeInstance", uuid.v4());
	empowerUrl.pathname = empowerUrl.pathname + "/resource/docedit/" + options.docId + "/preview";
	return empowerUrl;
}

function sleep(milliseconds: number) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

export default EditorApiComponent;