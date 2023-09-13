import { UserModel } from "../models/user";
import client from "../utilities/client";

export default function login({
  username,
  password,
}: Partial<UserModel>): Promise<UserModel> {
  return client
    .get("/auth", {
      params: {
        username,
        password,
      },
    })
    .then((response) => response.data as UserModel);
}
