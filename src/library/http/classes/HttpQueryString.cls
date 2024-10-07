/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */
public inherited sharing class HttpQueryString {
    private final String key;
    private final String value;

    public HttpQueryString(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public String getEncodedKey() {
        return HttpCallout.urlEncode(key);
    }

    public String getEncodedValue() {
        return HttpCallout.urlEncode(value);
    }

    public override String toString() {
        return value == null ? getEncodedKey() : getEncodedKey() + '=' + getEncodedValue();
    }
}