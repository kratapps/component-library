/*
BSD 3-Clause License

Copyright (c) 2022, kratapps.com
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Test class for LightningError.
 * 
 * https://kratapps.com/component-library
 * 
 * @author  kratapps.com
 */
@IsTest
private class LightningErrorTest {
    @IsTest
    static void test() {
        String actual = LightningError.create('msg1').serialize();
        System.assert(actual.contains('output'));
        System.assert(actual.contains('fieldErrors'));
        System.assert(actual.contains('"statusCode":400'));
        System.assert(actual.contains('"enhancedErrorType":"LightningError"'));
        System.assert(actual.contains('"message":"msg1"'));
        actual = LightningError.create('msg2')
                .addError('err1')
                .addError('err2')
                .addFieldError(Account.Name, 'field1')
                .addFieldError(Account.Id, 'field2')
                .serialize();
        System.assert(actual.contains('output'));
        System.assert(actual.contains('fieldErrors'));
        System.assert(actual.contains('"statusCode":400'));
        System.assert(actual.contains('"enhancedErrorType":"LightningError"'));
        System.assert(actual.contains('"message":"msg2"'));
        System.assert(actual.contains('"message":"field1"'));
        System.assert(actual.contains('"fieldLabel":"Account Name"'));
        System.assert(actual.contains('"fieldName":"Name"'));
        System.assert(actual.contains('"message":"field2"'));
        System.assert(actual.contains('"fieldName":"Id"'));
        System.assert(actual.contains('"fieldLabel":"Account ID"'));
        System.assert(actual.contains('"errors":[{"message":"err1"},{"message":"err2"}]'));
        System.assertNotEquals(null, LightningError.create());
    }
}