import { GroupModel } from "./group";

export type ProfileUser = {
  id: number;
  gender: "male" | "female";
  phone: string;
};

export type UserModel = {
  id: number;
  name: string;
  username: string;
  password?: string;
  role: string;
  profile?: ProfileUser;
  token?: string;
  groups?: GroupModel[];
};
