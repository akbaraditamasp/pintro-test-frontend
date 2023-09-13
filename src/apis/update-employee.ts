import { UserModel } from "../models/user";
import client from "../utilities/client";

export default function updateEmployee({
  id,
  ...data
}: Partial<UserModel>): Promise<UserModel> {
  return client.put("/employee/" + id, data).then((response) => response.data);
}
