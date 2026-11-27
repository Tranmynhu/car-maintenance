// Mini library for talking to the backend. Load after config.js.
//
// Usage:
//   attempt(api.get(CAR_URL, { userId })).then(function ({ data, error }) {
//       if (error) { ...show a message...; return; }
//       ...use data...
//   });
//
// api.get/post/put/delete throw an ApiError when the server cannot be reached
// or answers with a non-2xx status. attempt() turns that into { data, error }
// so callers don't need their own try/catch.

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "ApiError";
        this.status = status; // undefined when the server could not be reached
    }
}

function buildUrl(url, params) {
    if (!params) {
        return url;
    }

    const query = new URLSearchParams(params).toString();
    return query ? url + "?" + query : url;
}

function request(method, url, { params, body } = {}) {
    const options = { method };

    if (body !== undefined) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }

    return fetch(buildUrl(url, params), options)
        .catch(function () {
            throw new ApiError("Could not reach the server.");
        })
        .then(function (response) {
            if (!response.ok) {
                throw new ApiError("Request failed: " + response.status, response.status);
            }

            return response.text();
        })
        // Some endpoints (e.g. DELETE) return an empty body
        .then(function (text) {
            return text ? JSON.parse(text) : null;
        });
}

const api = {
    get: function (url, params) {
        return request("GET", url, { params });
    },
    post: function (url, body) {
        return request("POST", url, { body });
    },
    put: function (url, body) {
        return request("PUT", url, { body });
    },
    delete: function (url, params) {
        return request("DELETE", url, { params });
    }
};

// Wait for a promise and return { data, error } instead of throwing.
function attempt(promise) {
    return promise.then(
        function (data) {
            return { data, error: null };
        },
        function (error) {
            return { data: null, error };
        }
    );
}
