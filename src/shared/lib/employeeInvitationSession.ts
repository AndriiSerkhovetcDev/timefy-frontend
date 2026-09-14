export const EMPLOYEE_INVITATION_TOKEN_KEY = "employeeInvitationToken";
export const EMPLOYEE_INVITATION_INTENT_KEY = "employeeInvitationIntent";
export const POST_AUTH_RETURN_PATH_KEY = "postAuthReturnPath";
export const EMPLOYEE_INVITE_PATH = "/employee-invite";

export const captureEmployeeInvitationToken = () => {
  const token = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("token");
  if (token) {
    sessionStorage.setItem(EMPLOYEE_INVITATION_TOKEN_KEY, token);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  return token ?? sessionStorage.getItem(EMPLOYEE_INVITATION_TOKEN_KEY);
};

export const clearEmployeeInvitation = () => {
  sessionStorage.removeItem(EMPLOYEE_INVITATION_TOKEN_KEY);
  sessionStorage.removeItem(EMPLOYEE_INVITATION_INTENT_KEY);
};

export const prepareInvitationAuth = (acceptAfterAuth: boolean) => {
  sessionStorage.setItem(POST_AUTH_RETURN_PATH_KEY, EMPLOYEE_INVITE_PATH);
  if (acceptAfterAuth) sessionStorage.setItem(EMPLOYEE_INVITATION_INTENT_KEY, "accept");
  else sessionStorage.removeItem(EMPLOYEE_INVITATION_INTENT_KEY);
};

export const hasEmployeeInvitationIntent = () =>
  sessionStorage.getItem(EMPLOYEE_INVITATION_INTENT_KEY) === "accept";

export const consumePostAuthReturnPath = () => {
  const path = sessionStorage.getItem(POST_AUTH_RETURN_PATH_KEY);
  sessionStorage.removeItem(POST_AUTH_RETURN_PATH_KEY);
  return path === EMPLOYEE_INVITE_PATH ? path : null;
};
