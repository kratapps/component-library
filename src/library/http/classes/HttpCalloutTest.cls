/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */
@IsTest
private class HttpCalloutTest {
    @IsTest
    static void testEncodeDecode() {
        Assert.areEqual('some+value', HttpCallout.urlEncode('some value'), 'Encoded value no match.');
        Assert.areEqual('some value', HttpCallout.urlDecode('some+value'), 'Decoded value no match.');
    }

    @IsTest
    static void testSend() {
        CalloutMock mock = new CalloutMock();
        mock.body.test1 = 'value1';
        mock.body.test2 = true;
        Test.setMock(HttpCalloutMock.class, mock);
        HttpCallout callout = new HttpCallout('https://endpoint.com')
            .setMethod(HttpRequestMethod.POST)
            .setPath('some/path/')
            .setQueryStrings(new Map<String, String>{ 'a' => '0', 'b' => '1' });
        callout.headers.add('headerName', 'headerValue');
        CalloutResponseBody resp = (CalloutResponseBody) callout.send('body').deserialize(CalloutResponseBody.class);
        Assert.areEqual('https://endpoint.com/some/path?a=0&b=1', callout.req.getEndpoint(), 'Parsed response no match.');
        Assert.areEqual(mock.body.test1, resp.test1, 'Parsed response no match.');
        Assert.areEqual(mock.body.test2, resp.test2, 'Parsed response no match.');
    }

    @IsTest
    static void testSendJson() {
        Test.setMock(HttpCalloutMock.class, new CalloutMock());
        HttpCallout callout = new HttpCallout('https://endpoint.com').sendJson(new Map<String, Object>{ 'key' => 'value' });
        Assert.areEqual('{"key":"value"}', callout.req.getBody(), 'Body no match.');
    }

    @IsTest
    static void testPreprocessResponse() {
        HttpCallout callout = new HttpCallout('https://endpoint.com');
        callout.resp = new HttpResponse();
        callout.resp.setBody('{"First_Key":"","Second_Key":"Test"}');
        callout.preprocessResponse(new Preprocessor());
        Map<String, Object> respBody = (Map<String, Object>) callout.deserialize();
        Assert.isTrue(respBody.containsKey('firstKey'), 'Response should include processed key.');
        Assert.isTrue(respBody.containsKey('secondKey'), 'Response should include processed key.');
        Assert.isFalse(respBody.containsKey('First_Key'), 'Response should not include original key.');
        Assert.isFalse(respBody.containsKey('Second_Key'), 'Response should not include original key.');
        Assert.isNull(respBody.get('firstKey'), 'Empty string should be converted to null.');
        Assert.areEqual('Test', respBody.get('secondKey'), 'String value should not change.');
    }

    @IsTest
    static void testHandleCalloutError() {
        HttpCallout callout = new HttpCallout('https://endpoint.com');
        try {
            callout.handleCalloutError(new HttpResponse());
            Assert.fail('Exception expected.');
        } catch (HttpCalloutException e) {
            Assert.isTrue(e.getMessage().contains('HTTP callout error'), 'Wrong exception message.');
        }
    }

    @IsTest
    static void testMediaType() {
        Assert.areEqual('application/json', MediaType.APPLICATION_JSON.value);
        Assert.areEqual(MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON, 'Same media type expected equal.');
        Assert.isNotNull(MediaType.APPLICATION_JSON.hashCode(), 'Hash code expected value.');
    }

    @IsTest
    static void testBehavior() {
        HttpHeaders headers = new HttpHeaders();
        Assert.isTrue(headers.isEmpty(), 'Should be empty when no headers added.');
        headers.add('a', '1');
        Assert.isFalse(headers.isEmpty(), 'Should not be empty when headers added.');
        headers.add(new Map<String, String>{ 'b' => '2', 'c' => '3' });
        headers.setAccept(MediaType.APPLICATION_JSON);
        Assert.areEqual('1', headers.get('a'), 'Should contain added header.');
        Assert.isTrue(headers.keySet().contains('Accept'), 'Should contain added header.');
    }

    private class Preprocessor extends JsonPreprocessor {
        private Preprocessor() {
            replaceEmptyStringsWithNull = true;
            snakeCaseToCamelCase = true;
            uncapitalizeFirstLetter = true;
        }
    }

    private class CalloutResponseBody {
        public String test1;
        public Boolean test2;
    }

    private class CalloutMock implements HttpCalloutMock {
        private CalloutResponseBody body = new CalloutResponseBody();
        private Integer statusCode = 200;

        public HttpResponse respond(HttpRequest req) {
            HttpResponse resp = new HttpResponse();
            resp.setStatusCode(statusCode);
            resp.setBody(JSON.serialize(body));
            return resp;
        }
    }
}