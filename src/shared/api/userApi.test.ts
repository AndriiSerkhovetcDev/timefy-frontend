import type { User } from "@/features/auth/model/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "./httpClient";
import { changeAvatar, deleteAvatar, uploadAvatar } from "./userApi";

vi.mock("./httpClient", () => ({
  httpClient: {
    post: vi.fn(),
    postForm: vi.fn(),
  },
}));

const user: User = {
  login: "test-user",
  role: "USER",
  email: "test@example.com",
  phone: null,
  emailVerified: true,
  avatar: "/files/new-avatar",
};

const response = {
  status: 200,
  code: "OK",
  message: "Успішно",
};

describe("avatar API response", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes the current nested user response", async () => {
    vi.mocked(httpClient.postForm).mockResolvedValue({
      ...response,
      data: { user },
    });

    const result = await changeAvatar(new File(["avatar"], "avatar.png"));

    expect(result.data.user).toEqual(user);
  });

  it("supports the previous direct user response", async () => {
    vi.mocked(httpClient.postForm).mockResolvedValue({
      ...response,
      data: user,
    });

    const result = await uploadAvatar(new File(["avatar"], "avatar.png"));

    expect(result.data.user).toEqual(user);
  });

  it("normalizes the delete response", async () => {
    vi.mocked(httpClient.post).mockResolvedValue({
      ...response,
      data: { user: { ...user, avatar: null } },
    });

    const result = await deleteAvatar();

    expect(result.data.user.avatar).toBeNull();
  });
});
