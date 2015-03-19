BARE BONES SPEC

* What should the service interface look like?
    - Single `url` query parameter
        - e.g., `simq.com?url=www.images.com%2Fjss.jpg`
        - Returns a 64-bit hex string
* Usage patterns
    1. User queries the service with a URL. e.g. `simq.com?url=www.images.com%2Fjss.jpg`
    2. If URL/fingerprint pair is already cached, return the fingerprint. Otherwise, calculate and cache its fingerprint.

BEST PRACTICES

* Sanitize input URLs.
* Check HTTP headers first.
    - Ensure MIME types are acceptable (images only)
    - Ensure file size is within a reasonable limit
