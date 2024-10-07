/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, kratapps.com
 * See the LICENSE: https://github.com/kratapps/component-library/blob/main/LICENSE
 */
public class MediaType {
    public final String value;

    public static final MediaType APPLICATION_JSON = new MediaType('application/json');

    private MediaType(String value) {
        this.value = value;
    }

    public Boolean equals(Object obj) {
        if (!(obj instanceof MediaType)) {
            return false;
        }
        MediaType other = (MediaType) obj;
        return other != null && this.value == other.value;
    }

    public override Integer hashCode() {
        return 17 + (31 * System.hashCode(value));
    }
}