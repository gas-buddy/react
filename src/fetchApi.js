import fetch from 'isomorphic-fetch';

export async function fetchApi(request) {
  const { method = 'POST', url, body, catchErrors = false } = request;

  const promise = fetch(url, {
    credentials: 'include',
    method,
    headers: {
      'Content-Type': 'application/json',
      'Request-Source': 'ajax',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
    .then(async (response) => {
      const { headers, status } = response;
      const responseBody = await response.json();
      return { request, status, headers, body: responseBody };
    });
  if (catchErrors) {
    return promise.catch(error => ({
      error,
      request,
    }));
  }
  return promise;
}
