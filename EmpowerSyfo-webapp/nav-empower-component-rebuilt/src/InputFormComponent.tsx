import React,{Component} from "react";
import Axios from 'axios';
import Panel  from 'nav-frontend-paneler';
import { Select } from 'nav-frontend-skjema';
import { Hovedknapp} from 'nav-frontend-knapper';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import EmpowerMetadata from './nav-empower-panel-metadata-new';

type inputFormProps = {
    empowerUrl: string,
    uname: string,
    pass: string,
    submitFn: Function
}

type empowerDocument = {

    abandonedDate: string,
    accessGroupNames: string[],
    appId: string,
    applicationName: string,
    busDocId: string,
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
    jobdefinitionId: string,
    lastEditDate: string,
    lastSaveDate: string,
    ownerIds: string[],
    packageFileName: string,
    packageVersion: string,
    previewPubFile: string,
    userId: string

}

type abandonedDate = string;
type accessGroupNames = string[];
type appId = string | undefined;
type applicationName = string;
type busDocId = string;
type creationDate = string;
type deleted = string;
type docId = string;
type docTags = string[];
type documentVersion = string;
type editorVersion = string;
type engineVersion = string;
type exportDate = string;
type fileName = string;
type importDate = string;
type jobdefinitionId = string;
type lastEditDate = string;
type lastSaveDate = string;
type ownerIds = string[];
type packageFileName = string;
type packageVersion = string;
type previewPubFile = string;
type userId = string

type empowerDocuments = empowerDocument[];

export type inputFormState = {
    securityToken: string,
    empowerDocuments: empowerDocument[],
    
    abandonedDate: abandonedDate,
    accessGroupNames: accessGroupNames,
    appId: appId,
    applicationName: applicationName,
    busDocId: busDocId,
    creationDate: creationDate,
    deleted: deleted,
    docId: docId,
    docTags: docTags,
    documentVersion: documentVersion,
    editorVersion: editorVersion,
    engineVersion: engineVersion,
    exportDate: exportDate,
    fileName: fileName,
    importDate: importDate,
    jobdefinitionId: jobdefinitionId,
    lastEditDate: lastEditDate,
    lastSaveDate: lastSaveDate,
    ownerIds: ownerIds,
    packageFileName: packageFileName,
    packageVersion: packageVersion,
    previewPubFile: previewPubFile,
    userId: userId
}


export class InputFormComponent extends Component<inputFormProps, inputFormState> {

    constructor(props: inputFormProps)  {
        super(props);
        
        this.getSecurityToken = this.getSecurityToken.bind(this);
        this.getDocuments = this.getDocuments.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        this.state = {
            securityToken: '', 
            empowerDocuments: [] as empowerDocument[],
            
            abandonedDate: '',
            accessGroupNames: [''],
            appId: '',
            applicationName: '',
            busDocId: '',
            creationDate: '',
            deleted: '',
            docId: '',
            docTags: [''],
            documentVersion: '',
            editorVersion: '',
            engineVersion: '',
            exportDate: '',
            fileName: '',
            importDate: '',
            jobdefinitionId: '',
            lastEditDate: '',
            lastSaveDate: '',
            ownerIds: [''],
            packageFileName: '',
            packageVersion: '',
            previewPubFile: '',
            userId: '' 
            

            
        }
        
    }    
        
    componentDidMount(): void {
        this.getSecurityToken(this.props);
        this.getDocuments(this.props);
        console.log("Component did mount");    

        
    };
    
    getSecurityToken(props: inputFormProps): void {
        const options = props as inputFormProps;
        var empowerUrl = new URL(options.empowerUrl);
        empowerUrl.pathname = "empower/resource/GetToken";
        console.log("Calling now getSecurityToken: " + empowerUrl.href);
        Axios.get(empowerUrl.href, {withCredentials: false, 
                                        auth: {
                                                 username: this.props.uname,
                                                 password: this.props.pass
                                              }
            }).then((response) => {
                   console.log(response.data);
                   const tokenBody = response.data.body;
                   console.log('getSecurityToken(): tokenBody.csrfToken: ' + tokenBody.csrfToken);
                   this.setState( {securityToken: tokenBody.csrfToken});
                   })
                .catch(err => {
                console.log("Something wrong with getting the csrf token...");
                console.log(err);
                
                });
    }
    
