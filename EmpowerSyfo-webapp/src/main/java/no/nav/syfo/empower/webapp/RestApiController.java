package no.nav.syfo.empower.webapp;

import io.swagger.annotations.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

import static org.springframework.http.HttpMethod.*;


@SwaggerDefinition
@Api(tags = "Operations on OpenText Exstream Empower API from the SYFO backend")
@RestController
@RequestMapping(value = "api/v1")
public class RestApiController {
    
	@Value("${otds.url}")
    private String otdsUrl;
    
    @Value("${otds.client_id}")
    private String client_id;
    
    @Value("${otds.client_secret}")
    private String client_secret;
    
    @Value("${otds.scope}")
    private String scope;
    
    @Value("${empower.url}")
    private String empowerLocation;
    
    @Value("${otds.apiUrl}")
    private String apiUrl;
    
    @Value("${otds.apiUserName}")
    private String apiUserName;

    @Value("${otds.parola}")
    private String apiPassword;
    
    @Value("${otds.apiUrlUsersFilter}")
    private String apiUrlUsersFilter;
    
    @Value("${otds.resource}")
    private String resource;

	@Value("${cs.url}")
    private String csUrl;
    
    @Value("${ews.wsdl.location}")
    private String ewsWsdlLocation;
    
    @Value("${ews.preview.fileName}")
    private String ewsPreviewFileName;
    
    @Value("${ews.preview.pubFile}")
    private String ewsPreviewPubFile;
    
    @Value("${ews.preview.users}")
    private String ewsPreviewUsers;    
    
    private static final Logger LOGGER = LoggerFactory.getLogger(RestApiController.class);
    /*
    @ApiOperation(value = "Get Empower location",
                  notes = "Get the URL for the Empower application",
                  httpMethod = "GET",
                  produces = "application/json")
    @ApiResponses(value = {
        @ApiResponse(code = 200, message = "EmpowerApplicationResponse received")
        , @ApiResponse(code = 500, message = "Unexpected error")})
    @RequestMapping(value = "/getempowerlocation", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody String getEmpowerlocation() {
        LOGGER.info("Receiving the 'getEmpowerlocation' request..");        
        return "{ \"empowerLocation\": \"" + empowerLocation + "\" }";
    }
    */
    
    //Pavel
    /*
    @ApiOperation(value = "Calling EWS Exstream Engine",
	            notes = "Requests for generating a document",
	            httpMethod = "POST", 
	            produces = "application/json")
	@ApiResponses(value = {
	@ApiResponse(code = 200, message = "Document created")
	, @ApiResponse(code = 500, message = "Unexpected error")})
	@RequestMapping(value = "/callEws", method = RequestMethod.POST, consumes = {"application/JSON", "application/XML"}, produces = { "application/json", "application/xml" })
	public @ResponseBody EwsOutput callEWS(@RequestBody EwsInput request) throws EwsClientException {
		LOGGER.info("Getting the request..");
		LOGGER.info("EngineWebService will be called now..");
		return ewsClient.invoke(request);
	}
	
	@ApiOperation(value = "Generate Empower document",
	   notes = "Create a document via EWS, save the document into the Empower database and send back the ID of the document",
	   httpMethod = "POST",
	   consumes = "application/json",
	   produces = "application/json")
	@ApiResponses(value = {
	@ApiResponse(code = 200, message = "FrontendData received")
	, @ApiResponse(code = 500, message = "Unexpected error")})
	@RequestMapping(value = "/generateEmpowerDocument", method = RequestMethod.POST, headers = {"content-type=application/json"}, produces = "application/json")
	public @ResponseBody ImportDocumentResponse generateEmpowerDocument(@RequestBody FrontendData frontendData) throws EwsClientException {
		LOGGER.info("Receiving the 'generateEmpowerDocument' request..");
		LOGGER.info(frontendData.toString());
		EwsComposeRequestFactory factory = new EwsComposeRequestFactoryImplArena(frontendData, ewsDriverFileName, ewsPubFile, ewsDriverEncoding);
		EwsInput request = factory.createEwsComposeRequest();
		LOGGER.trace(request.toString());
		
		EwsOutput ewsOutput = ewsClient.invoke(request);
		ImportDocumentResponse empowerDocumentResponse = empowerClientService.importDocument(ewsOutput.getEngineOutputs().get(0).getFileOutput());
		LOGGER.info("EmpowerResponse received and ready to be sent to the original requester...");
		return empowerDocumentResponse;
	}
	
	@ApiOperation(value = "Get Empower applications",
	   notes = "Get all applications from the Empower database",
	   httpMethod = "GET",
	   produces = "application/json")
	@ApiResponses(value = {
	@ApiResponse(code = 200, message = "EmpowerApplicationResponse received")
	, @ApiResponse(code = 500, message = "Unexpected error")})
	@RequestMapping(value = "/getApplications", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody ApplicationResponse getApplications() {
		LOGGER.info("Receiving the 'getApplications' request..");
		return empowerClientService.getApplications();
	}
	
	@ApiOperation(value = "Get Empower documents",
	   notes = "Get all documents from the Empower database",
	   httpMethod = "GET",
	   produces = "application/json")
	@ApiResponses(value = {
	@ApiResponse(code = 200, message = "EmpowerDocumentsResponse received")
	, @ApiResponse(code = 500, message = "Unexpected error")})
	@RequestMapping(value = "/getDocuments", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody DocumentsResponse getDocuments() {
		LOGGER.info("Receiving the 'getDocuments' request..");
		return empowerClientService.getDocuments();
	}
	*/

