/*
BSD 3-Clause License
Copyright (c) 2023, kratapps.com
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
@IsTest
private class JsonPreprocessorTest {
    @IsTest
    static void testNull() {
        JsonPreprocessor processor = new JsonPreprocessor();
        String result = processor.process('null');
        System.Assert.areEqual('null', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testString() {
        JsonPreprocessor processor = new JsonPreprocessor();
        String result = processor.process('"some string"');
        System.Assert.areEqual('"some string"', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testList() {
        JsonPreprocessor processor = new JsonPreprocessor();
        String result = processor.process('["a",0,{"a":"0"}]');
        System.Assert.areEqual('["a",0,{"a":"0"}]', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testMap() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.sortMapFields = true;
        String result = processor.process('{"b":1,"a":"0","c":""}');
        System.Assert.areEqual('{"a":"0","b":1,"c":""}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testReplaceEmptyStringsWithNull() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.replaceEmptyStringsWithNull = true;
        String result = processor.process('{"a":0,"b":"","c":[1,""]}');
        System.Assert.areEqual('{"a":0,"b":null,"c":[1,null]}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testSnakeCaseToCamelCase() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.snakeCaseToCamelCase = true;
        String result = processor.process('{"some_key_top_level":{"inner_key_inner_object":1}}');
        System.Assert.areEqual('{"someKeyTopLevel":{"innerKeyInnerObject":1}}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testDatetimeFieldNames() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.datetimeFieldsToReformat.add('dt');
        String result = processor.process('{"a":0,"dt":"2022-12-15 01:15:30"}');
        System.Assert.areEqual('{"a":0,"dt":"2022-12-15T01:15:30Z"}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testDatetimeTimeZones() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.datetimeFieldsToReformat.add('dt');
        processor.datetimeFormat = 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ';
        processor.sourceTimeZone = TimeZone.getTimeZone('America/Los_Angeles');
        processor.targetTimeZone = TimeZone.getTimeZone('America/New_York');
        String result = processor.process('{"a":0,"dt":"2022-12-15 04:15:30"}');
        System.Assert.areEqual('{"a":0,"dt":"2022-12-15T07:15:30.000-0500"}', result, 'Wrong JSON result.');
        processor.sourceTimeZone = TimeZone.getTimeZone('America/New_York');
        processor.targetTimeZone = TimeZone.getTimeZone('America/Los_Angeles');
        result = processor.process('{"a":0,"dt":"2022-12-15 04:15:30"}');
        System.Assert.areEqual('{"a":0,"dt":"2022-12-15T01:15:30.000-0800"}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testDatetimeAsLongMillis() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.datetimeFieldsToReformat.add('dt');
        String result = processor.process('{"a":0,"dt":1688138168123,"numb":1688138168123}');
        System.Assert.areEqual('{"a":0,"dt":"2023-06-30T15:16:08Z","numb":1688138168123}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testDatetimeAsLongSeconds() {
        JsonPreprocessor processor = new SecondsDatetimePreprocessor();
        String result = processor.process('{"a":0,"dt":1688138168,"numb":1688138168}');
        System.Assert.areEqual('{"a":0,"dt":"2023-06-30T15:16:08Z","numb":1688138168}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testComplexMap() {
        JsonPreprocessor processor = new JsonPreprocessor();
        String original = '{"a":0,"b":{"b1":1,"b2":2,"b3":3,"b4":["list1",2,"3",{"list4":4}]},"c":1}';
        String expected = original;
        String result = processor.process(original);
        System.Assert.areEqual(expected, result, 'Wrong JSON result.');
    }

    @IsTest
    static void testReplaceFieldNamesMap() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.replaceFieldNamesMap.put('number', 'ticketNo');
        processor.sortMapFields = false;
        String original = '{"size":2,"result":[{"number":  "ABC0001234","description":"desc1"},{"number":  "ABC0004567","description":""}]}';
        String expected = '{"size":2,"result":[{"ticketNo":"ABC0001234","description":"desc1"},{"ticketNo":"ABC0004567","description":""}]}';
        String result = processor.process(original);
        System.Assert.areEqual(expected, result, 'Wrong JSON result.');
    }

    @IsTest
    static void testFieldNamesToRemove() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.fieldNamesToRemove.add('number');
        processor.sortMapFields = false;
        String original = '{"size":2,"result":[{"number":  "ABC0001234","description":"desc1"},{"description":"", "number":  "ABC0004567"}]}';
        String expected = '{"size":2,"result":[{"description":"desc1"},{"description":""}]}';
        String result = processor.process(original);
        System.Assert.areEqual(expected, result, 'Wrong JSON result.');
    }

    private class SecondsDatetimePreprocessor extends JsonPreprocessor {
        protected override void traverseObject(Object obj, String fieldName) {
            if (fieldName != null && obj != null && obj instanceof Long && fieldName == 'dt') {
                Long millis = ((Long) obj) * 1000;
                super.traverseObject(reformatDatetime(Datetime.newInstance(millis)), fieldName);
            } else {
                super.traverseObject(obj, fieldName);
            }
        }
    }
}