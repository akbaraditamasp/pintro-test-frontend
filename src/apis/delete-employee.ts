import { UserModel } from "../models/user";
import client from "../utilities/client";

export default function deleteEmployee({
  id,
}: Partial<UserModel>): Promise<UserModel> {
  return client.delete("/employee/" + id).then((response) => response.data);
}
