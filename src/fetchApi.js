/* globals window */
import fetch from 'isomorphic-fetch';

export async function fetchApi(request) {
  const {
    method = 'POST',
    url,
    body,
    catchErrors = false,
    httpResponseErrors = false,
    headers: requestHeaders = {},
    ...rest
  } = request;

  const promise = fetch(url, {
    ...rest,
    // Although the credentials are being passed into request here, note that the fetch calls
    // from app would not include cookies as fetch support is inconsistent with node-fetch being used indirectly
    // https://github.com/node-fetch/node-fetch/tree/v2.1.2?tab=readme-ov-file#class-request
    credentials: 'include',
    method,
    headers: {
      'Content-Type': 'application/json',
      'Request-Source': 'ajax',
      gbcsrf: typeof window !== 'undefined' ? window.gbcsrf : undefined,
      // This is so that apps could pass on `Authorization` header in case of reauth
      // As there is no cookie support for fetch calls from webview environment
      ...requestHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
    .then(async (response) => {
      const { headers, status } = response;
      let responseBody;
      const contentType = response.headers.get('content-type')?.toLowerCase();
      if (!contentType) {
        responseBody = await response.text();
      } else if (contentType.includes('application/json')) {
        responseBody = await response.json();
      } else {
        responseBody = await response.blob();
      }

      if (httpResponseErrors && (status < 200 || status > 299)) {
        return {
          error: new Error(responseBody?.message || status),
          body: responseBody,
          status,
          headers,
          request,
        };
      }

      return {
        request, status, headers, body: responseBody,
      };
    });
  if (catchErrors) {
    return promise.catch(error => ({
      error,
      request,
    }));
  }
  return promise;
}
