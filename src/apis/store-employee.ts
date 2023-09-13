import { UserModel } from "../models/user";
import client from "../utilities/client";

export default function storeEmployee(
  data: Partial<UserModel>
): Promise<UserModel> {
  return client.post("/employee", data).then((response) => response.data);
}
