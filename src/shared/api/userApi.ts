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
type AvatarResponse = ApiResponse<User>;

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

const sendAvatar = (endpoint: string, file: File): Promise<AvatarResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return httpClient.postForm(endpoint, formData);
};

export const uploadAvatar = (file: File) => sendAvatar(API_UPLOAD_AVATAR, file);
export const changeAvatar = (file: File) => sendAvatar(API_CHANGE_AVATAR, file);
export const deleteAvatar = (): Promise<AvatarResponse> =>
  httpClient.post(API_DELETE_AVATAR, undefined);
