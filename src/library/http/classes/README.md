# Example

```apex
// Optional company-level callout
public virtual inherited sharing class MyCallout extends HttpCallout {
    // e.g. override error handling
    protected override void handleCalloutError(HttpResponse resp) {
        // TODO error logging
        throw new HttpCalloutException('HTTP callout error');
    }
}

// Optional service-level callout
public virtual inherited sharing class ServiceNowCallout extends MyCallout {
    // e.g. define endpoint, protocol
    public ServiceNowCallout() {
        super('callout:serviceNow');
        headers.setAccept(MediaType.APPLICATION_JSON);
    }
}

// Implementation callout
public inherited sharing class ServiceNowGetIncidentCallout extends ServiceNowCallout {

    public Response call(Id recordId) {
        setPath('/now/table/x_pust_customer_solutions');
        setQueryString('sysparm_query', '^variables.06ba51b7db94e01027796a19139619e0=' + recordId);
        setQueryString('sysparm_display_value', 'true');
        send();
        preprocessResponse(new ServiceNowIncidentResponsePreprocessor());
        return (Response) deserialize(Response.class);
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
