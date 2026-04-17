const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const request = async (path, options = {}, token) => {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch (_error) {
    throw new Error("Unable to reach the server. Make sure the backend is running on port 5000.");
  }

  return parseResponse(response);
};

export { API_BASE_URL };
