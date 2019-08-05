# iTunes Search XHR Issue

Whilst working with the iTunes search API we have uncovered an issue with CORS Headers.

The essence of the issue is this:

1. XHR request is sent to `https://itunes.apple.com/search?entity=software&term={Search Term}` with origin X. The search is successful and the results are returned as expected.

2. Another XHR request is sent to `https://itunes.apple.com/search?entity=software&term={Search Term}` for the same `Search Term` as the first request, with origin Y. The request results in a CORS error with the following message: `Access to XMLHttpRequest at 'https://itunes.apple.com/search?entity=software&term={Search Term}' from origin 'Y' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'X' that is not equal to the supplied origin`. This issue persists for an unknown period of time.

3. Future requests from origin X work as expected, origin Y continues to result in errors.

This means that the first origin to request search "ABC" is the only origin that can request a search for "ABC" for an unknown period of time. Any other origin requesting a search for "ABC" experiences a CORS error.

The only solution so far is to disable web security in the browser, but this should not be seen as an option and a fix is required from iTunes.

After a cursory read of the [search documentation](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/), in particular the cache architecture diagram, it appears the issue is related to the entire response being cached, including an Access-Control-Allow-Origin header.
