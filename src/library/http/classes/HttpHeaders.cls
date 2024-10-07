/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */
public inherited sharing class HttpHeaders {
    private final Map<String, String> headers = new Map<String, String>();
    private final Set<String> secrets = new Set<String>();

    public void add(String key, String value) {
        headers.put(key, value);
    }

    public void add(Map<String, String> headers) {
        headers.putAll(headers);
    }

    public void setAccept(MediaType mediaType) {
        headers.put('Accept', mediaType.value);
    }

    public void setContentType(MediaType mediaType) {
        headers.put('Content-Type', mediaType.value);
    }

    public String get(String key) {
        return headers.get(key);
    }

    public Set<String> getSecrets() {
        return secrets;
    }

    public Boolean isEmpty() {
        return headers.isEmpty();
    }

    public Boolean containsKey(String key) {
        return headers.containsKey(key);
    }

    public Set<String> keySet() {
        return headers.keySet();
    }
}