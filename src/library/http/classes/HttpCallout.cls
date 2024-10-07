/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */
public virtual inherited sharing class HttpCallout {
    public static String urlEncodingScheme = 'UTF-8';
    @TestVisible
    private final HttpRequest req = new HttpRequest();
    @TestVisible
    private HttpResponse resp;

    private final String endpoint;
    private String path;
    private final List<HttpQueryString> queryStrings = new List<HttpQueryString>();
    public final HttpHeaders headers = new HttpHeaders();

    public static String urlEncode(String value) {
        return EncodingUtil.urlEncode(value, urlEncodingScheme);
    }

    public static String urlDecode(String value) {
        return EncodingUtil.urlDecode(value, urlEncodingScheme);
    }

    public HttpCallout(String endpoint) {
        this.endpoint = endpoint;
        setMethod(HttpRequestMethod.GET);
    }

    public HttpCallout setPath(String path) {
        this.path = path;
        return this;
    }

    public HttpCallout setMethod(HttpRequestMethod method) {
        req.setMethod(method.name().removeEnd('_X'));
        return this;
    }

    public HttpCallout setQueryString(String key, String value) {
        queryStrings.add(new HttpQueryString(key, value));
        return this;
    }

    public HttpCallout setQueryStrings(Map<String, String> queryStrings) {
        if (queryStrings != null) {
            for (String key : queryStrings.keySet()) {
                setQueryString(key, queryStrings.get(key));
            }
        }
        return this;
    }

    public HttpCallout send() {
        HttpRequest req = buildRequest();
        resp = new Http().send(req);
        if (!isSuccess()) {
            handleCalloutError(resp);
        }
        return this;
    }

    public HttpCallout send(String body) {
        setBody(body);
        return send();
    }

    public HttpCallout sendJson(Object body) {
        setBody(JSON.serialize(body));
        return send();
    }

    public HttpCallout preprocessResponse(JsonPreprocessor preprocessor) {
        resp.setBody(preprocessor.process(resp.getBody()));
        return this;
    }

    public HttpCallout preprocessResponse() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.replaceEmptyStringsWithNull = true;
        processor.snakeCaseToCamelCase = true;
        processor.uncapitalizeFirstLetter = true;
        return preprocessResponse(processor);
    }

    public Object deserialize() {
        return deserialize(null);
    }

    public Object deserialize(Type responseType) {
        if (resp == null) {
            throw new HttpCalloutException('Request not sent.');
        }
        return responseType != null ? JSON.deserialize(resp.getBody(), responseType) : JSON.deserializeUntyped(resp.getBody());
    }

    public HttpRequest buildRequest() {
        req.setEndpoint(buildEndpoint());
        for (String key : headers.keySet()) {
            req.setHeader(key, headers.get(key));
        }
        return req;
    }

    @TestVisible
    protected virtual void handleCalloutError(HttpResponse resp) {
        System.debug('[' + resp.getStatusCode() + '] ' + resp.getStatus() + '\n' + resp.getBody());
        throw new HttpCalloutException('HTTP callout error');
    }

    protected HttpRequest getRequest() {
        return req;
    }

    protected virtual Boolean isSuccess() {
        Integer statusCode = resp?.getStatusCode();
        return statusCode != null && statusCode >= 200 && statusCode <= 299;
    }

    private HttpCallout setBody(String body) {
        req.setBody(body);
        return this;
    }

    private String buildEndpoint() {
        String result = endpoint;
        if (String.isNotBlank(path)) {
            result += '/' + path.removeStart('/').removeEnd('/');
        }
        if (!queryStrings.isEmpty()) {
            List<String> strings = new List<String>();
            for (HttpQueryString queryString : queryStrings) {
                strings.add(queryString.toString());
            }
            result += '?' + String.join(strings, '&');
        }
        return result;
    }
}