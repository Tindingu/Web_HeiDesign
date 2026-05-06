const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "123456";

export const ADMIN_SESSION_COOKIE = "icep_admin_session";

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME;
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

export function getAdminSessionValue() {
  return process.env.ADMIN_SESSION_TOKEN || "icep-admin-authenticated";
}

export function validateAdminCredentials(username: string, password: string) {
  return username === getAdminUsername() && password === getAdminPassword();
}
