import React, {SyntheticEvent} from "react";
import { Hovedknapp, Fareknapp } from 'nav-frontend-knapper';
import { Container, Row, Column } from "nav-frontend-grid";
import  Panel  from 'nav-frontend-paneler';
//import EmpowerMetadata from './nav-empower-panel-metadata-new';
import isFunction from './isFunction';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import axios from 'axios';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { InfoCard } from "@navikt/ds-react";
import { Button } from "@navikt/ds-react";

type documentMetadata = {
    applicationName: string,
    creationDate: string,
    deleted: string,
    docId: string,
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
    ownerIds: string[],
}

export type appProps = {
    applicationUrl: string,
    empowerServerUrl: string,
	opacityIframe: any,
    setIframeWindow: Function,
    simpleCall: Function,
    refreshWindow: Function,
    previewFunction: Function,
    previewFunctionDisabled: boolean,
    previewSpinner: boolean,
    refreshSpinner: boolean,
	send2LOGthroughRestApi: Function,
    ferdigstillFunctionAvbrytBrev: Function,
    enableDelete?: boolean,
	userfromAdressBar?:string,
	enableMellomlagre: boolean,
	enableTilbakeSist: boolean,
	enableSendTilGodjenning: boolean,
	enableSentralUtsending: boolean,
	enableLokalUtskrift: boolean,
	enableGodkjennSentral: boolean,
	enableGodkjennLokal: boolean,
	enableForhondsvisning: boolean,
	enableReturner: boolean,
	buttonsDisabled: boolean,
    showVeiledning: boolean,
    txtForhondsvisning: string,
    ferdigstillFunction: Function,
	ferdigstillFunctionLokalPrint: Function,
	ferdigstillFunctionMellomlagre: Function,
	ferdigstillFunctionGodkjenn: Function,
	ferdigstillFunctionReturner: Function,
    enableButtonsFunction: Function,
    showVeiledningFunction: Function,
    documentMetadata: documentMetadata,
    securityToken: string,
    statusCode: string,
    errorMessage: string,
	userId: string
}

type applicationUrlType = String;
let applicationUrl: applicationUrlType;

type hasChangedResponse = {
    isDirty: boolean,
    success: boolean
}
type previewFcType = Function;
let previewFc: previewFcType;

type ferdigstillFunctionFcType = Function;
let ferdigstillFunctionFc: ferdigstillFunctionFcType;

type ferdigstillFunctionLokalPrintFcType = Function;
let ferdigstillFunctionLokalPrintFc: ferdigstillFunctionLokalPrintFcType;
let ferdigstillFunctionMellomlagreFc: ferdigstillFunctionLokalPrintFcType;
let ferdigstillFunctionGodkjennFc: ferdigstillFunctionLokalPrintFcType;
let ferdigstillFunctionReturnerFc: ferdigstillFunctionLokalPrintFcType;

function hasChanged(simpleCall: Function, includeUncommitedChangesInActiveVarArea?: any){
    const boundSaveCallback = saveCallback.bind(null, ferdigstillFunctionMellomlagreFc);
    const boundSave = save.bind(null, simpleCall, boundSaveCallback, includeUncommitedChangesInActiveVarArea);
    const boundHasChangedCallback = hasChangedCallback.bind(null, boundSave);
    const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    const hasChangedFn = simpleCall.bind(null, "EditorAPI.document.hasChanged", args, boundHasChangedCallback);
	return onClickFunctionCall(hasChangedFn)
}

function hasChangedCallback(boundSave: Function, res: hasChangedResponse): void{
    send2LOGthroughRestApi("MELLOMLAGRING: Response from Empower", JSON.stringify(res));
    if(!res.success){
        console.error("Server returns error while checking whether the document has been edited (dirty status)");
		send2LOGthroughRestApi("MELLOMLAGRING: Saving before send to CS", "ERROR: Server returns error while checking whether the document has been edited (dirty status)");
    }
    if(res.isDirty){
        boundSave(); 
		console.info("There has been detected some changes in the document. \nThe changes are saved.");
		send2LOGthroughRestApi("MELLOMLAGRING: Saving before send to CS", "There has been detected some changes in the document. The changes are saved.");
    } else {
        console.info("Detecting no editing changes in the document");
		send2LOGthroughRestApi("MELLOMLAGRING: Saving before send to CS", "Detecting no editing changes in the document. Nothing to be saved.");
		ferdigstillFunctionMellomlagreFc();
    }
}


