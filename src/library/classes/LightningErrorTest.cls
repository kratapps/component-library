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
private class LightningErrorTest {
    @IsTest
    static void serializedErrorHasAttributes() {
        LightningError error = LightningError.create('msg1');
        String actual = JSON.serialize(error);
        Assert.isTrue(actual.contains('output'), 'Serialized error should include output.');
        Assert.isTrue(actual.contains('fieldErrors'), 'Serialized error should include field error.');
        Assert.isTrue(actual.contains('"statusCode":400'), 'Serialized error should include status code.');
        Assert.isTrue(
            actual.contains('"enhancedErrorType":"classes/LightningError"'),
            'Serialized error should include enhanced error type.'
        );
        Assert.isTrue(actual.contains('"message":"msg1"'), 'Serialized error should include message.');
        error = LightningError.create('msg2')
            .addError('err1')
            .addError('err2')
            .addFieldError(Account.Name, 'field1')
            .addFieldError(Account.Id, 'field2');
        actual = JSON.serialize(error);
        Assert.isTrue(actual.contains('output'), 'Serialized error should include output.');
        Assert.isTrue(actual.contains('fieldErrors'), 'Serialized error should include field errors.');
        Assert.isTrue(actual.contains('"statusCode":400'), 'Serialized error should include status code.');
        Assert.isTrue(
            actual.contains('"enhancedErrorType":"classes/LightningError"'),
            'Serialized error should include enhanced error type.'
        );
        Assert.isTrue(actual.contains('"message":"msg2"'), 'Serialized error should include message.');
        Assert.isTrue(actual.contains('"message":"field1"'), 'Serialized error should include message.');
        Assert.isTrue(actual.contains('"fieldLabel":"Account Name"'), 'Serialized error should include field label.');
        Assert.isTrue(actual.contains('"fieldName":"Name"'), 'Serialized error should include field name.');
        Assert.isTrue(actual.contains('"message":"field2"'), 'Serialized error should include message');
        Assert.isTrue(actual.contains('"fieldName":"Id"'), 'Serialized error should include field name.');
        Assert.isTrue(actual.contains('"fieldLabel":"Account ID"'), 'Serialized error should include field label.');
        Assert.isTrue(
            actual.contains('"errors":[{"message":"err1"},{"message":"err2"}]'),
            'Serialized error should include array of messages.'
        );
        Assert.areNotEqual(null, LightningError.create(), 'Error should be created.');
    }

    @IsTest
    static void serializedErrorHasCustomStatusCodeAndErrorCode() {
        LightningError error = LightningError.create('msg1').setStatusCode(418).setErrorCode('UNABLE_TO_LOCK_ROW');
        String actual = JSON.serialize(error);
        Assert.isTrue(actual.contains('"errorCode":"UNABLE_TO_LOCK_ROW"'), 'Serialized error should include error code when set.');
        Assert.isTrue(actual.contains('"statusCode":418'), 'Serialized error should include status code.');
    }

    @IsTest
    static void serializedErrorFromDmlExceptionHasAttributes() {
        DmlException e;
        try {
            // Force DmlException.
            insert new User(Id = UserInfo.getUserId());
        } catch (DmlException ex) {
            e = ex;
        }
        Assert.isNotNull(e, 'DmlException expected.');
        LightningError error = LightningError.create(e);
        String actual = JSON.serialize(error);
        Assert.isTrue(actual.contains('"errorCode":"INVALID_FIELD_FOR_INSERT_UPDATE"'), 'Serialized error should include error code.');
        Assert.isTrue(actual.contains('"fieldName":"Id"'), 'Serialized error should include field name.');
        Assert.isTrue(actual.contains('"fieldLabel":"User ID"'), 'Serialized error should include field label.');
    }
}