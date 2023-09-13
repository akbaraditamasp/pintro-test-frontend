import { useForm } from "react-hook-form";
import TextField from "../components/TextField";
import { FaUser, FaLock } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useApi } from "../utilities/api";
import login from "../apis/login";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [cookies, setCookies] = useCookies(["token"]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginApi = useApi({
    api: login,
    onSuccess: (data) => {
      setCookies("token", data?.token, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    },
  });

  useEffect(() => {
    if (cookies.token) {
      navigate("/", { replace: true });
    }
  }, [cookies]);

  return (
    <div className="w-full min-h-screen p-8 flex justify-center items-center bg-gray-100">
      <div className="w-full lg:w-[460px] bg-white border rounded p-8">
        <div className="mb-16 text-2xl font-bold text-center text-gray-800">
          Login
        </div>
        <form
          onSubmit={handleSubmit(({ username, password }) => {
            toast.promise(loginApi.process({ username, password }), {
              pending: "Tunggu sebentar...",
              success: "Berhasil masuk",
              error: "Username atau password salah",
            });
          })}
        >
          <TextField
            type="text"
            placeholder="Username"
            icon={FaUser}
            message={errors.username?.message}
            {...register("username", {
              required: true,
            })}
            containerClassName="mb-5"
          />
          <TextField
            type="password"
            placeholder="Password"
            icon={FaLock}
            message={errors.password?.message}
            {...register("password", {
              required: true,
            })}
            containerClassName="mb-5"
          />
          <button
            className="w-full h-12 bg-blue-500 text-white rounded hover:bg-blue-600"
            type="submit"
            disabled={loginApi.isLoading}
          >
            MASUK
          </button>
        </form>
      </div>
    </div>
  );
}