// These functions is suspended for now (not anymore): this is for PDF preview
function hasChanged_Preview(simpleCall: Function, includeUncommitedChangesInActiveVarArea?: any){
    const boundSave = save.bind(null, simpleCall, previewFc, includeUncommitedChangesInActiveVarArea);
    const boundHasChangedCallback = hasChangedCallback_Preview.bind(null, boundSave);
    const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    const hasChangedFn = simpleCall.bind(null, "EditorAPI.document.hasChanged", args, boundHasChangedCallback);
    return onClickFunctionCall(hasChangedFn)
}

function hasChangedCallback_Preview(boundSave: Function, res: hasChangedResponse): void{
    if(!res.success){
        console.error("Server returns error while checking whether the document has been edited (so called 'dirty status').")
    }
    if(res.isDirty){
        boundSave();
    } else {
        console.info("Detecting no changes in the document.");
        previewFc();
    }
}


function hasChanged_beforeSend2CS(simpleCall: Function, includeUncommitedChangesInActiveVarArea?: any){
    const boundSaveCallback = saveCallback.bind(null, ferdigstillFunctionFc);
    const boundSave = save.bind(null, simpleCall, boundSaveCallback, includeUncommitedChangesInActiveVarArea);
    const boundHasChangedCallback = hasChangedCallback_beforeSend2CS.bind(null, boundSave);
    const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    const hasChangedFn = simpleCall.bind(null, "EditorAPI.document.hasChanged", args, boundHasChangedCallback);
    return onClickFunctionCall(hasChangedFn)
}

function hasChangedCallback_beforeSend2CS(boundSave: Function, res: hasChangedResponse): void{
    send2LOGthroughRestApi("SENTRALPRINT: Response from Empower", JSON.stringify(res));
    if(!res.success){
        console.error("Server returns error while checking whether the document has been edited (so called 'dirty status').");
		send2LOGthroughRestApi("SENTRALPRINT: Saving before send to CS", "ERROR: Server returns error while checking dirty status");
    }
    if(res.isDirty){
        boundSave(); console.info("There has been detected some changes in the document. \nThe changes are saved.");
		send2LOGthroughRestApi("SENTRALPRINT: Saving before send to CS", "There has been detected some changes in the document. The changes are saved.");
    } else {
        console.info("Detecting no changes in the document.");
		send2LOGthroughRestApi("SENTRALPRINT: Saving before send to CS", "Detecting no changes in the document. Nothing to be saved.");
		ferdigstillFunctionFc();
    }
}

function hasChanged_beforeSendLokalPrint2CS(simpleCall: Function, includeUncommitedChangesInActiveVarArea?: any){
    const boundSaveCallback = saveCallback.bind(null, ferdigstillFunctionLokalPrintFc);
    const boundSave = save.bind(null, simpleCall, boundSaveCallback, includeUncommitedChangesInActiveVarArea);
    const boundHasChangedCallback = hasChangedCallback_beforeLokalPrintSend2CS.bind(null, boundSave);
    const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    const hasChangedFn = simpleCall.bind(null, "EditorAPI.document.hasChanged", args, boundHasChangedCallback);
	return onClickFunctionCall(hasChangedFn)
}

function hasChangedCallback_beforeLokalPrintSend2CS(boundSave: Function, res: hasChangedResponse): void {
    send2LOGthroughRestApi("LOKALPRINT: Response from Empower", JSON.stringify(res));
    if(!res.success){
        console.error("Server returns error while checking whether the document has been edited (so called 'dirty status').");
		send2LOGthroughRestApi("LOKALPRINT: Saving before send to CS", "ERROR: Server returns error while checking whether the document has been edited (so called 'dirty status').");
    }
    if(res.isDirty){
        boundSave(); console.info("There has been detected some changes in the document. \nThe changes are saved.");
		send2LOGthroughRestApi("LOKALPRINT: Saving before send to CS", "There has been detected some changes in the document. The changes are saved.");
    } else {
        console.info("Detecting no changes in the document.");
		send2LOGthroughRestApi("LOKALPRINT: Saving before send to CS", "Detecting no changes in the document. Nothing to be saved.");
		ferdigstillFunctionLokalPrintFc();
    }
}