    getDocuments(props: inputFormProps): void {
        const options = props as inputFormProps;
        var empowerUrl = new URL(options.empowerUrl);
        empowerUrl.pathname = "empower/resource/documents";
        empowerUrl.searchParams.set("deleted", "false");
        console.log("Calling now getDocuments: " + empowerUrl.href);
        Axios.get(empowerUrl.href, {withCredentials: false}).then((response) => {
                   console.log(response.data);
                   const responseBody = response.data.body;
                   this.setState({empowerDocuments: responseBody.documents});
                   this.setState({abandonedDate: responseBody.documents[1].abandonedDate,
                          accessGroupNames: responseBody.documents[1].accessGroupNames,
                          appId: responseBody.documents[1].appId,
                          applicationName: responseBody.documents[1].applicationName,
                          busDocId: responseBody.documents[1].busDocId,
                          creationDate: responseBody.documents[1].creationDate,
                          deleted: responseBody.documents[1].deleted,
                          docId: responseBody.documents[1].docId,
                          docTags: responseBody.documents[1].docTags,
                          documentVersion: responseBody.documents[1].documentVersion,
                          editorVersion: responseBody.documents[1].editorVersion,
                          engineVersion: responseBody.documents[1].engineVersion,
                          exportDate: responseBody.documents[1].exportDate,
                          fileName: responseBody.documents[1].fileName,
                          importDate: responseBody.documents[1].importDate,
                          jobdefinitionId: responseBody.documents[1].jobdefinitionId,
                          lastEditDate: responseBody.documents[1].lastEditDate,
                          lastSaveDate: responseBody.documents[1].lastSaveDate,
                          packageFileName: responseBody.documents[1].packageFileName,
                          packageVersion: responseBody.documents[1].packageVersion,
                          previewPubFile: responseBody.documents[1].previewPubFile,
                          ownerIds: responseBody.documents[1].ownerIds });
                   })
                .catch(err => {
                console.log("Something wrong with getting the csrf token...");
                console.log(err);
                
                });
    }
    
        
    handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        console.log("selected docId: " + event.currentTarget.value);
        const e = this.state.empowerDocuments;
        let x =  e.find(i => i.docId === event.currentTarget.value);
        console.log(x);
        if (x) {
           this.setState({abandonedDate: x.abandonedDate,
                          accessGroupNames: x.accessGroupNames,
                          appId: x.appId,
                          applicationName: x.applicationName,
                          busDocId: x.busDocId,
                          creationDate: x.creationDate,
                          deleted: x.deleted,
                          docId: x.docId,
                          docTags: x.docTags,
                          documentVersion: x.documentVersion,
                          editorVersion: x.editorVersion,
                          engineVersion: x.engineVersion,
                          exportDate: x.exportDate,
                          fileName: x.fileName,
                          importDate: x.importDate,
                          jobdefinitionId: x.jobdefinitionId,
                          lastEditDate: x.lastEditDate,
                          lastSaveDate: x.lastSaveDate,
                          packageFileName: x.packageFileName,
                          packageVersion: x.packageVersion,
                          previewPubFile: x.previewPubFile,
                          ownerIds: x.ownerIds });
        }
        
        console.log("End of handleChange()");
    }
    
    handleSubmit(): void {
        console.log("handleSubmit() called");
        console.log(this.state.docId);
        this.props.submitFn(this.state.docId);
    }
    
    render() {
        // Dynamically create select list
//        let options = [];
//        this.state.empowerDocuments.map(item =>
//          options.push({ label: item.docId, value: item.applicationName }),
//        );
        let optionTemplate = this.state.empowerDocuments.map(empowerDocument => (
            <option value={empowerDocument.docId}>{empowerDocument.fileName}</option>
        ));
        
        var style = {
          color: 'black',
          width: '40%',
          margin: '20px',
        };
        return <>
                <div style={style}>
                <Panel border className="inputformcomponents">
                    <AlertStripeInfo>Empower location: {this.props.empowerUrl}<br/>Bruker: {this.props.uname}</AlertStripeInfo>
                    <br/>
                    <Select className="lenke" bredde="fullbredde" label='Hvilken dokument skal åpenes?' onChange={this.handleChange}>
                     {optionTemplate} 
                    </Select>
                    
                    <EmpowerMetadata 
                        applicationName={this.state.applicationName} 
                        creationDate={this.state.creationDate}
                        deleted={this.state.deleted}
                        docId={this.state.docId}
                        documentVersion={this.state.documentVersion}
                        editorVersion={this.state.editorVersion}
                        engineVersion={this.state.engineVersion}
                        exportDate={this.state.exportDate}
                        fileName={this.state.fileName}
                        importDate={this.state.importDate}
                        lastEditDate={this.state.lastEditDate}
                        lastSaveDate={this.state.lastSaveDate}
                        packageFileName={this.state.packageFileName}
                        packageVersion={this.state.packageVersion}
                        ownerIds={this.state.ownerIds}
                    />
                    
                    <Hovedknapp id="input-form-submit" className="nav-empower-button" onClick={this.handleSubmit} >Hente dokument</Hovedknapp>
                   
                </Panel>
                </div>
            </>
    };
    
        
        
}

export default InputFormComponent;