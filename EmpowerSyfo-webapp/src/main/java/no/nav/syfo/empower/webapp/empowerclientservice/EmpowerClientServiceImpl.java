package no.nav.syfo.empower.webapp.empowerclientservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/*
import no.flowize.exstream.empowerclient.EmpowerClient;
import no.flowize.exstream.empowerclient.domain.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
*/

//@Component
public class EmpowerClientServiceImpl { // implements EmpowerClientService{

    private static final Logger LOGGER = LoggerFactory.getLogger(EmpowerClientServiceImpl.class);
/*
    @Autowired
    private EmpowerClient empowerClient;
    
    //@Override
    public ResponseEntity<SecurityTokenResponse> getSecurityToken(String bearer) {
        LOGGER.info("Getting the security token with bearer token..");
        ResponseEntity<SecurityTokenResponse> r = new ResponseEntity<>(HttpStatus.ACCEPTED);
        SecurityTokenResponse securityTokenResponse = empowerClient.getSecurityToken(bearer);
        return ResponseEntity.ok(securityTokenResponse);
        //return empowerClient.getSecurityToken(bearer);
    }

    //@Override
    public ImportDocumentResponse importDocument(byte[] empowerDocument) {
        LOGGER.info("Getting the security token..");
        SecurityTokenResponse securityTokenResponse = empowerClient.getSecurityToken();
        LOGGER.info("Received the security token..");
        LOGGER.info("Importing the document...");
        ImportDocumentResponse empowerDocumentResponse = empowerClient.importDocument(empowerDocument,
                null,
                null,
                null,
                null,
                securityTokenResponse.getBody().getCsrfToken(),
                securityTokenResponse.getSessionId());
        LOGGER.info("The document imported...");
        LOGGER.info(empowerDocumentResponse.toString());
        return empowerDocumentResponse;
    }

    //@Override
    public byte[] exportDocument(String docId, Boolean preserveDoc) {
        SecurityTokenResponse securityTokenResponse = empowerClient.getSecurityToken();
        return empowerClient.exportDocument(docId,
                preserveDoc,
                securityTokenResponse.getBody().getCsrfToken(),
                securityTokenResponse.getSessionId());
    }

    //@Override
    public ApplicationResponse getApplications() {
        LOGGER.info("Getting the security token..");
        SecurityTokenResponse securityTokenResponse = empowerClient.getSecurityToken();
        LOGGER.info("Received the security token..");
        LOGGER.info("Getting applications from the Empower database...");
        return empowerClient.getApplications(securityTokenResponse.getBody().getCsrfToken(), securityTokenResponse.getSessionId());
    }

    //@Override
    public DocumentMetadataResponse getDocumentMetadata(String docId, String bearerToken) {
        LOGGER.info("Getting the security token..");
        SecurityTokenResponse securityTokenResponse = empowerClient.getSecurityToken();
        LOGGER.info("Received the security token..");
        LOGGER.info("CSRFToken: {}", securityTokenResponse.getBody().getCsrfToken());
        LOGGER.info("SessionId: {} ", securityTokenResponse.getSessionId());
        DocumentMetadataResponse empowerDocumentResponse = empowerClient.getDocumentMetadata(docId,
                securityTokenResponse.getBody().getCsrfToken(),
                securityTokenResponse.getSessionId());
        LOGGER.info("The document metadata imported...");
        LOGGER.info(empowerDocumentResponse.toString());
        return empowerDocumentResponse;
    }

    //@Override
    public DocumentsResponse getDocuments() {
        LOGGER.info("Getting the security token..");
        SecurityTokenResponse securityTokenResponse = empowerClient.getSecurityToken();
        LOGGER.info("Received the security token..");
        LOGGER.info("Getting documents from the Empower database...");
        return empowerClient.getDocuments(securityTokenResponse.getBody().getCsrfToken(), securityTokenResponse.getSessionId());
    }
*/
}