	/*
	@ApiOperation(value = "Get Empower location",
	   notes = "Get the URL for the OpenText Exstream Empower server application",
	   httpMethod = "GET",
	   produces = "application/json")
	@ApiResponses(value = {
	@ApiResponse(code = 200, message = "EmpowerApplicationResponse received")
	, @ApiResponse(code = 500, message = "Unexpected error")})
	@RequestMapping(value = "/getEmpowerLocation", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody String getEmpowerLocation() {
		LOGGER.info("Receiving the '/getEmpowerLocation' request..");
		String response = "{ "
		 + "\"empowerLocation\": \"" + empowerLocation + "\", "
		 + "\"otds\": { "
		 + "\"url\": \"" + otdsUrl + "\", "
		 + "\"client_id\": \"" + client_id + "\", "
		 + "\"client_secret\": \"" + client_secret + "\", "
		 + "\"scope\": \"" + scope + "\""
		 + " }"
		 + " }";
		LOGGER.info(response);
		return response;
	}
	*/
	
	@RequestMapping(value = {"/communications"}, method = RequestMethod.POST)
    public ResponseEntity<String> getCommunications(@RequestBody Object object) {
        LOGGER.info("Receiving the '/communications' request...");
        LOGGER.info(object.toString());
        String jsonString = "{\n"
                + "    \"status\": \"success\",\n"
                + "    \"data\": {\n"
                + "        \"id\": \"1D185104-F479-5B46-8F3F-9A6817DB479C\",\n"
                + "        \"attributeMap\": {},\n"
                + "        \"result\": [\n"
                + "            {\n"
                + "                \"content\": {\n"
                + "                    \"data\": \"eyJGVU5LU0pPTiI6ICJTRU5UUkFMUFJJTlQifQ==\", \n"
                + "                    \"contentType\": \"application/octet-stream\",\n"
                + "                    \"streamingFilePath\": null,\n"
                + "                    \"empty\": false\n"
                + "                }\n"
                + "            }\n"
                + "        ]\n"
                + "    }\n"
                + "}";
        try {
            JSONObject jsonObject = new JSONObject(jsonString);
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        } catch (JSONException ex) {
			LOGGER.error("Error parsing JSON: {}", ex.getMessage());
            return new ResponseEntity<>("Error parsing JSON", HttpStatus.BAD_REQUEST);
        }
    }

	
	@ApiOperation(value = "Get properties variables",
			   notes = "Get properties variables, OTDS API, username etc.",
			   httpMethod = "GET",
			   produces = "application/json")
	@ApiResponses(value = {
	@ApiResponse(code = 200, message = "PropertiesResponse received"), @ApiResponse(code = 500, message = "Unexpected error")})
	@RequestMapping(value = "/GetProperties", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody String getProperties() {
		LOGGER.info("Receiving '/GetProperties' request..");
		String response = "{ "
		 + "\"empowerLocation\": \"" + empowerLocation + "\", "
		 + "\"otds\": { "
		 + "\"url\": \"" + otdsUrl + "\", "
		 + "\"client_id\": \"" + client_id + "\", "
		 + "\"client_secret\": \"" + client_secret + "\", "
		 + "\"scope\": \"" + scope + "\", "
		 + "\"apiUrl\": \"" + apiUrl + "\", "
		 + "\"apiUserName\": \"" + apiUserName + "\", "
		 + "\"apiPassword\": \"" + apiPassword + "\", "
		 + "\"apiUrlUsersFilter\": \"" + apiUrlUsersFilter + "\", "
		 + "\"resource\": \"" + resource + "\" "
		 + " }, "
		 + "\"csUrl\":  \"" + csUrl +  "\", "
		 + "\"ewsWsdlLocation\": \"" + ewsWsdlLocation + "\", "
		 + "\"ewsPreviewFileName\": \"" + ewsPreviewFileName + "\", "
		 + "\"ewsPreviewPubFile\": \"" + ewsPreviewPubFile + "\", "
		 + "\"ewsPreviewUsers\": \"" + ewsPreviewUsers + "\" "
		 + " }";
		LOGGER.info(response);
		return response;
	}
	
	/*
	@ApiOperation(value = "Preview Empower document",
	   notes = "Get a PDF made from the Empower document",
	   httpMethod = "POST",
	   produces = "application/x-www-form-urlencoded")
	@ApiResponses(value = {
	@ApiResponse(code = 200, message = "PDF preview from Empower document received")
	, @ApiResponse(code = 500, message = "Unexpected error")})
	@RequestMapping(value = "/previewDocument", method = RequestMethod.POST, produces = "application/x-www-form-urlencoded")
	public @ResponseBody byte[] previewDocument(String docId, boolean preserveDoc) throws EwsClientException {
	// 1. export the mpw document http://localhost:8180/empower/resource/documents/{docId}/export
	byte[] empowerDoc = empowerClientService.exportDocument(docId, preserveDoc);
	// 2. get metadata to get the name of the pub file for preview   /<context>/resource/documents/{docId}/meta
	DocumentMetadataResponse empowerDocumentResponse = empowerClientService.getDocumentMetadata(docId);
	String previewPubFile = empowerDocumentResponse.getBody().getDocument().getPreviewPubFile();
	// 3. run EWS with the mpw document as input and retrieve the PDF in byte[]
	EwsComposeRequestFactory factory = new EwsComposeRequestFactoryImplPreview(previewPubFile, empowerDoc);
	EwsOutput response = ewsClient.invoke(factory.createEwsComposeRequest());
	// 4. return the PDF
	return response.getEngineOutputs().get(0).getFileOutput();
	}
	*/

	@ApiOperation(value = "Login into the OTDS",
			notes = "Login into the OTDS with the credentials (username/password, Empower client_id and scope) provided in the application properties.",
			httpMethod = "GET",
			produces = "application/json")
	@RequestMapping(value = "/Login", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<String> loginGET() {
		return login();
	}

	@ApiOperation(value = "Login into the OTDS",
			notes = "Login into the OTDS with the credentials (username/password, Empower client_id and scope) provided in the application properties.",
			httpMethod = "POST",
			produces = "application/json")
	@RequestMapping(value = "/Login", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> login() {
		LOGGER.info("Receiving '/Login' request.");

		LOGGER.info("Link to OTDS: {} - sending POST request to OTDS for user '{}'", this.otdsUrl, this.apiUserName);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> map= new LinkedMultiValueMap<>();
		map.add("grant_type", "password");
		map.add("username", this.apiUserName);
		map.add("password", this.apiPassword);
		map.add("client_id", this.client_id);
		map.add("client_secret", this.client_secret);
		map.add("scope", this.scope);

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.postForEntity( this.otdsUrl, request , String.class );
		//ResponseEntity<String> response = restTemplate.exchange(otdsUrl, POST, httpEntity, String.class);
		LOGGER.info("OTDS Response code: {} ", response.getStatusCode());
		LOGGER.info("OTDS Response body: {}", response.getBody());

		return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
	}

	@ApiOperation(value = "Get OTDS ticket",
			notes = "Getting OTDS ticket with the credentials (userName/password) provided in the SYFO application properties.",
			httpMethod = "GET",
			produces = "application/json")
	@RequestMapping(value = "/GetOTDSTicket", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<String> getOTDSTicketGET() {
		return getOTDSTicket();
	}

	@ApiOperation(value = "Get OTDS ticket",
			notes = "Getting OTDS ticket with the credentials (userName/password) provided in the SYFO application properties.",
			httpMethod = "POST",
			produces = "application/json")
	@RequestMapping(value = "/GetOTDSTicket", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> getOTDSTicket() {
		LOGGER.info("Receiving '/GetOTDSTicket' request.");
		// "apiUrl": "https://localhost:9445/otdsws/rest/authentication/credentials",
		LOGGER.info("Link to OTDS: {} - sending request to OTDS for user '{}'", this.apiUrl, this.apiUserName);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String body = "{ \"userName\": \"" + this.apiUserName + "\", \"password\": \"" + this.apiPassword + "\" }";

		HttpEntity<String> request = new HttpEntity<>(body, headers);

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.postForEntity( this.apiUrl, request , String.class );

		LOGGER.info("OTDS Response code: {} ", response.getStatusCode());
		LOGGER.info("OTDS Response body: {}", response.getBody());

		return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
	}

	@ApiOperation(value = "Get OTDS user",
			notes = "Getting an OTDS user properties with the OTDS ticket created from credentials (userName/password) provided in the SYFO application properties.",
			httpMethod = "GET",
			produces = "application/json")
	@RequestMapping(value = "/GetOTDSUser", method = RequestMethod.GET, produces = "application/json")
	public ResponseEntity<String> getOTDSUser(@RequestParam("OTDSTicket") String otdsTicket, @RequestParam("user") String user) {
		LOGGER.info("Receiving '/GetOTDSUser' request.");
		// "otds.apiUrlUsersFilter": "https://localhost:9445/otdsws/rest/users/",
		LOGGER.info("Link to OTDS: {} - sending request to OTDS...", this.apiUrlUsersFilter + user);

		HttpHeaders headers = new HttpHeaders();
		headers.add("OTDSTicket", otdsTicket);
		HttpEntity<String> request = new HttpEntity<>(headers);

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.exchange(this.apiUrlUsersFilter + user, HttpMethod.GET, request, String.class);

		LOGGER.info("OTDS Response code: {} ", response.getStatusCode());
		LOGGER.info("OTDS Response body: {}", response.getBody());

		return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
	}

	/*
    @RequestMapping(value = "/GetSecurityToken", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<SecurityTokenResponse> getSecurityToken(@RequestBody String bearer,
																  @RequestHeader(HttpHeaders.ORIGIN) String origin,
																  HttpServletRequest httpRequest) {
        LOGGER.info("Receiving '/GetSecurityToken' request with bearer token");
		LOGGER.info("from Origin: {}", origin);
		LOGGER.info("httpRequest URI: {}   Context path: {}", httpRequest.getRequestURI(), httpRequest.getContextPath());
        LOGGER.info("Bearer: {}", bearer);

		// Pavel: adjusted 06.01.2025 for "Set-Cookie" headers
		ResponseEntity<SecurityTokenResponse> response = empowerClientService.getSecurityToken(bearer);
		HttpHeaders httpHeadersResponse = response.getHeaders();
		List<String> responseCookies = Objects.requireNonNull(httpHeadersResponse.get("Set-Cookie"));
		LOGGER.info("Empower response cookies: {} ", responseCookies);

		SecurityTokenResponse securityTokenResponse = response.getBody();
        assert securityTokenResponse != null;
        return new ResponseEntity<>(securityTokenResponse, this.composeSessionAuthenticationHeaders(httpRequest.getContextPath(), securityTokenResponse.getBody().getCsrfToken(), securityTokenResponse.getSessionId()), HttpStatus.OK);
	}
*/

	@ApiOperation(value = "Get the security token from the Empower",
			notes = "Empower provides XSRF token and JSESSIONID cookie.",
			httpMethod = "POST",
			produces = "application/json")
	@RequestMapping(value = "/GetSecurityToken", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> getSecurityToken(@RequestBody String bearer,
													@RequestHeader(HttpHeaders.ORIGIN) String origin,
												   @RequestHeader("user") String user,
													@RequestHeader("isAuthorized") boolean isAuthorized,
													HttpServletRequest httpRequest) {
		LOGGER.info("Receiving '/GetSecurityToken' request with bearer token");
		LOGGER.info("from Origin: {}, user: {}, isAuthorized: {}", origin, user, isAuthorized);
		LOGGER.info("httpRequest URI: {}   Context path: {}", httpRequest.getRequestURI(), httpRequest.getContextPath());
		LOGGER.info("Bearer: {}", bearer);

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setBearerAuth(bearer);
		HttpEntity<String> httpEntity = new HttpEntity<>(null, httpHeaders);

		RestTemplate restTemplate = new RestTemplate();
		String link = empowerLocation + "/resource/GetToken";
		LOGGER.info("Link to Empower: {} - sending request to Empower...", link);
		ResponseEntity<String> response = restTemplate.exchange(link, GET, httpEntity, String.class);
		LOGGER.info("Empower response code: {} ", response.getStatusCode());
		HttpHeaders httpHeadersResponse = response.getHeaders();
		List<String> responseCookies = Objects.requireNonNull(httpHeadersResponse.get("Set-Cookie"));
		LOGGER.info("Empower response cookies: {} ", responseCookies);
		String responseBody = response.getBody();
		LOGGER.info("Empower response body: {}", responseBody);

		AtomicReference<String> jsessionIdValue = new AtomicReference<>("");
		HttpHeaders httpHeadersNewResponse = new HttpHeaders();
		httpHeadersResponse.forEach((k, v) -> {
        //    LOGGER.info(" Response header '{}':{}", k, v);
			if (k.equals("Set-Cookie")) {
				LOGGER.info(" Response cookie header '{}':{}", k, v);
				for (String c: v) {
					// extract jsessionid value
					// an example string to search through:
					// Set-Cookie:[XSRF-TOKEN=c96f35d6-4ce3-4efa-9238-7b9957b1f238; Path=/empower; Secure; SameSite=None, JSESSIONID=D4ED680DD64A8B704C9378B614E43E41; Path=/empower; Secure; HttpOnly;
					if (c.contains("JSESSIONID")) {
						int startJsessionId = c.indexOf("JSESSIONID");
						int startJsessionIdValue = c.indexOf("=", startJsessionId)+1;
						int endJsessionIdValue = c.indexOf(";", startJsessionId);
						jsessionIdValue.set(c.substring(startJsessionIdValue, endJsessionIdValue));
					}

					// 01.07.2025 testing - keep the original cookie if the user is authorized to edit Empower documents (a part of oTMemberOf)
					if (isAuthorized) {
						// replace the /Path from Empower with the empty path so all apps before nginx will send the cookies
						c = c.replaceAll("Path=/[a-z,A-Z,0-9,_]*;", "Path=/;");
						httpHeadersNewResponse.add("Set-Cookie", c);
						LOGGER.info("   The user is authorized to edit Empower documents.");
						LOGGER.info("   Cookie replaced to: {} ", c);
					} else {
						// replace the value of the cookie from Empower with 'notAuthorized' value
						c = c.replaceFirst("=[a-z,A-Z,0-9,-]*;", "=notAuthorized;");
						httpHeadersNewResponse.add("Set-Cookie", c);
						jsessionIdValue.set("notAuthorized");
						LOGGER.warn("   The user is NOT authorized to edit Empower documents!");
						LOGGER.info("   The cookie is set to 'notAuthorized' value!");
						LOGGER.info("   Cookie replaced to: {} ", c);
					}
					// and now also replace the /Path
					//c = c.replaceAll("Path=/[a-z,A-Z,0-9,_]*;", "Path=" + httpRequest.getContextPath() + ";");
					// test with an empty path
					//c = c.replaceAll("Path=/[a-z,A-Z,0-9,_]*;", "Path=/;");
					//httpHeadersNewResponse.add("Set-Cookie", c);

				}
			} else {
				// not necessary to copy all http headers into the new response
			//	httpHeadersNewResponse.addAll(k, v);
			}
		});

		assert responseBody != null;
		String responseBodyAdjusted = "";
		if (responseBody.startsWith("{")) {
			responseBodyAdjusted = "{ \"jsessionId\": \"" + jsessionIdValue + "\", \n" + responseBody.substring(1);
			LOGGER.info("Empower response body adjusted: {}", responseBodyAdjusted);
		}
        return new ResponseEntity<>(responseBodyAdjusted, httpHeadersNewResponse, HttpStatus.OK);
	}


    //Pavel \END

	@ApiOperation(value = "Gets Empower document metadata",
			notes = "Gets the Empower document metadata for a given document ID.",
			httpMethod = "POST",
			produces = "application/json")
	@RequestMapping(value = "/GetDocumentMetadata", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> getDocumentMetadata(@RequestParam("docId") String docId,
													  @RequestParam("bearerToken") String bearerToken) {
		LOGGER.info("Receiving '/GetDocumentMetadata' request.");
		LOGGER.info("Document ID: {}", docId);

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setBearerAuth(bearerToken);
		HttpEntity<String> httpEntity = new HttpEntity<>("parameters", httpHeaders);
		RestTemplate restTemplate = new RestTemplate();
		String link = empowerLocation + "/resource/documents/" + docId + "/meta";
		LOGGER.info("Link to Empower: {} - sending GET request to Empower with BearerToken authentication", link);
		ResponseEntity<String> response = restTemplate.exchange(link, GET, httpEntity, String.class);
		LOGGER.info("Empower response code: {} ", response.getStatusCode());
		LOGGER.info("Empower response body: {}", response.getBody());

		return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
	}

	@ApiOperation(value = "Updates an Empower document metadata",
			notes = "Updates an Empower document metadata with a given 'docTags' parameter.",
			httpMethod = "POST",
			produces = "application/json")
	@RequestMapping(value = "/UpdateDocumentMetadata", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<String> updateDocumentMetadata(@RequestParam("docId") String docId,
														 @RequestParam("bearerToken") String bearerToken,
														 @RequestParam("xsrfHeader") String xsrfHeader,
														 @RequestParam("xsrfToken") String xsrfToken,
														 @RequestHeader(HttpHeaders.COOKIE) String cookies,
														 @RequestParam("docTags") String docTags) {
		LOGGER.info("Receiving '/UpdateDocumentMetadata' request.");
		LOGGER.info("Cookies: {} ", cookies);
		LOGGER.info("Document ID: {}", docId);
		LOGGER.info("New document docTags: {}", docTags);

		HttpHeaders httpHeaders = new HttpHeaders();
		//httpHeaders.setBearerAuth(bearerToken);
		httpHeaders.add(xsrfHeader, xsrfToken);
		httpHeaders.add("Cookie", cookies);
		// MediaType.APPLICATION_FORM_URLENCODED is important, otherwise docTags will not work
		httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		HttpEntity<String> httpEntity = new HttpEntity<>(docTags, httpHeaders);

		RestTemplate restTemplate = new RestTemplate();
		String link = empowerLocation + "/resource/documents/" + docId + "/meta";
		LOGGER.info("Link to Empower: {} - sending POST request to Empower with jSessionId and xsrfToken", link);
		ResponseEntity<String> response = restTemplate.exchange(link, POST, httpEntity, String.class);
		LOGGER.info("Empower response code: {} ", response.getStatusCode());
		LOGGER.info("Empower response body: {}", response.getBody());

		return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
	}

	@ApiOperation(value = "Export a given Empower document",
			notes = "Exports a given Empower document into a byte[] array, the parameter 'preserveDoc' is either true (keep the document active) or false (move the document into thrash).",
			httpMethod = "POST",
			produces = "application/json")
	@RequestMapping(value = "/ExportDocument", method = RequestMethod.POST, produces = "application/json")
	public ResponseEntity<byte[]> getExport(@RequestParam("docId") String docId,
											@RequestParam("bearerToken") String bearerToken,
											@RequestParam("xsrfHeader") String xsrfHeader,
											@RequestParam("xsrfToken") String xsrfToken,
											@RequestHeader(HttpHeaders.COOKIE) String cookies,
											@RequestParam("preserveDoc") String preserveDoc) {
		LOGGER.info("Receiving '/ExportDocument' request.");
		LOGGER.info("Cookies: {} ", cookies);
		LOGGER.info("Document ID: {}", docId);

		HttpHeaders httpHeaders = new HttpHeaders();
		//httpHeaders.setBearerAuth(bearerToken);
		httpHeaders.add(xsrfHeader, xsrfToken);
		httpHeaders.add("Cookie", cookies);
		// MediaType.APPLICATION_FORM_URLENCODED is important, otherwise "preserveDoc=true" will not work
		httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		HttpEntity<String> httpEntity = new HttpEntity<>(preserveDoc, httpHeaders);

		RestTemplate restTemplate = new RestTemplate();
		String link = empowerLocation + "/resource/documents/" + docId + "/export";
		LOGGER.info("Link to Empower: {} - sending POST request to Empower...", link);
		ResponseEntity<byte[]> response = restTemplate.exchange(link, POST, httpEntity, byte[].class);
		LOGGER.info("Empower response code: {} ", response.getStatusCode());

		return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
	}

	@ApiOperation(value = "Delete a given Empower document",
			notes = "Deletes a given Empower document (moves the document from active documents into thrash).",
			httpMethod = "DELETE",
			produces = "application/json")
	@RequestMapping(value = "/DeleteDocument", method = RequestMethod.DELETE, produces = "application/json")
	public ResponseEntity<String> deleteDocument(@RequestParam("docId") String docId,
												 @RequestParam("bearerToken") String bearerToken,
												 @RequestParam("xsrfHeader") String xsrfHeader,
												 @RequestParam("xsrfToken") String xsrfToken,
												 @RequestHeader(HttpHeaders.COOKIE) String cookies) {
		LOGGER.info("Receiving '/DeleteDocument' request.");
		LOGGER.info("Cookies: {} ", cookies);
		LOGGER.info("Document ID: {}", docId);

		HttpHeaders httpHeaders = new HttpHeaders();
		//httpHeaders.setBearerAuth(bearerToken);
		httpHeaders.add(xsrfHeader, xsrfToken);
		httpHeaders.add("Cookie", cookies);
		HttpEntity<String> httpEntity = new HttpEntity<>(null, httpHeaders);

		RestTemplate restTemplate = new RestTemplate();
		String link = empowerLocation + "/resource/documents/" + docId;
		LOGGER.info("Link to Empower: {} - sending DELETE request to Empower...", link);
		ResponseEntity<String> response = restTemplate.exchange(link, DELETE, httpEntity, String.class);
		LOGGER.info("Empower response code: {} ", response.getStatusCode());
		LOGGER.info("Empower response body: {}", response.getBody());

		return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
	}


    //STEFAN
    @RequestMapping(value = {"/saveInLog"},  params = { "docId", "restOperation", "restPayload64" }, method = RequestMethod.POST)
    public ResponseEntity<String> postLog(@RequestParam("docId") String docId, @RequestParam("restOperation") String restOperation, @RequestParam("restPayload64") String restPayload64) {
        LOGGER.info("SYFO_LOG > Document_UUID: {}; {}; {}", docId, restOperation, restPayload64);
        return new ResponseEntity<>("Done", HttpStatus.OK);
    }    
    
	@ApiOperation(value = "Check Users Resource",
			   notes = "Check Users Resource, knowing emailen",
			   httpMethod = "GET",
			   produces = "application/json")
	@ApiResponses(value = {
	@ApiResponse(code = 200, message = "CheckResources received"), @ApiResponse(code = 500, message = "Unexpected error")})
	@RequestMapping(value = "/checkresources", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody String CheckUsersResources() {
		LOGGER.info("Receiving the 'checkResource' request..");		
		LOGGER.info("Get OTDSticket");		
		LOGGER.info("Preparing the answer here.");
		String response = "{ "
		 + "\"isResourceHere\": \"yes\", "
		 + "\"usersemail\": \"otadmin@otds.check\" "
		 + " }";
		LOGGER.info(response);
		return response;
	}
	//STEFAN END

    
    @ExceptionHandler(HttpClientErrorException.class)
    public final ResponseEntity<String> handleHttpClientErrorException(HttpClientErrorException ex) {
		if (ex instanceof HttpClientErrorException.Unauthorized) {
			LOGGER.error("Unauthorized (401): {}", ex.getMessage());
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		} else if (ex instanceof HttpClientErrorException.Forbidden) {
			LOGGER.error("Forbidden (403): {}", ex.getMessage());
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		} else if (ex instanceof HttpClientErrorException.NotFound) {
            LOGGER.error("Not found (404): {}", ex.getMessage());
			return new ResponseEntity<>(ex.getResponseBodyAsString(), HttpStatus.NOT_FOUND);
		} else if (ex instanceof HttpClientErrorException.MethodNotAllowed) {
			LOGGER.error("Method not allowed (405)");
			return new ResponseEntity<>(ex.getResponseBodyAsString(), HttpStatus.METHOD_NOT_ALLOWED);
		} else if (ex instanceof HttpClientErrorException.NotAcceptable) {
			LOGGER.error("Not acceptable (406)");
			return new ResponseEntity<>(ex.getResponseBodyAsString(), HttpStatus.NOT_ACCEPTABLE);
		}
		else {
			LOGGER.error(ex.getClass().getName());
			LOGGER.error("Message: {}", ex.getMessage());
			LOGGER.error("ResponseBody: {}", ex.getResponseBodyAsString());
			LOGGER.error("StatusText: {}", ex.getStatusText());
			return new ResponseEntity<>(ex.getResponseBodyAsString(), HttpStatus.BAD_REQUEST);
		}

    }
    
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public final ResponseEntity<String> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        LOGGER.error(ex.getClass().getName());
        LOGGER.error("Message: {}", ex.getMessage());
        LOGGER.error(ex.toString());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

	/**
	 * Developers must use a new cookie setting:
	 * SameSite=None
	 * to designate cookies for cross-site access.
	 * When the SameSite=None attribute is present,
	 * an additional Secure attribute must be used so cross-site cookies
	 * can only be accessed over HTTPS connections.
	 * @param xsrfToken XSRF-TOKEN
     * @param jSessionId JSESSIONID
     * @return headers with "Set-Cookie" for JSESSIONID and XSRF-TOKEN
	 */
	private MultiValueMap<String, String> composeSessionAuthenticationHeaders(String originContextPath, String xsrfToken, String jSessionId) {
		MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
		String path = "/empower";
		try {
			path = new URI(empowerLocation).getPath();
		} catch (URISyntaxException e) {
			LOGGER.error(e.getMessage());
			LOGGER.warn("The default path '/empower' will be used instead.");
		}

		// commented out 07.05.2025 because iFrame should be controlled by SSO
		//headers.add("Set-Cookie", "JSESSIONID=" + sessionId + "; Path=" + path + "; Secure; HttpOnly; SameSite=None");
		//headers.add("Set-Cookie", "XSRF-TOKEN=" + securityToken + "; Path=" + path + "; Secure; SameSite=None");

		// 04.05.2025 added
		String jsessionId = "JSESSIONID=" + jSessionId + "; Path=" + originContextPath + "; Secure; HttpOnly; SameSite=None";
		String xsrfTokenCookie = "XSRF-TOKEN=" + xsrfToken + "; Path=" + originContextPath+ "; Secure; SameSite=None";
		headers.add("Set-Cookie", jsessionId);
		headers.add("Set-Cookie", xsrfTokenCookie);
		LOGGER.info("Set-Cookie: {} ", jsessionId);
		LOGGER.info("Set-Cookie: {} ", xsrfTokenCookie);
		return headers;
	}

}
