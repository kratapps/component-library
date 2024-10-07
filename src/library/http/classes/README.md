# Example

```apex
// Optional company-level callout
public virtual class MyCallout extends HttpCallout {
    // e.g. override error handling
    protected override void handleCalloutError(HttpResponse resp) {
        // TODO error logging
        throw new HttpCalloutException('HTTP callout error');
    }
}

// Optional service-level callout
public virtual class ServiceNowCallout extends MyCallout {
    // e.g. define endpoint, protocol
    public ServiceNowCallout() {
        super('callout:serviceNow');
        headers.setAccept(MediaType.APPLICATION_JSON);
    }
}

// Implementation callout
public class GetServiceNowIncident extends ServiceNowCallout {

    public Incidents getIncident(Id recordId) {
        setPath('/now/table/x_pust_customer_solutions');
        setQueryString('sysparm_query', '^variables.06ba51b7db94e01027796a19139619e0=' + recordId);
        setQueryString('sysparm_display_value', 'true');
        send(); // or send(string) or sendJson(object);
        preprocessResponse(new ServiceNowIncidentResponsePreprocessor()); // optional
        return (Incidents) deserialize(Response.class);
    }

    public class Response {
        public List<ServiceNowIncident> result;
    }

    // Optional preprocessor
    public class ServiceNowIncidentResponsePreprocessor extends JsonPreprocessor {
        public ServiceNowIncidentResponsePreprocessor() {
            replaceEmptyStringsWithNull = true;
            snakeCaseToCamelCase = true;
            replaceFieldNamesMap.put('number', 'ticketNumber');
            datetimeFieldsToReformat.addAll(new Set<String>{ 'sysCreatedOn', 'closedAt', 'resolvedAt' });
            sourceTimeZone = TimeZone.getTimeZone('America/Los_Angeles');
        }
    }
}
```
