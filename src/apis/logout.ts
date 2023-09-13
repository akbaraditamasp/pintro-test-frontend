import { UserModel } from "../models/user";
import client from "../utilities/client";

export default function logout(): Promise<UserModel> {
  return client.delete("/auth").then((response) => response.data);
}
