import { UserModel } from "../models/user";
import client from "../utilities/client";

export default function deleteTask({
  id,
}: Partial<UserModel>): Promise<UserModel> {
  return client.delete("/task/" + id).then((response) => response.data);
}
