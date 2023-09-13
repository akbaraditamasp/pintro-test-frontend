import { GroupModel } from "../models/group";
import client from "../utilities/client";

export default function indexGroups(): Promise<GroupModel[]> {
  return client.get("/employee/groups").then((response) => response.data);
}
