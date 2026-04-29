package no.nav.syfo.empower.webapp;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.HttpMethod.*;

/**
 * @author ppajer
 */
public class RestApiControllerTest {

    private final String docId = "6e08ce8a-da9b-49c2-88c4-dc1c9ac46062";
    private final String apiUrl = "https://localhost:9445/otdsws/rest/authentication/credentials";
    private final String apiUserName = "otadmin@otds.admin";
    private final String apiPassword = "xxx";
    private final String otdsUrl = "https://localhost:9445/otdsws/login";
    private final String apiUrlUsersFilter = "https://localhost:9445/otdsws/rest/users/";
    private final String userFromAddressBar = "otadmin";
    private final String empowerLocation = "https://localhost:9443/empower";

    private static final Logger LOGGER = LoggerFactory.getLogger(RestApiControllerTest.class);

    /**
     * Make sure that the CACERTS file is updated, otherwise you get security issues.
     */
    @Test
    public void test01_login() {

        LOGGER.info("Receiving '/login' request.");

        RestTemplate restTemplate = new RestTemplate();
        LOGGER.info("Link: {} ", this.otdsUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map= new LinkedMultiValueMap<>();
        map.add("grant_type", "password");
        map.add("username", this.apiUserName);
        map.add("password", this.apiPassword);
        map.add("client_id", "Empower");
        map.add("client_secret", "4Pj49bl5YytVpqDnKq6q559rJ8Ta4MJM");
        map.add("scope", "resource:Empower");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        ResponseEntity<String> response = restTemplate.postForEntity( otdsUrl, request , String.class );
        LOGGER.info("Response code: {} ", response.getStatusCode());
        LOGGER.info("Response body: {}", response.getBody());
    }

    @Test
    public void getSecurityToken() {
        LOGGER.info("Receiving '/GetSecurityToken' request.");
        // tested OK when the bearerToken, xsrfToken and JSESSIONID are set up correctly (JSESSIONID is required)
        // it also works when the bearerToken is not set up for authorization but the JSESSIONID and xsrfToken are set up
        String bearerToken = "eyJraWQiOiIzNzdmMGFjOWU4NjFlMTIyNzY2NGQ3ODljOWE4OTA1YTA1MTNlNzc2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJiNWYzMTM4My04ZjgxLTNhZDgtOTJiMi0yMjQyOTc5Y2MxODIiLCJzY3AiOlsicmVzb3VyY2U6RW1wb3dlciJdLCJkbXAiOnsiT1REU19DUkVEU19BVVRIIjoidHJ1ZSIsIk9URFNfSEFTX1BBU1NXT1JEIjoidHJ1ZSJ9LCJydGkiOiI0MTE0Y2U4Ni1iMTIzLTQxM2MtODE0MC0yNDY4YzA5MzI2MGUiLCJzYXQiOjE3NDc0ODYwNzEsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0Ojk0NDUvb3Rkc3dzIiwiZ3J0IjoicGFzc3dvcmQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJwaWQiOiJvdGRzLmFkbWluIiwicmlkIjp7ImJlZjJhM2M5LTM3MGItNDIwZi05YWYxLTU1YjhkNjc3MDQyMCI6Im90YWRtaW5Ab3Rkcy5hZG1pbiJ9LCJ0aWQiOiIiLCJzaWQiOiI1ZWNhN2EwMS02M2VkLTRjMTYtOTgwZC1iZTg0ZDFmZjk1MDEiLCJ1aWQiOiJvdGFkbWluQG90ZHMuYWRtaW4iLCJ1bm0iOiJvdGFkbWluIiwibmFtZSI6IiIsImV4cCI6MTc0NzQ4OTY3MSwiaWF0IjoxNzQ3NDg2MDcxLCJqdGkiOiI4ODI1YWQ0ZS02ZGZiLTQzYTQtOGEwZS00OTc5YzI1YjIyMTQiLCJjaWQiOiJFbXBvd2VyIn0.AKrXnKqg6UnJ-17SBHpoQZGlGB6y4jJbzthYh3ZdNYHomi9t90mdRcLreu_0Ht4g153S_YNE9Wjumo8iitAve3EEbQjV6FNHltA2wGUAgUuBE6eJhr-riO8GJU-ct2aOV3rXeqm89s23IVax6KhvPyqxeJgD33UqE6aFWVld_elvDAQ5CW3pmSZCUw_R9cpI2pIdVGxF53QrFYkSDPts4anOo1FDjgjAfBZL4gV0baZUvr993WSeNA39gJADgUk-NfbF82se1nXO_xAnK6Y7A-2GszrkyLcS1lw008iozSrQx93s6AUhpqb5F3ZNN7VSHPCYu73YrO_kTwsRf1U1sw";
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(bearerToken);
        HttpEntity<String> httpEntity = new HttpEntity<>(null, httpHeaders);

        RestTemplate restTemplate = new RestTemplate();
        String link = empowerLocation + "/resource/GetToken";
        LOGGER.info("Link to Empower: {} ", link);
        ResponseEntity<String> response = restTemplate.exchange(link, GET, httpEntity, String.class);
        HttpHeaders httpHeadersResponse = response.getHeaders();
        List<String> responseCookies = Objects.requireNonNull(httpHeadersResponse.get("Set-Cookie"));
        LOGGER.info("Empower response cookies: {} ", responseCookies);
        LOGGER.info("Empower response code: {} ", response.getStatusCode());
        LOGGER.info("Empower response body: {}", response.getBody());

    }

    @Test
    public void getOTDSTicket() {
        LOGGER.info("Receiving '/GetOTDSTicket' request.");
        // "apiUrl": "https://localhost:9445/otdsws/rest/authentication/credentials",
        LOGGER.info("Link: {} ", this.apiUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{ \"userName\": \"" + this.apiUserName + "\", \"password\": \"" + this.apiPassword + "\" }";

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity( this.apiUrl, request , String.class );
        LOGGER.info("Response code: {} ", response.getStatusCode());
        LOGGER.info("Response body: {}", response.getBody());

    }

    @Test
    public void getOTDSUser() {
        LOGGER.info("Receiving '/GetOTDSUser' request.");
        // "apiUrlUsersFilter": "https://localhost:9445/otdsws/rest/users/",
        LOGGER.info("Link: {} ", this.apiUrlUsersFilter);

        LOGGER.info("Receiving '/GetOTDSUser' request.");
        // "otds.apiUrlUsersFilter": "https://localhost:9445/otdsws/rest/users/",
        LOGGER.info("Link: {} ", this.apiUrlUsersFilter + this.userFromAddressBar);

        String otdsTicket = "*OTDSSSO*AZBBQlNFdkFvZWZ5T053MlkwVG1feVJFcTlsd3A2OXdBUWdaUzg2bWNBM3JtZ1pTX24zc0I3WWdFQXZkdVFMQll3N3RkTF9hQVJLQ084c2UtZFR3YTdtSHI5emdvMEFtbjBfMmR3MGZJb1AyLUl3SDZmQ0IzZmgwNHBTWmp0TEpyb1BTLU9aLTY1YlRxQV91bEZfcTlob0VaNnRiYkNTWGNMZWRnWk9vTlJlVmVMcFVwMmtyMEoyVFFxQnFDdXJSWkt6dFhmWUpYTUpMMUEydHNWdjBJeFdOVXBHZFZ0Wmg0ei14V09tbGJpTXNrXzVNYWY3OThvVFlSNU9seDZrcERub1E4X2pzZXFLV0hLUThqSXFrZ1dBVTFwM0l0eXN5MmZxTjJEQnNfVFk1RW5HXzQyaXk5dmhRZVN3Q3ZrU0o3dnQ0eU41NVpOSXI4NUtPc1JMUjF0LXBXYlJJM08zVnpTRlBQUngwanYzb00yLXJDM0hqZElIQkxsd21oc3dwY09odVRqd0czQ21iSzZLUSoqAE4ASgAU9hD4PxQkKMg_CqRik-fkyIiQJO4AEFP4eeEBAkfCOhI9jEp1HnwAIKEjtmatqECiHCzHnT69vpoUYcfxVzDDwOt2yfAIctRGAAA*";
        HttpHeaders headers = new HttpHeaders();
        headers.add("OTDSTicket", otdsTicket);
        HttpEntity<String> request = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(this.apiUrlUsersFilter + this.userFromAddressBar, HttpMethod.GET, request, String.class);

        LOGGER.info("Response code: {} ", response.getStatusCode());
        LOGGER.info("Response body: {}", response.getBody());


    }

    @Test
    public void getExport() {
        LOGGER.info("Receiving '/Export' request.");
        LOGGER.info("Document ID: {}", docId);
        // tested OK when the bearerToken, xsrfToken and JSESSIONID are set up correctly (JSESSIONID is required)
        // it also works when the bearerToken is not set up for authorization but the JSESSIONID and xsrfToken are set up
        String bearerToken = "eyJraWQiOiIzNzdmMGFjOWU4NjFlMTIyNzY2NGQ3ODljOWE4OTA1YTA1MTNlNzc2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJiNWYzMTM4My04ZjgxLTNhZDgtOTJiMi0yMjQyOTc5Y2MxODIiLCJzY3AiOlsicmVzb3VyY2U6RW1wb3dlciJdLCJkbXAiOnsiT1REU19DUkVEU19BVVRIIjoidHJ1ZSIsIk9URFNfSEFTX1BBU1NXT1JEIjoidHJ1ZSJ9LCJydGkiOiJhNWVjZTkyZC03OGMxLTRhYzUtOGJkNS02ODk5MDkxZDhiN2UiLCJzYXQiOjE3NDY5OTQwMTUsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0Ojk0NDUvb3Rkc3dzIiwiZ3J0IjoicGFzc3dvcmQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJwaWQiOiJvdGRzLmFkbWluIiwicmlkIjp7ImJlZjJhM2M5LTM3MGItNDIwZi05YWYxLTU1YjhkNjc3MDQyMCI6Im90YWRtaW5Ab3Rkcy5hZG1pbiJ9LCJ0aWQiOiIiLCJzaWQiOiI5NjVlNzA4OC0xMTAyLTQxYWUtOWIxYS1lNDJkZWMzZWM2NWYiLCJ1aWQiOiJvdGFkbWluQG90ZHMuYWRtaW4iLCJ1bm0iOiJvdGFkbWluIiwibmFtZSI6IiIsImV4cCI6MTc0Njk5NzYxNSwiaWF0IjoxNzQ2OTk0MDE1LCJqdGkiOiIxYTIxNTJkMy0wNTlmLTQ0ZjEtYWZkZS1kYjAxYzA3ZjNiMWUiLCJjaWQiOiJFbXBvd2VyIn0.gaMLMM_QPsrdY-TX1LUfp0-J8-15CM33r7tNUepH32U4lIKSC1rMq2jG8b9s4jbd7i6aJgJNGvkwgvpI-_m0THqjFUWITQRqm06uys8O-n3LRjp2vNWpf38mT-nSmwM--BeU4nRX73iooVwig4GaRJzD5K60w55TqO1_wvbaMLPjdrqsDkPwD5LugraxcIHnITiKYe-y-dEHx2BmNH_buWyrHllXkK8eroQO9bkfAy5tGu4615yjCRAL6nG2EZgYN_QByOqdz7KF_dvlWatQbvQ8Sf5LyXuOaV2EV0BH06ZyH5IFR9v4rk4LrsJNfjZ4IlzZ4OtDbIKLPlt7hq_0TA";
        String xsrfToken = "d632b249-063a-4994-949f-8a6bf022c71e";
        HttpHeaders httpHeaders = new HttpHeaders();
        //httpHeaders.setBearerAuth(bearerToken);
        httpHeaders.add("X-CSRF-TOKEN", xsrfToken);
        httpHeaders.add("Cookie", "JSESSIONID=53583C64FEA7798C01612B3B148300E0");
        // MediaType.APPLICATION_FORM_URLENCODED is important, otherwise "preserveDoc=true" will not work
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<String> httpEntity = new HttpEntity<>("preserveDoc=true", httpHeaders);

        RestTemplate restTemplate = new RestTemplate();
        String link = empowerLocation + "/resource/documents/" + docId + "/export";
        LOGGER.info("Link to Empower: {} ", link);
        ResponseEntity<byte[]> response = restTemplate.exchange(link, POST, httpEntity, byte[].class);
        LOGGER.info("Empower response code: {} ", response.getStatusCode());
        LOGGER.info("Empower response body: {}", response.getBody());

    }

    @Test
    public void updateDocumentMetadata() {
        LOGGER.info("Receiving '/UpdateDocumentMetadata' request.");
        LOGGER.info("Document ID: {}", docId);

        // tested OK when the bearerToken, xsrfToken and JSESSIONID are set up correctly (JSESSIONID is required)
        // it also works when the bearerToken is not set up for authorization but the JSESSIONID and xsrfToken are set up
        String bearerToken = "eyJraWQiOiIzNzdmMGFjOWU4NjFlMTIyNzY2NGQ3ODljOWE4OTA1YTA1MTNlNzc2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJiNWYzMTM4My04ZjgxLTNhZDgtOTJiMi0yMjQyOTc5Y2MxODIiLCJzY3AiOlsicmVzb3VyY2U6RW1wb3dlciJdLCJkbXAiOnsiT1REU19DUkVEU19BVVRIIjoidHJ1ZSIsIk9URFNfSEFTX1BBU1NXT1JEIjoidHJ1ZSJ9LCJydGkiOiI2N2IzMDg4ZC1iZjNhLTQwNDEtYTZkMy1jN2M1NDllZThkNjEiLCJzYXQiOjE3NDc0ODIzODksImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0Ojk0NDUvb3Rkc3dzIiwiZ3J0IjoicGFzc3dvcmQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJwaWQiOiJvdGRzLmFkbWluIiwicmlkIjp7ImJlZjJhM2M5LTM3MGItNDIwZi05YWYxLTU1YjhkNjc3MDQyMCI6Im90YWRtaW5Ab3Rkcy5hZG1pbiJ9LCJ0aWQiOiIiLCJzaWQiOiJmMGYxZTJkNS1lMDE5LTRmMDEtODM0My03NmJlMjdjZTk4OTEiLCJ1aWQiOiJvdGFkbWluQG90ZHMuYWRtaW4iLCJ1bm0iOiJvdGFkbWluIiwibmFtZSI6IiIsImV4cCI6MTc0NzQ4NTk4OSwiaWF0IjoxNzQ3NDgyMzg5LCJqdGkiOiI1ODcxYzUyYy00MmE5LTQzMjUtODhiNi1iYmFhYTJlOWVhYzMiLCJjaWQiOiJFbXBvd2VyIn0.pn7o5-S6oLyzh3wYM-_tBBobpwIq1q0ahUH_2TyatQ39U_fl66-aKVY-Ndd1l-C4kMGvwMt1CXyz2MvEn3HcJkSalFLVLNkf3GtVwkdc2Ll5dEYVRbZZw9VOxYz04N7B_YHoRVqfMuPi1LLac7HqUOGQGLNxE7WQhxw2-d3PgVe1hN9jnprC3IPdg1ntxJGx67tFMq7slUwl0_NQKFiDZ5c-RfPjgE7VXPwYPyHrb4EGVpR_grsSzupeDC44erf9bpIFDhzpViFltYYYoD_GP3Tk7TKDS1OqbmBEbg_Krje_DUVtnL6nLT412VfrIwDpCHmHS5yzujQjw_T8JabnSg";
        String xsrfHeader = "X-CSRF-TOKEN";
        String xsrfToken = "515d652d-228c-4768-a9de-ebda90fc8bca";
        String sessionId = "4810CDE5175EC3F36AB39665DCEC88BA";
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.addAll(this.composeSessionAuthenticationHeaders(xsrfHeader, xsrfToken, sessionId));

        // MediaType.APPLICATION_FORM_URLENCODED is important, otherwise "preserveDoc=true" will not work
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<String> httpEntity = new HttpEntity<>("docTag=2TRINNSAK_1", httpHeaders);

        RestTemplate restTemplate = new RestTemplate();
        String link = empowerLocation + "/resource/documents/" + docId + "/meta";
        LOGGER.info("Link to Empower: {} ", link);
        ResponseEntity<String> response = restTemplate.exchange(link, POST, httpEntity, String.class);
        LOGGER.info("Empower response code: {} ", response.getStatusCode());
        LOGGER.info("Empower response body: {}", response.getBody());
    }

    @Test
    public void deleteDocument() {
        LOGGER.info("Receiving '/DeleteDocument' request.");
        LOGGER.info("Document ID: {}", docId);
        // tested OK when the bearerToken, xsrfToken and JSESSIONID are set up correctly (JSESSIONID is required)
        // it also works when the bearerToken is not set up for authorization but the JSESSIONID and xsrfToken are set up
        String bearerToken = "eyJraWQiOiIzNzdmMGFjOWU4NjFlMTIyNzY2NGQ3ODljOWE4OTA1YTA1MTNlNzc2IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJiNWYzMTM4My04ZjgxLTNhZDgtOTJiMi0yMjQyOTc5Y2MxODIiLCJzY3AiOlsicmVzb3VyY2U6RW1wb3dlciJdLCJkbXAiOnsiT1REU19DUkVEU19BVVRIIjoidHJ1ZSIsIk9URFNfSEFTX1BBU1NXT1JEIjoidHJ1ZSJ9LCJydGkiOiJhNWVjZTkyZC03OGMxLTRhYzUtOGJkNS02ODk5MDkxZDhiN2UiLCJzYXQiOjE3NDY5OTQwMTUsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0Ojk0NDUvb3Rkc3dzIiwiZ3J0IjoicGFzc3dvcmQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJwaWQiOiJvdGRzLmFkbWluIiwicmlkIjp7ImJlZjJhM2M5LTM3MGItNDIwZi05YWYxLTU1YjhkNjc3MDQyMCI6Im90YWRtaW5Ab3Rkcy5hZG1pbiJ9LCJ0aWQiOiIiLCJzaWQiOiI5NjVlNzA4OC0xMTAyLTQxYWUtOWIxYS1lNDJkZWMzZWM2NWYiLCJ1aWQiOiJvdGFkbWluQG90ZHMuYWRtaW4iLCJ1bm0iOiJvdGFkbWluIiwibmFtZSI6IiIsImV4cCI6MTc0Njk5NzYxNSwiaWF0IjoxNzQ2OTk0MDE1LCJqdGkiOiIxYTIxNTJkMy0wNTlmLTQ0ZjEtYWZkZS1kYjAxYzA3ZjNiMWUiLCJjaWQiOiJFbXBvd2VyIn0.gaMLMM_QPsrdY-TX1LUfp0-J8-15CM33r7tNUepH32U4lIKSC1rMq2jG8b9s4jbd7i6aJgJNGvkwgvpI-_m0THqjFUWITQRqm06uys8O-n3LRjp2vNWpf38mT-nSmwM--BeU4nRX73iooVwig4GaRJzD5K60w55TqO1_wvbaMLPjdrqsDkPwD5LugraxcIHnITiKYe-y-dEHx2BmNH_buWyrHllXkK8eroQO9bkfAy5tGu4615yjCRAL6nG2EZgYN_QByOqdz7KF_dvlWatQbvQ8Sf5LyXuOaV2EV0BH06ZyH5IFR9v4rk4LrsJNfjZ4IlzZ4OtDbIKLPlt7hq_0TA";
        String xsrfToken = "81d7a2e9-a0cc-4e8e-8451-ec13acb47d58";

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("X-CSRF-TOKEN", xsrfToken);
        httpHeaders.add("Cookie", "JSESSIONID=0465893903C35827C998F219A395DD5A");
        HttpEntity<String> httpEntity = new HttpEntity<>(null, httpHeaders);

        RestTemplate restTemplate = new RestTemplate();
        String link = empowerLocation + "/resource/documents/" + docId;
        LOGGER.info("Link to Empower: {} ", link);
        ResponseEntity<String> response = restTemplate.exchange(link, DELETE, httpEntity, String.class);
        LOGGER.info("Empower response code: {} ", response.getStatusCode());
        LOGGER.info("Empower response body: {}", response.getBody());
    }

    /**
    Builds headers:
     1) {xsrfHeader}: {xsrfToken}
     2) Cookie: JSESSIONID={sessionId}; "XSRF-TOKEN={xsrfToken}
     */
    private MultiValueMap<String, String> composeSessionAuthenticationHeaders(String xsrfHeader, String xsrfToken, String sessionId) {
        MultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(xsrfHeader, xsrfToken);
        headers.add("Cookie", "JSESSIONID=" + sessionId + "; XSRF-TOKEN=" + xsrfToken);
        return headers;
    }

}
