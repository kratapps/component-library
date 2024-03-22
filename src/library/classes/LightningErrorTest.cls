/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @author kratapps.com
 *
 * @description Unit tests for LightningError class.
 */
@IsTest
private class LightningErrorTest {
    @IsTest
    static void test() {
        String actual = LightningError.create('msg1').serialize();
        System.assert(actual.contains('output'), 'Serialized error should include output.');
        System.assert(actual.contains('fieldErrors'), 'Serialized error should include field error.');
        System.assert(actual.contains('"statusCode":400'), 'Serialized error should include status code.');
        System.assert(actual.contains('"enhancedErrorType":"LightningError"'), 'Serialized error should include enhanced error type.');
        System.assert(actual.contains('"message":"msg1"'), 'Serialized error should include message.');
        actual = LightningError.create('msg2')
            .addError('err1')
            .addError('err2')
            .addFieldError(Account.Name, 'field1')
            .addFieldError(Account.Id, 'field2')
            .serialize();
        System.assert(actual.contains('output'), 'Serialized error should include output.');
        System.assert(actual.contains('fieldErrors'), 'Serialized error should include field errors.');
        System.assert(actual.contains('"statusCode":400'), 'Serialized error should include status code.');
        System.assert(actual.contains('"enhancedErrorType":"LightningError"'), 'Serialized error should include enhanced error type.');
        System.assert(actual.contains('"message":"msg2"'), 'Serialized error should include message.');
        System.assert(actual.contains('"message":"field1"'), 'Serialized error should include message.');
        System.assert(actual.contains('"fieldLabel":"Account Name"'), 'Serialized error should include field label.');
        System.assert(actual.contains('"fieldName":"Name"'), 'Serialized error should include field name.');
        System.assert(actual.contains('"message":"field2"'), 'Serialized error should include message');
        System.assert(actual.contains('"fieldName":"Id"'), 'Serialized error should include field name.');
        System.assert(actual.contains('"fieldLabel":"Account ID"'), 'Serialized error should include field label.');
        System.assert(
            actual.contains('"errors":[{"message":"err1"},{"message":"err2"}]'),
            'Serialized error should include array of messages.'
        );
        System.assertNotEquals(null, LightningError.create(), 'Error should be created.');
    }
}