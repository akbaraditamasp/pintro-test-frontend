import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import client from "../utilities/client";
import { useApi } from "../utilities/api";
import checkToken from "../apis/check-token";
import { UserModel } from "../models/user";
import TaskPage from "./TaskPage";

export default function Main() {
  const [cookies, _setCookie, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const [user, setUser] = useState<UserModel | null>(null);

  const checkTokenApi = useApi({
    api: checkToken,
    onSuccess: (data) => {
      setUser(data);
    },
    onFail: (e) => {
      if (e?.response?.status === 401) {
        removeCookie("token", {
          path: "/",
        });
      }
    },
  });

  useEffect(() => {
    if (!cookies.token) {
      navigate("/auth", { replace: true });
    } else {
      client.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${cookies.token}`;
      checkTokenApi.process({});
    }
  }, [cookies]);

  if (!user) return null;

  if (user.role === "employee") return <TaskPage employee />;

  return <Outlet context={{ user }} />;
}
