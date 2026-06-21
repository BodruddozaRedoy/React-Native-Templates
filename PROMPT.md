### For Debugging Log

Act as an expert TypeScript developer. Create a custom Axios instance with structured, highly readable console debugging loggers and interceptors. 

Please structure the code according to the guidelines below:

### 1. Configuration & Instantiation
- Instantiate a custom Axios instance using `axios.create` with a configurable `baseURL` and a `timeout` of 15 seconds.

### 2. Debugging Loggers
Implement three helper functions that print beautifully formatted console logs with clear block dividers:
- **`logRequest(config)`**: Logs the full URL, uppercase HTTP method, request headers, query params (if any), and request body (if any). Use block borders like `================ REQUEST ================`.
- **`logResponse(response)`**: Logs the request URL, HTTP status code, and the response data. Use block borders like `================ RESPONSE ================`.
- **`logError(error)`**: Logs the request URL, method, HTTP status code, error message, and response data from the Axios error. Use block borders like `================ ERROR =================`.

### 3. Request Interceptor
- Intercept outgoing requests.
- Retrieve an access token asynchronously (e.g., from local storage or keychain).
- Log the auth token or print "NO TOKEN FOUND" inside a styled console block.
- Define a list of authentication endpoints where authentication is NOT required (e.g., login, register, forget-password, reset-password, verify/resend OTP).
- If a token is found and the endpoint doesn't exclude authentication, set the `Authorization: Bearer <token>` header. Otherwise, delete the header.
- Invoke the `logRequest` helper before returning the config.
- Catch and log any interceptor errors.

### 4. Response Interceptor
- **On Success**: Invoke the `logResponse` helper and return the response.
- **On Error**:
  - Invoke the `logError` helper.
  - Inspect the error response status and response data messages.
  - Determine if the user should be forcefully logged out (e.g., HTTP 401 Unauthorized, or if the response error text contains "sign in required" on non-auth endpoints).
  - If a force logout is required:
    - Log an `============= AUTO LOGOUT =============` block with the reason.
    - Asynchronously clear the authentication session.
    - Redirect the user to the Sign In / Login route.
  - Return `Promise.reject(error)`.

Ensure the code is written in clean, modern TypeScript, includes proper type imports (`AxiosError`, `AxiosRequestConfig`, `AxiosResponse`), and contains placeholders/comments where storage helpers or navigation routers should be plugged in.
