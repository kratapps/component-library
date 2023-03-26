# JSON Preprocessor

![apex](https://img.shields.io/badge/Apex-service-darkblue)

Preprocess JSON.

## Installation

Deploy service with dependencies:

```text
sfdx kratapps:remote:source:deploy -s https://github.com/kratapps/component-library -p src/main/default/classes/JsonPreprocessor.cls,src/main/default/classes/JsonPreprocessor.cls-meta.xml -u myOrg
```

## Specification

### Fields

| Field Name                  | Type               | Default       | Description                                                                                                    |
| --------------------------- | ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------- |
| pretty                      | Boolean            | false         | Prettify result JSON.                                                                                          |
| replaceEmptyStringsWithNull | Boolean            | false         | "" => null                                                                                                     |
| snakeCaseToCamelCase        | Boolean            | false         | some_key => someKey                                                                                            |
| capitalizeFirstLetter       | Boolean            | false         | someKey => SomeKey                                                                                             |
| uncapitalizeFirstLetter     | Boolean            | false         | SomeKey => someKey                                                                                             |
| sortMapFields               | Boolean            | true          | Sort JSON keys.                                                                                                |
| replaceFieldNamesMap        | Map<String,String> |               | Map JSON keys to a different value. Can be used to change Apex reserved keyword fields before deserialization. |
| datetimeFieldsToReformat    | Set\<String>       |               | Collection of JSON keys holding datetime values to reformat.                                                   |
| datetimeFormat              | String             |               | Datetime format used for datetimeFieldToReformat JSON fields.                                                  |
| sourceTimeZone              | TimeZone           | UTC time zone | Original datetime time zone.                                                                                   |
| targetTimeZone              | TimeZone           | UTC time zone | Target datetime time zone.                                                                                     |

### Constructors

| Params         | Description                         |
| -------------- | ----------------------------------- |
|                | The result JSON won't be prettified |
| Boolean pretty | The result JSON will be prettified  |

### Methods

| Method  | Params            | Returns | Description                                |
| ------- | ----------------- | ------- | ------------------------------------------ |
| process | String jsonString | String  | Process JSON and return a new JSON string. |

## Example

In the example below, we would like to prepare a JSON for deserialization into an Apex object.
We would like to change the original JSON in two ways:

1. Change the field names from snake case to camel case to follow PMDs field naming conventions.
2. Change the "number" field name because it's a reserved word in Apex.

```apex
JsonPreprocessor processor = new JsonPreprocessor();
processor.snakeCaseToCamelCase = true;
processor.replaceFieldNamesMap = new Map<String, String>{
    'number' => 'number_x'
};
String originalJson = '{"some_key":"myValue","number":150}';
String processedJson = processor.process(originalJson);
// {"someKey:"myValue","number_x":150}
System.debug(processedJson);
```

### Replace Empty Strings with Null

```apex
processor.replaceEmptyStringsWithNull = true;
String originalJson = '{"key":""}';
String processedJson = processor.process(originalJson);
// {"key":null}
```

### Snake Case to Camel Case

```apex
processor.snakeCaseToCamelCase = true;
String originalJson = '{"some_key":"myValue"}';
String processedJson = processor.process(originalJson);
// {"someKey":"myValue"}
```

### Capitalize and Uncapitalize First Letter

```apex
processor.capitalizeFirstLetter = true;
String originalJson = '{"someKey":"myValue"}';
String processedJson = processor.process(originalJson);
// {"SomeKey":"myValue"}

processor.uncapitalizeFirstLetter = true;
String originalJson = '{"SomeKey":"myValue"}';
String processedJson = processor.process(originalJson);
// {"someKey":"myValue"}
```

### Sort Map Fields

```apex
processor.sortMapFields = true;
String originalJson = '{"b":"myValue2","a":"myValue"}';
String processedJson = processor.process(originalJson);
// {"a":"myValue","b":"myValue2"}
```

### Replace Field Names Map

```apex
processor.replaceFieldNamesMap.put('number', 'ticketNumber');
processor.replaceFieldNamesMap.put('string', 'string_x');
String originalJson = '{"number":150,"string":"myValue"}';
String processedJson = processor.process(originalJson);
// {"ticketNumber":150,"string_x":"myValue"}
```

### Reformat Datetime Values

Let's say in our REST response we have datetime value in Los Angeles time zone
and we are planning to deserialize this JSON into UTC.

```apex

processor.datetimeFieldsToReformat.add('dt');
processor.datetimeFormat = 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ';
processor.sourceTimeZone = TimeZone.getTimeZone('America/Los_Angeles');
// UTC is default value for both source and target time zone.
processor.targetTimeZone = TimeZone.getTimeZone('UTC');
String originalJson = '{"dt":"2022-12-15 04:15:30"}';
String result = processor.process(originalJson);
// {"dt":"2022-12-15T12:15:30.000+0000"}
```
