import { TaskModel } from "../models/Task";
import client from "../utilities/client";

export default function indexTask(): Promise<TaskModel[]> {
  return client.get("/task").then((response) => response.data);
}