function hasChanged_beforeGodkjennSend2CS(simpleCall: Function, includeUncommitedChangesInActiveVarArea?: any){
    const boundSaveCallback = saveCallback.bind(null, ferdigstillFunctionGodkjennFc);
    const boundSave = save.bind(null, simpleCall, boundSaveCallback, includeUncommitedChangesInActiveVarArea);
    const boundHasChangedCallback = hasChangedCallback_beforeGodkjennSend2CS.bind(null, boundSave);
    const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    const hasChangedFn = simpleCall.bind(null, "EditorAPI.document.hasChanged", args, boundHasChangedCallback);
	return onClickFunctionCall(hasChangedFn)
}

function hasChangedCallback_beforeGodkjennSend2CS(boundSave: Function, res: hasChangedResponse): void{
    send2LOGthroughRestApi("GODKJENNING: Response from Empower", JSON.stringify(res));
    if(!res.success){
        console.error("Server returns error while checking whether the document has been edited (so called 'dirty status').");
		send2LOGthroughRestApi("GODKJENNING: Saving before send to CS", "ERROR: Server returns error while checking whether the document has been edited (so called 'dirty status').");
    }
    if(res.isDirty){
        boundSave(); console.info("There has been detected some changes in the document. \nThe changes are saved.");
		send2LOGthroughRestApi("GODKJENNING: Saving before send to CS", "There has been detected some changes in the document. The changes are saved.");
    } else {
        console.info("Detecting no changes in the document.");
		send2LOGthroughRestApi("GODKJENNING: Saving before send to CS", "Detecting no changes in the document. Nothing to be saved.");
		ferdigstillFunctionGodkjennFc();
    }
}

function hasChanged_beforeReturnerSend2CS(simpleCall: Function, includeUncommitedChangesInActiveVarArea?: any){
    const boundSaveCallback = saveCallback.bind(null, ferdigstillFunctionReturnerFc);
    const boundSave = save.bind(null, simpleCall, boundSaveCallback, includeUncommitedChangesInActiveVarArea);
    const boundHasChangedCallback = hasChangedCallback_beforeReturnerSend2CS.bind(null, boundSave);
    const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    const hasChangedFn = simpleCall.bind(null, "EditorAPI.document.hasChanged", args, boundHasChangedCallback);
    return onClickFunctionCall(hasChangedFn)
}

function hasChangedCallback_beforeReturnerSend2CS(boundSave: Function, res: hasChangedResponse): void{
    send2LOGthroughRestApi("IKKEGODKJENT: Response from Empower", JSON.stringify(res));
    if(!res.success){
        console.error("Server returns error while checking whether the document has been edited (so called 'dirty status').");
		send2LOGthroughRestApi("IKKEGODKJENT: Saving before send to CS", "ERROR: Server returns error while checking whether the document has been edited (so called 'dirty status').");
    }
    if(res.isDirty){
        boundSave(); 
		console.info("There has been detected some changes in the document. \nThe changes are saved.");
		send2LOGthroughRestApi("IKKEGODKJENT: Saving before send to CS", "There has been detected some changes in the document. The changes are saved.");
    } else {
        console.info("Detecting no changes in the document.");
		send2LOGthroughRestApi("IKKEGODKJENT: Saving before send to CS", "Detecting no changes in the document. Nothing to be saved.");
		ferdigstillFunctionReturnerFc();
    }
}

function save(simpleCall: Function, fnCallback: Function, includeUncommitedChangesInActiveVarArea?: any): void {
    console.log("save() started - calling Empower to save the document.");
    const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    simpleCall("EditorAPI.document.save", args, fnCallback);
}

