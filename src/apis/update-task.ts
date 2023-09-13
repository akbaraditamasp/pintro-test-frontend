import { TaskModel } from "../models/Task";
import client from "../utilities/client";

export default function updateTask({
  id,
  ...data
}: Partial<TaskModel>): Promise<TaskModel> {
  return client.put("/task/" + id, data).then((response) => response.data);
}
