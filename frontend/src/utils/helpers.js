// src/utils/helpers.js
export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error("Invalid token:", e);
    return {};
  }
}