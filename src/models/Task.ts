import { GroupModel } from "./group";

export type TaskModel = {
  id: number;
  title: string;
  group_id: number;
  created_at: string;
  group: GroupModel;
};
