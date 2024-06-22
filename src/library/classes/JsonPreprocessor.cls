/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */

/**
 * @author kratapps.com
 *
 * @description Preprocess JSON.
 *
 * https://kratapps.com/component-library/json-preprocessor
 */
public virtual inherited sharing class JsonPreprocessor {
    public static final String DEFAULT_DATETIME_FORMAT = 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'';
    public static final TimeZone TIME_ZONE_UTC = TimeZone.getTimeZone('UTC');

    // generic config
    public Boolean pretty = false;

    // object config
    public Boolean replaceEmptyStringsWithNull = false; // "" => null
    public Boolean snakeCaseToCamelCase = false; // some_key => someKey
    public Boolean capitalizeFirstLetter = false; // someKey => SomeKey
    public Boolean uncapitalizeFirstLetter = false; // SomeKey => someKey
    public Boolean sortMapFields = true;
    public final Map<String, String> replaceFieldNamesMap = new Map<String, String>();
    public final Set<String> fieldNamesToRemove = new Set<String>();

    // datetime object values config
    public final Set<String> datetimeFieldsToReformat = new Set<String>(); // datetime object fields to reformat
    public String datetimeFormat = DEFAULT_DATETIME_FORMAT; // format used for datetimeFieldToReformat object fields
    public TimeZone sourceTimeZone = TIME_ZONE_UTC; // original datetime time zone
    public TimeZone targetTimeZone = TIME_ZONE_UTC; // target datetime time zone

    protected JSONGenerator gen;

    public JsonPreprocessor() {
        this(false);
    }

    public JsonPreprocessor(Boolean pretty) {
        this.pretty = pretty;
    }

    public String process(String jsonString) {
        gen = JSON.createGenerator(pretty);
        traverseObject(JSON.deserializeUntyped(jsonString), null);
        String result = gen.getAsString();
        gen = null;
        return result;
    }

    protected virtual void traverseObject(Object obj, String fieldName) {
        if (obj == null) {
            gen.writeNull();
        } else if (obj instanceof String) {
            traverseString((String) obj, fieldName);
        } else if (obj instanceof Integer) {
            traverseInteger((Integer) obj, fieldName);
        } else if (obj instanceof Long) {
            traverseLong((Long) obj, fieldName);
        } else if (obj instanceof Map<String, Object>) {
            traverseMap((Map<String, Object>) obj, fieldName);
        } else if (obj instanceof List<Object>) {
            traverseList((List<Object>) obj, fieldName);
        } else {
            gen.writeObject(obj);
        }
    }

    protected virtual void traverseString(String value, String fieldName) {
        if (replaceEmptyStringsWithNull && String.isBlank(value)) {
            gen.writeNull();
        } else if (fieldName != null && String.isNotBlank(value) && datetimeFieldsToReformat.contains(fieldName)) {
            gen.writeString(reformatDatetime(value));
        } else {
            gen.writeString(value);
        }
    }

    protected virtual void traverseLong(Long value, String fieldName) {
        if (fieldName != null && datetimeFieldsToReformat.contains(fieldName)) {
            gen.writeString(reformatDatetime(Datetime.newInstance(value)));
        } else {
            gen.writeNumber(value);
        }
    }

    protected virtual void traverseInteger(Long value, String fieldName) {
        gen.writeNumber(value);
    }

    protected virtual void traverseMap(Map<String, Object> obj, String fieldName) {
        List<String> keys = new List<String>(obj.keySet());
        if (sortMapFields) {
            keys.sort();
        }
        gen.writeStartObject();
        for (String name : keys) {
            traverseMapField(name, obj.get(name));
        }
        gen.writeEndObject();
    }

    protected virtual void traverseMapField(String fieldName, Object fieldValue) {
        if (fieldNamesToRemove.contains(fieldName)) {
            return;
        }
        String newFieldName = fieldName;
        if (snakeCaseToCamelCase && fieldName.contains('_')) {
            newFieldName = convertSnakeCaseToCamelCase(fieldName);
        }
        if (capitalizeFirstLetter) {
            newFieldName = newFieldName.capitalize();
        } else if (uncapitalizeFirstLetter) {
            newFieldName = newFieldName.uncapitalize();
        }
        traverseMapFieldName(newFieldName);
        traverseObject(fieldValue, newFieldName);
    }

    protected virtual void traverseMapFieldName(String fieldName) {
        String newFieldName = fieldName;
        if (replaceFieldNamesMap.containsKey(fieldName)) {
            newFieldName = replaceFieldNamesMap.get(fieldName);
        }
        gen.writeFieldName(newFieldName);
    }

    protected virtual void traverseList(List<Object> objects, String fieldName) {
        gen.writeStartArray();
        for (Object obj : objects) {
            traverseObject(obj, null);
        }
        gen.writeEndArray();
    }

    protected String reformatDatetime(String dt) {
        return reformatDatetime(Datetime.valueOfGmt(dt));
    }

    protected String reformatDatetime(Datetime dt) {
        if (sourceTimeZone != TIME_ZONE_UTC) {
            dt = convertDatetimeTimeZone(dt, sourceTimeZone, TIME_ZONE_UTC);
        }
        return dt.format(datetimeFormat, targetTimeZone.getID());
    }

    private Datetime convertDatetimeTimeZone(Datetime dt, TimeZone sourceTimeZone, TimeZone targetTimeZone) {
        Integer sourceOffset = sourceTimeZone.getOffset(dt);
        Integer targetOffset = targetTimeZone.getOffset(dt);
        Integer correction = targetOffset - sourceOffset;
        return dt.addSeconds(correction / 1000);
    }

    private String convertSnakeCaseToCamelCase(String value) {
        List<String> parts = value.removeStart('_').split('_');
        if (parts.isEmpty()) {
            return '';
        }
        String newValue = '';
        for (Integer i = 0; i < parts.size(); i++) {
            String part = parts[i];
            if (String.isNotBlank(part)) {
                newValue += part.capitalize();
            }
        }
        return newValue.uncapitalize();
    }
}