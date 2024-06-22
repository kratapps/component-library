/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */

/**
 * @description Test class for LightningError.
 * {@link https://docs.kratapps.com/component-library/error-handler}
 *
 * @author  kratapps.com
 */
@IsTest
private class LightningResponseTest {
    @IsTest
    static void sendReturnsResponse() {
        LightningResponse resp = LightningResponse.send();
        String actual = JSON.serialize(resp);
        Assert.isTrue(actual.contains('"error":null'), 'Serialized response should have null error.');
        Assert.isTrue(actual.contains('"data":"ok"'), 'Serialized response should have ok data.');
        resp = LightningResponse.send(new List<Integer>{ 0, 1, 2 });
        actual = JSON.serialize(resp);
        Assert.isTrue(actual.contains('"error":null'), 'Serialized response should have null error.');
        Assert.isTrue(actual.contains('"data":[0,1,2]'), 'Serialized response should have data.');
    }

    @IsTest
    static void errorReturnsResponse() {
        LightningResponse resp = LightningResponse.error('oops');
        String actual = JSON.serialize(resp);
        Assert.isTrue(actual.contains('"error":{'), 'Serialized response should have an error.');
        Assert.isTrue(actual.contains('"ok":false'), 'Serialized response should not be ok.');
        Assert.isTrue(actual.contains('"message":"oops"'), 'Serialized response should have message');
        Assert.isTrue(actual.contains('"data":null'), 'Serialized response should have null data.');
        Assert.isTrue(
            actual.contains('"enhancedErrorType":"classes/LightningError"'),
            'Serialized response should have enhancedErrorType.'
        );
        resp = LightningResponse.error(LightningError.create('oh no'));
        actual = JSON.serialize(resp);
        Assert.isTrue(actual.contains('"error":{'), 'Serialized response should have an error.');
        Assert.isTrue(actual.contains('"ok":false'), 'Serialized response should not be ok.');
        Assert.isTrue(actual.contains('"message":"oh no"'), 'Serialized response should have error.');
        Assert.isTrue(actual.contains('"data":null'), 'Serialized response should have null data.');
        Assert.isTrue(
            actual.contains('"enhancedErrorType":"classes/LightningError"'),
            'Serialized response should have enhancedErrorType.'
        );
    }

    @IsTest
    static void somethingWentWrongReturnsResponse() {
        DmlException e;
        try {
            // Force DmlException.
            insert new User(Id = UserInfo.getUserId());
        } catch (DmlException ex) {
            e = ex;
        }
        LightningResponse resp = LightningResponse.somethingWentWrong(e);
        String actual = JSON.serialize(resp);
        Assert.isTrue(actual.contains('"error":{'), 'Serialized response should have an error.');
        Assert.isTrue(actual.contains('"ok":false'), 'Serialized response should not be ok.');
        Assert.isTrue(actual.contains('"message":"cannot specify Id in an insert call"'), 'Serialized response should have message.');
        Assert.isTrue(actual.contains('"data":null'), 'Serialized response should have null data.');
        Assert.isTrue(
            actual.contains('"enhancedErrorType":"classes/LightningError"'),
            'Serialized response should have enhancedErrorType.'
        );
    }

    @IsTest
    static void somethingWentWrongThrowsException() {
        try {
            LightningResponse.somethingWentWrong(new IllegalArgumentException('invalid'));
            Assert.fail('AuraHandledException expected.');
        } catch (AuraHandledException expected) {
            Assert.isNotNull(expected, 'AuraHandledException expected.');
        }
    }
}