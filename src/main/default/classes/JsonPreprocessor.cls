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

    // datetime object values config
    public final Set<String> datetimeFieldsToReformat = new Set<String>(); // datetime object fields to reformat
    public String datetimeFormat = DEFAULT_DATETIME_FORMAT; // format used for datetimeFieldToReformat object fields
    public TimeZone sourceTimeZone = TIME_ZONE_UTC; // original datetime time zone
    public TimeZone targetTimeZone = TIME_ZONE_UTC; // target datetime time zone

    private JSONGenerator gen;

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
        } else if (obj instanceof Map<String, Object>) {
            traverseMap((Map<String, Object>) obj);
        } else if (obj instanceof List<Object>) {
            traverseList((List<Object>) obj);
        } else if (obj instanceof String) {
            String stringValue = (String) obj;
            if (replaceEmptyStringsWithNull && String.isBlank(stringValue)) {
                gen.writeNull();
            } else if (fieldName != null && String.isNotBlank(stringValue) && datetimeFieldsToReformat.contains(fieldName)) {
                gen.writeString(reformatDatetime(stringValue));
            } else {
                gen.writeString(stringValue);
            }
        } else {
            gen.writeObject(obj);
        }
    }

    protected virtual void traverseMap(Map<String, Object> obj) {
        List<String> keys = new List<String>(obj.keySet());
        if (sortMapFields) {
            keys.sort();
        }
        gen.writeStartObject();
        for (String fieldName : keys) {
            traverseMapField(fieldName, obj.get(fieldName));
        }
        gen.writeEndObject();
    }

    protected virtual void traverseMapField(String fieldName, Object fieldValue) {
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

    protected virtual void traverseList(List<Object> objects) {
        gen.writeStartArray();
        for (Object obj : objects) {
            traverseObject(obj, null);
        }
        gen.writeEndArray();
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

    private String reformatDatetime(String dt) {
        Datetime dtValue = Datetime.valueOfGmt(dt);
        if (sourceTimeZone != TIME_ZONE_UTC) {
            dtValue = convertDatetimeTimeZone(dtValue, sourceTimeZone, TIME_ZONE_UTC);
        }
        return dtValue.format(datetimeFormat, targetTimeZone.getID());
    }

    private Datetime convertDatetimeTimeZone(Datetime dt, TimeZone sourceTimeZone, TimeZone targetTimeZone) {
        Integer sourceOffset = sourceTimeZone.getOffset(dt);
        Integer targetOffset = targetTimeZone.getOffset(dt);
        Integer correction = targetOffset - sourceOffset;
        return dt.addSeconds(correction / 1000);
    }
}