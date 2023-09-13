import logout from "../apis/logout";
import { useApi } from "../utilities/api";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

export default function Header() {
  const removeCookie = useCookies(["token"])[2];

  const logoutApi = useApi({
    api: logout,
    onSuccess: () => {
      removeCookie("token", {
        path: "/",
      });
    },
  });

  return (
    <div className="container h-20 flex items-center justify-between">
      <div className="font-bold text-gray-800 text-2xl">Panel</div>
      <button
        type="button"
        onClick={() => {
          toast.promise(logoutApi.process({}), {
            pending: "Tunggu sebentar...",
            success: "Berhasil",
            error: "Gagal",
          });
        }}
      >
        Keluar
      </button>
    </div>
  );
}
