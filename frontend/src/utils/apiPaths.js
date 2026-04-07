const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9001";
const BASE_URL = `${API_BASE_URL}/api`;

export const API_PATHS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    SIGNUP: `${BASE_URL}/auth/signup`,
  },
  SESSION: {
    CREATE: `${BASE_URL}/sessions/create`,
    GET_ALL: `${BASE_URL}/sessions/my-sessions`,
    GET_ONE: `${BASE_URL}/sessions`, // usage: GET_ONE/:id
    DELETE: `${BASE_URL}/sessions`, // usage: DELETE/:id
  },
  AI: {
    GENERATE_QUESTIONS: `${BASE_URL}/ai/generate-questions`,
    EXPLAIN: `${BASE_URL}/ai/generate-explanation`,
  },
  QUESTION: {
    PIN: `${BASE_URL}/questions`, // usage: PIN/:id/pin
  },
};
