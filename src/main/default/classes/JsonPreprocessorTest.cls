@IsTest
private class JsonPreprocessorTest {
    @IsTest
    static void testNull() {
        JsonPreprocessor processor = new JsonPreprocessor();
        String result = processor.process('null');
        Assert.areEqual('null', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testString() {
        JsonPreprocessor processor = new JsonPreprocessor();
        String result = processor.process('"some string"');
        Assert.areEqual('"some string"', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testList() {
        JsonPreprocessor processor = new JsonPreprocessor();
        String result = processor.process('["a",0,{"a":"0"}]');
        Assert.areEqual('["a",0,{"a":"0"}]', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testMap() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.sortMapFields = true;
        String result = processor.process('{"b":1,"a":"0","c":""}');
        Assert.areEqual('{"a":"0","b":1,"c":""}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testReplaceEmptyStringsWithNull() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.replaceEmptyStringsWithNull = true;
        String result = processor.process('{"a":0,"b":"","c":[1,""]}');
        Assert.areEqual('{"a":0,"b":null,"c":[1,null]}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testSnakeCaseToCamelCase() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.snakeCaseToCamelCase = true;
        String result = processor.process('{"some_key_top_level":{"inner_key_inner_object":1}}');
        Assert.areEqual('{"someKeyTopLevel":{"innerKeyInnerObject":1}}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testDatetimeFieldNames() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.datetimeFieldsToReformat.add('dt');
        String result = processor.process('{"a":0,"dt":"2022-12-15 01:15:30"}');
        Assert.areEqual('{"a":0,"dt":"2022-12-15T01:15:30Z"}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testDatetimeTimeZones() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.datetimeFieldsToReformat.add('dt');
        processor.datetimeFormat = 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ';
        processor.sourceTimeZone = TimeZone.getTimeZone('America/Los_Angeles');
        processor.targetTimeZone = TimeZone.getTimeZone('America/New_York');
        String result = processor.process('{"a":0,"dt":"2022-12-15 04:15:30"}');
        Assert.areEqual('{"a":0,"dt":"2022-12-15T07:15:30.000-0500"}', result, 'Wrong JSON result.');
        processor.sourceTimeZone = TimeZone.getTimeZone('America/New_York');
        processor.targetTimeZone = TimeZone.getTimeZone('America/Los_Angeles');
        result = processor.process('{"a":0,"dt":"2022-12-15 04:15:30"}');
        Assert.areEqual('{"a":0,"dt":"2022-12-15T01:15:30.000-0800"}', result, 'Wrong JSON result.');
    }

    @IsTest
    static void testComplexMap() {
        JsonPreprocessor processor = new JsonPreprocessor();
        String original = '{"a":0,"b":{"b1":1,"b2":2,"b3":3,"b4":["list1",2,"3",{"list4":4}]},"c":1}';
        String expected = original;
        String result = processor.process(original);
        Assert.areEqual(expected, result, 'Wrong JSON result.');
    }

    @IsTest
    static void testReplaceFieldNamesMap() {
        JsonPreprocessor processor = new JsonPreprocessor();
        processor.replaceFieldNamesMap.put('number', 'ticketNo');
        processor.sortMapFields = false;
        String original = '{"size":2,"result":[{"number":  "ABC0001234","description":"desc1"},{"number":  "ABC0004567","description":""}]}';
        String expected = '{"size":2,"result":[{"ticketNo":"ABC0001234","description":"desc1"},{"ticketNo":"ABC0004567","description":""}]}';
        String result = processor.process(original);
        Assert.areEqual(expected, result, 'Wrong JSON result.');
    }
}