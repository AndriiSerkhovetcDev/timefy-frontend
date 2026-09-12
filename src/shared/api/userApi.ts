import type { User } from "@/features/auth/model/types";
import { httpClient } from "./httpClient";

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type ApiResponse<T> = {
  status: number;
  code: string;
  message: string;
  data: T;
};

type UpdateProfileResponse = ApiResponse<{ user: User }>;
type AvatarResponsePayload = User | { user: User };
type AvatarResponse = ApiResponse<{ user: User }>;

const API_UPDATE_PROFILE = "/users/update-profile";
const API_UPLOAD_AVATAR = "/users/avatar/upload";
const API_CHANGE_AVATAR = "/users/avatar/change";
const API_DELETE_AVATAR = "/users/avatar/delete";

export const updateProfile = ({
  firstName,
  lastName,
  email,
  phone,
}: UpdateProfilePayload): Promise<UpdateProfileResponse> =>
  httpClient.post(
    API_UPDATE_PROFILE,
    {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
    },
    { credentials: "include" },
  );

const normalizeAvatarResponse = (response: ApiResponse<AvatarResponsePayload>): AvatarResponse => ({
  ...response,
  data: {
    user: "user" in response.data ? response.data.user : response.data,
  },
});

const sendAvatar = async (endpoint: string, file: File): Promise<AvatarResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.postForm<ApiResponse<AvatarResponsePayload>>(
    endpoint,
    formData,
  );
  return normalizeAvatarResponse(response);
};

export const uploadAvatar = (file: File) => sendAvatar(API_UPLOAD_AVATAR, file);
export const changeAvatar = (file: File) => sendAvatar(API_CHANGE_AVATAR, file);
export const deleteAvatar = async (): Promise<AvatarResponse> => {
  const response = await httpClient.post<ApiResponse<AvatarResponsePayload>>(
    API_DELETE_AVATAR,
    undefined,
  );
  return normalizeAvatarResponse(response);
};
