import { beforeEach, describe, expect, it } from "vitest";
import {
  captureEmployeeInvitationToken,
  consumePostAuthReturnPath,
  EMPLOYEE_INVITATION_INTENT_KEY,
  EMPLOYEE_INVITATION_TOKEN_KEY,
  hasEmployeeInvitationIntent,
  POST_AUTH_RETURN_PATH_KEY,
  prepareInvitationAuth,
} from "./employeeInvitationSession";

describe("employee invitation session", () => {
  beforeEach(() => {
    sessionStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("captures a fragment token and immediately removes it from the URL", () => {
    window.history.replaceState(null, "", "/employee-invite#token=opaque-token");
    expect(captureEmployeeInvitationToken()).toBe("opaque-token");
    expect(sessionStorage.getItem(EMPLOYEE_INVITATION_TOKEN_KEY)).toBe("opaque-token");
    expect(window.location.hash).toBe("");
  });

  it("allows only the known local post-auth return path", () => {
    sessionStorage.setItem(POST_AUTH_RETURN_PATH_KEY, "https://evil.example");
    expect(consumePostAuthReturnPath()).toBeNull();
    prepareInvitationAuth(false);
    expect(consumePostAuthReturnPath()).toBe("/employee-invite");
  });

  it("records automatic accept only after an explicit action", () => {
    prepareInvitationAuth(false);
    expect(hasEmployeeInvitationIntent()).toBe(false);
    prepareInvitationAuth(true);
    expect(sessionStorage.getItem(EMPLOYEE_INVITATION_INTENT_KEY)).toBe("accept");
  });
});
