import { TaskModel } from "../models/Task";
import client from "../utilities/client";

export default function storeTask(
  data: Partial<TaskModel>
): Promise<TaskModel> {
  return client.post("/task", data).then((response) => response.data);
}