function saveCallback(boundSaveCallback: Function, response: { success: boolean; message: string; }){
    if (response.success) {
        console.log(" >>>> saveCallback (response.success): " + response.success);
        send2LOGthroughRestApi("Saved (the document has been saved). ", "SUCCESS: document has been saved successfully.");
        boundSaveCallback();
    } else {
        alert("Failed (the document cannot be saved): " + response);
        //send2LOGthroughRestApi("Failed (the document cannot be saved). ", "ERROR: Server returns error while saving the document." + response.message);
        send2LOGthroughRestApi("Failed (the document cannot be saved). ", "ERROR: Server returns error while saving the document." + response);
        enableButtonsLocalFc(false);
	}
	console.log(" >>>> saveCallback: " + JSON.stringify(response));
}

function send2LOGthroughRestApi(restOperation: string, restPayload64: string): void {
    const params2Log = new URLSearchParams();
	const queryString = window.location.search;
	const urlPm = new URLSearchParams(queryString);
	const applicationPath = window.location.pathname.split('/')[1];
	var documentid = urlPm.get('docId') + "";
	params2Log.append('docId',  documentid);
	params2Log.append('restOperation', restOperation);
	params2Log.append('restPayload64', restPayload64);
    // 24.04.2025 - fix
    //console.log("Sending POST request with LOG to the SYFO backend. Link: " + window.location.origin + "/" + applicationPath + "/api/v1/saveInLog")
    console.log("Sending POST request to SYFO backend with a logging information. Link: " + applicationUrl + "/api/v1/saveInLog");
    //const send2Log = axios.post(window.location.origin + "/" + applicationPath + "/api/v1/saveInLog", params2Log);
    axios.post(applicationUrl + "/api/v1/saveInLog", params2Log);

}


type responseSuccess = {
    success: boolean,
    routeIndex: routeIndex,
    pageName: string
}

type responseFailure = {
    success: boolean,
    reason: string
}

type routeIndex = {
    doc: number,
    page: number
}

type responseSuccess2 = {
    success: true
}

type responseFailure2 = {
    success: false,
    message: string
}

let simpleCallLocalFc: Function;
let enableButtonsLocalFc: Function;
let showVeiledningLocalFc: Function;

function fallBackTest0(cb: Function){
    simpleCallLocalFc("EditorAPI.document.implicitSave", [true], function (response: responseSuccess2 | responseFailure2) {
        cb(response);
        console.log("RESPONSE implicitSave: ", JSON.stringify(response));
    });
}

function fallBackTest1(cb: Function){
    simpleCallLocalFc("EditorAPI.document.getFirstRequiredEditArea", [], function (response: responseSuccess | responseFailure) {
//        simpleCallLocalFc("EditorAPI.document.save", [], function (response: responseSuccess | responseFailure) {
    cb(response);
        console.log("RESPONSE getFirstRequiredEditArea: ", JSON.stringify(response));
    });
}
function fallBackTest2(args: routeIndex, cb: Function) {
    simpleCallLocalFc("EditorAPI.document.navigateToFirstRequiredEditableArea", args, function (response: responseSuccess2 | responseFailure) {
        cb(response);
    });
}

function onClickFunctionCall(fn?: Function){
    return function(e: React.MouseEvent){
        console.log("currentTarget.id: " + e.currentTarget.id);
		if (e.currentTarget.id === "nav-empower-sentralutsending"
			|| e.currentTarget.id === "nav-empower-lokalutskrift" 
			|| e.currentTarget.id === "nav-empower-sendgodkjenning"
			|| e.currentTarget.id === "nav-empower-mellomlagre"
			|| e.currentTarget.id === "nav-empower-godkjennsentral"
			|| e.currentTarget.id === "nav-empower-godkjennlokal"
			) {
            fallBackTest0(function(response: responseSuccess2 | responseFailure2) {
                console.log("Response for implicitSave: " + JSON.stringify(response));
                if (response.success) {
                    fallBackTest1(function(response: responseSuccess | responseFailure){
                        if (response as responseSuccess) {
                            console.log("responseSuccess: " + JSON.stringify(response));
                            const routeIndex = (response as responseSuccess).routeIndex;
                            if (routeIndex !== null) {
                                console.log("Dokumentet er ikke klart til print, vennligst kontroller at alle obligatoriske felter er fylt ut.");
                                alert("Dokumentet er ikke klart til print, vennligst kontroller at alle obligatoriske felter er fylt ut.");
                                const c = fallBackTest2.bind(null, routeIndex, function(response: responseSuccess2 | responseFailure) {
                                    console.log("Navigation to the first required editable area: " + JSON.stringify(response));
                                });
                                //		c(); // this will run the navigation, intentionally commented out for now
                            } else {
                                if(fn !== undefined) {
                                    fn();
                                }
                            }
                        } else {
                            console.info("fallBackTest1: not success....")
                            if(fn !== undefined) {
                                fn();
                            }
                        }
                    });
                } else {
                    console.log("Dokumentet kunne ikke lagres, vennligst kontroller at alle felter er OK.");
                    alert("Dokumentet kunne ikke lagres, vennligst kontroller at alle felter er OK.");
                    // no buttons enabled
                    enableButtonsLocalFc(true);
                    // show the Veiledning alert strip
                    showVeiledningLocalFc(true);
                }
            });

		} else {
            if(fn !== undefined) {
                fn();
            }
        }
    }
}

