import { UserModel } from "../models/user";
import client from "../utilities/client";

export default function indexEmployee(): Promise<UserModel[]> {
  return client.get("/employee").then((response) => response.data);
}
