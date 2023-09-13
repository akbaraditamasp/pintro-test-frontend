import { UserModel } from "../models/user";
import client from "../utilities/client";

export default function checkToken(): Promise<UserModel> {
  return client.get("/auth/check").then((response) => response.data);
}
