import React from 'react';
import Panel from 'nav-frontend-paneler';
import EtikettLiten  from 'nav-frontend-typografi';
import { Normaltekst } from 'nav-frontend-typografi';
import { Undertittel } from 'nav-frontend-typografi';


export type documentMetadataProps = {
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

export const EmpowerMetadata: React.FC<documentMetadataProps> = (props) => {    
    return (
        <Panel>
           <Normaltekst>Dokument navn</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.applicationName}</li></EtikettLiten>
           <Normaltekst>Opprettet dato</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.creationDate}</li></EtikettLiten>
           <Normaltekst>Unik dokumentid</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.docId}</li></EtikettLiten>
           <Normaltekst>Document versjon</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.documentVersion}</li></EtikettLiten>
           <Normaltekst>Editor versjon</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.editorVersion}</li></EtikettLiten>
           <Normaltekst>Infrastruktur versjon</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.engineVersion}</li></EtikettLiten>
           <Normaltekst>Dokument filnavn</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.fileName}</li></EtikettLiten>
           <Normaltekst>Dokument opprettet</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.importDate}</li></EtikettLiten>
           <Normaltekst>Dokument lagret</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.lastSaveDate}</li></EtikettLiten>
           <Normaltekst>Dokumentmal</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.packageFileName}</li></EtikettLiten>
           <Normaltekst>Dokumentmal versjon</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.packageVersion}</li></EtikettLiten>
           <Normaltekst>Dokumenteiere</Normaltekst>
           <EtikettLiten type={"Normaltekst"}><li className="nav-empower-metadata-list" >{props.ownerIds.join(", ")}</li></EtikettLiten>
           
        </Panel>
        
    );
        
    
};

export default EmpowerMetadata;