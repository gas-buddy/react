/* globals window */
import fetch from 'isomorphic-fetch';

export async function fetchApi(request) {
  const {
    method = 'POST', url, body, catchErrors = false, httpResponseErrors = false, ...rest
  } = request;

  const promise = fetch(url, {
    ...rest,
    credentials: 'include',
    method,
    headers: {
      'Content-Type': 'application/json',
      'Request-Source': 'ajax',
      gbcsrf: typeof window !== 'undefined' ? window.gbcsrf : undefined,
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
