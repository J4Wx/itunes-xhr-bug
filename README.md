# iTunes Search XHR Issue

Initial Discovery by [Ben Brookes](https://github.com/brookesb91) and [Jamie Wood](https://github.com/J4Wx) @ [PixelBeardCo](https://pixelbeard.co).

This issue was reported to Apple via the appropriate means over 4 months ago, they've ignored my emails since then.

Whilst working with the iTunes search API we have uncovered an issue with CORS Headers.

The essence of the issue is this:

1. XHR request is sent to `https://itunes.apple.com/search?entity=software&term={Search Term}` with origin X. The search is successful and the results are returned as expected.

2. Another XHR request is sent to `https://itunes.apple.com/search?entity=software&term={Search Term}` for the same `Search Term` as the first request, with origin Y. The request results in a CORS error with the following message: `Access to XMLHttpRequest at 'https://itunes.apple.com/search?entity=software&term={Search Term}' from origin 'Y' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'X' that is not equal to the supplied origin`. This issue persists for an unknown period of time.

3. Future requests from origin X work as expected, origin Y continues to result in errors.

This means that the first origin to request search "ABC" is the only origin that can request a search for "ABC" for an unknown period of time. Any other origin requesting a search for "ABC" experiences a CORS error.

The only solution so far is to disable web security in the browser, but this should not be seen as an option and a fix is required from iTunes.

After a cursory read of the [search documentation](https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/), in particular the cache architecture diagram, it appears the issue is related to the entire response being cached, including an Access-Control-Allow-Origin header.

## Proof of Concept

To demonstrate this issue we have deployed an application to send XHR Search Requests to the iTunes API. Send a request for a term using one of the pages below, then search for the same term on the other page. The search should fail on the second page, at that point you should check the console to validate the cause of the issue.

If you use a common search term then you may encounter a CORS error on the first search because the term has already been reserved by another origin.

* [Origin 1](https://itunes-cors-poc-1.herokuapp.com/)
* [Origin 2](https://itunes-cors-poc-2.herokuapp.com/)