function iframeOnLoad(setIframeWindow: Function){
	return function(event: SyntheticEvent) {
        const eventTarget = event.target;
        if (eventTarget && eventTarget instanceof HTMLIFrameElement) {
            setIframeWindow(eventTarget.contentWindow)
        }		
    }
}


export const NavEmpowerComponent: React.FC<appProps> = (props) => {
    applicationUrl = props.applicationUrl;
    previewFc = props.previewFunction;
	ferdigstillFunctionFc = props.ferdigstillFunction;
	ferdigstillFunctionLokalPrintFc = props.ferdigstillFunctionLokalPrint;
	ferdigstillFunctionMellomlagreFc = props.ferdigstillFunctionMellomlagre;
	ferdigstillFunctionGodkjennFc = props.ferdigstillFunctionGodkjenn;
	ferdigstillFunctionReturnerFc = props.ferdigstillFunctionReturner;
	simpleCallLocalFc = props.simpleCall;
    enableButtonsLocalFc = props.enableButtonsFunction;
    showVeiledningLocalFc = props.showVeiledningFunction;
    //setShowVeiledning = this.setShowVeiledning.bind(this);
	//<li><Hovedknapp id="nav-empower-preview" onClick={props.previewFunctionDisabled ?  onClickFunctionCall(props.refreshWindow) : hasChanged_Preview(props.simpleCall, true) } className="nav-empower-button" spinner={props.previewSpinner} >{props.txtForhondsvisning}</Hovedknapp></li>
    return (
        <Panel>
        <Container className="nav-empower-frontend-container">
            <Row className="nav-empower-frontend-row">
                <Column className="nav-empower-frontend-column-buttons col-sm-2">
                    <ul className="nav-empower-button-list">
                        {props.enableMellomlagre
	                        ? 
							<li><Button id="nav-empower-mellomlagre" variant="primary" onClick={hasChanged(props.simpleCall, true)} disabled={props.buttonsDisabled} className="nav-empower-button">Mellomlagre</Button></li>
							: null
						}
                        {props.enableSentralUtsending
                            ? <li><Hovedknapp id="nav-empower-sentralutsending" onClick={hasChanged_beforeSend2CS(props.simpleCall, true)} disabled={props.buttonsDisabled} className="nav-empower-button">Sentral utsending</Hovedknapp></li>
                            : null
                        }
						{props.enableLokalUtskrift
                            ? <li><Hovedknapp id="nav-empower-lokalutskrift" onClick={hasChanged_beforeSendLokalPrint2CS(props.simpleCall, true)} disabled={props.buttonsDisabled} className="nav-empower-button">Lokal utskrift</Hovedknapp></li>
                            : null 
                        }
						{props.enableTilbakeSist
							?
							<li><Hovedknapp id="nav-empower-sistlagrede" onClick={onClickFunctionCall(props.refreshWindow)} disabled={props.buttonsDisabled} className="nav-empower-button" spinner={props.refreshSpinner} >Tilbake til sist lagrede</Hovedknapp></li>
							: null
						} 
						{props.enableSendTilGodjenning
	                        ? 
							<li><Hovedknapp id="nav-empower-sendgodkjenning" onClick={hasChanged_beforeGodkjennSend2CS(props.simpleCall, true)} disabled={props.buttonsDisabled} className="nav-empower-button">SEND TIL GODKJENNING</Hovedknapp></li>
							: null
						}   
						{props.enableGodkjennSentral
	                        ? 
							<li><Hovedknapp id="nav-empower-godkjennsentral" onClick={hasChanged_beforeSend2CS(props.simpleCall, true)} disabled={props.buttonsDisabled} className="nav-empower-button">Godkjenn/Sentral<br />Utsending</Hovedknapp></li>
							: null
						}  
						{props.enableGodkjennLokal
	                        ? 
							<li><Hovedknapp id="nav-empower-godkjennlokal" onClick={hasChanged_beforeSendLokalPrint2CS(props.simpleCall, true)} disabled={props.buttonsDisabled} className="nav-empower-button">Godkjenn/Lokal<br />Utskrift</Hovedknapp></li>
							: null
						}  
						{props.enableForhondsvisning
	                        ?
							<li><Hovedknapp id="nav-empower-preview" onClick={props.previewFunctionDisabled ?  onClickFunctionCall(props.refreshWindow) : hasChanged_Preview(props.simpleCall, true) } disabled={props.buttonsDisabled} className="nav-empower-button" spinner={props.previewSpinner} >{props.txtForhondsvisning}</Hovedknapp></li>
							: null
						}  
						{props.enableReturner
	                        ? 
							<li><Hovedknapp id="nav-empower-returner" onClick={hasChanged_beforeReturnerSend2CS(props.simpleCall, true)} disabled={props.buttonsDisabled} className="nav-empower-button">Returner</Hovedknapp></li>
							: null
						}                      
                        {props.enableDelete
                            ? <li><Fareknapp id="nav-empower-kanseller" onClick={onClickFunctionCall(props.ferdigstillFunctionAvbrytBrev)} disabled={props.buttonsDisabled} className="nav-empower-button" >Avbryt brev</Fareknapp></li>
                            : null
                        }
                    </ul>
                    <InfoCard data-color="info">
                        <InfoCard.Header>
                            <InfoCard.Title>SYFO informasjon</InfoCard.Title>
                        </InfoCard.Header>
                        <InfoCard.Content>(c) 2026</InfoCard.Content>
                    </InfoCard>
                </Column>
                <Column className="nav-empower-frontend-column-frame col-lg-7" md={"12"} >
                    {props.errorMessage && props.statusCode !== 'BUSI110E'
						? <AlertStripeFeil  className="alertstripe nav-empower-frontend-alertstripe panel-mixin" >Code: {props.statusCode}<br/>{props.errorMessage}</AlertStripeFeil> 
						: null 
					}
                    {props.showVeiledning
                        ? <AlertStripeAdvarsel className="alertstripe nav-empower-frontend-alertstripe panel-mixin" size={1}>
                            <b>Veiledning</b><br/>
                            <ol>
                                <li>Marker all teksten du har limt inn/skrevet inn i det redigerbare feltet i breveditor.</li>
                                <li>Kopier teksten fra det redigerbare feltet med <b>Ctrl+C</b></li>
                                <li>Åpne brevet på nytt med knappen <b>'F5'</b> (denne veiledningen forsvinner også)</li>
                                <li>Lim teksten du kopierte i punkt 2 inn i det redigerbare feltet på nytt.</li>
                                <li>Send brevet på nytt</li>
                            </ol>
                          </AlertStripeAdvarsel>
                        : null
                    }
					{props.opacityIframe === 0
						? <div className="spinnerProcessingDoc" ><NavFrontendSpinner /><p>Dokument processing</p></div>
						: null
					}
                    <iframe title="Empower Editor Window" id="empower-editor-frame" className="empowerFrame"  style={{ opacity: props.opacityIframe }} 
                            src={props.empowerServerUrl}
                            onLoad={iframeOnLoad(props.setIframeWindow)}
                    />					
                </Column>
            </Row>
        </Container>
        </Panel>
    );
};


export default NavEmpowerComponent;

