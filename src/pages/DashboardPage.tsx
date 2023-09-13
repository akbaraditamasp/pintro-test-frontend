import { JSXElementConstructor, ReactElement, useEffect } from "react";
import { Container, render } from "react-dom";
import { Link } from "react-router-dom";
import indexEmployee from "../apis/index-employee";
import Table from "../components/Table";
import { useApi } from "../utilities/api";
import { UserModel } from "../models/user";
import { FaEye, FaTrash } from "react-icons/fa";
import Modal from "../components/modal";
import { useModal } from "../components/modal/useModal";
import TextField from "../components/TextField";
import { useForm, Controller } from "react-hook-form";
import SelectField from "../components/SelectField";
import storeEmployee from "../apis/store-employee";
import { toast } from "react-toastify";
import updateEmployee from "../apis/update-employee";
import deleteEmployee from "../apis/delete-employee";
import CreatableSelectField from "../components/CreatableSelectField";
import { GroupModel } from "../models/group";
import indexGroups from "../apis/index-groups";
import Header from "../components/Header";

export default function DashboardPage() {
  const { control: modal, state: modalState } = useModal({
    initialState: null as Partial<UserModel> | null,
  });

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      password: "",
      gender: "",
      phone: "",
      groups: [] as GroupModel[],
    },
  });

  const indexEmployeeApi = useApi({
    api: indexEmployee,
    onSuccess: () => {
      indexGroupsApi.process({});
    },
  });

  const storeEmployeeApi = useApi({
    api: storeEmployee,
    onSuccess: () => {
      indexEmployeeApi.process({});
      modal.close();
    },
  });

  const deleteEmployeeApi = useApi({
    api: deleteEmployee,
    onSuccess: () => {
      indexEmployeeApi.process({});
    },
  });

  const updateEmployeeApi = useApi({
    api: updateEmployee,
    onSuccess: () => {
      indexEmployeeApi.process({});
      modal.close();
    },
  });

  const indexGroupsApi = useApi({
    api: indexGroups,
  });

  useEffect(() => {
    indexEmployeeApi.process({});
  }, []);

  useEffect(() => {
    reset({
      name: modalState?.name || "",
      username: modalState?.username || "",
      password: "",
      gender: modalState?.profile?.gender || "",
      phone: modalState?.profile?.phone || "",
      groups: modalState?.groups || [],
    });
  }, [modalState]);

  return (
    <div className="w-full min-h-screen bg-gray-200 flex flex-col items-center">
      <Header />
      <div className="container flex justify-start space-x-5 mt-8">
        <Link
          to="/"
          className="py-3 px-5 rounded bg-blue-500 text-white text-sm"
        >
          Pengguna
        </Link>
        <Link to="/task" className="py-3 px-5 rounded bg-white text-sm">
          Tugas
        </Link>
      </div>
      <div className="mt-5 bg-white rounded p-5 container">
        <div className="mb-5 border-b pb-5">
          <button
            type="button"
            className="py-3 px-5 bg-green-600 text-white rounded"
            onClick={() => modal.open({})}
          >
            Tambah
          </button>
        </div>
        <Table
          config={{
            data: (indexEmployeeApi.data || []).map(
              (item, index) =>
                ({
                  index: index + 1,
                  ...item,
                } as UserModel & { index: number })
            ),
            columns: [
              { title: "NO", data: "index", className: "w-16" },
              {
                title: "NAMA",
                data: "name",
                className: "w-[30%]",
              },
              {
                title: "USERNAME",
                data: "username",
              },
              {
                title: "JENIS KELAMIN",
                render: (_a, _b, row: UserModel) =>
                  row.profile?.gender === "male" ? "Laki-laki" : "Perempuan",
              },
              {
                title: "NO. HP",
                render: (_a, _b, row: UserModel) => row.profile?.phone,
              },
              {
                title: "",
                data: "id",
                createdCell: (td, _cellData, rowData, _row, _col) =>
                  render(
                    (
                      <div className="flex justify-center items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => modal.open(rowData)}
                          className="text-sm p-1 px-3 bg-yellow-500 text-white rounded flex items-center justify-start space-x-2"
                        >
                          <FaEye />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="text-sm p-1 px-3 bg-red-500 text-white rounded flex items-center justify-start space-x-2"
                          onClick={() => {
                            toast.promise(
                              deleteEmployeeApi.process({ id: rowData.id }),
                              {
                                pending: "Tunggu sebentar...",
                                success: "Berhasil",
                                error: "Gagal",
                              }
                            );
                          }}
                        >
                          <FaTrash />
                          <span>Hapus</span>
                        </button>
                      </div>
                    ) as unknown as ReactElement<
                      any,
                      string | JSXElementConstructor<any>
                    >[],
                    td as Container
                  ),
              },
            ],
            destroy: true,
          }}
        />
      </div>
      <Modal
        control={modal}
        title={modalState?.id ? "Edit Pengguna" : "Tambah Pengguna"}
      >
        <form
          onSubmit={handleSubmit((data) => {
            toast.promise(
              modalState?.id
                ? updateEmployeeApi.process({
                    id: modalState.id,
                    ...data,
                  })
                : storeEmployeeApi.process(data),
              {
                pending: "Menyimpan...",
                success: "Berhasil",
                error: "Gagal",
              }
            );
          })}
        >
          <TextField
            type="text"
            label="Nama"
            message={errors.name?.message}
            {...register("name", {
              required: "Wajib diisi",
            })}
            containerClassName="mb-5"
          />
          <TextField
            type="text"
            label="Username"
            message={errors.username?.message}
            {...register("username", {
              required: "Wajib diisi",
            })}
            containerClassName="mb-5"
          />
          <TextField
            type="password"
            label="Password"
            message={errors.password?.message}
            {...register("password", {
              required: modalState ? false : "Wajib diisi",
            })}
            containerClassName="mb-5"
          />
          <Controller
            control={control}
            name="gender"
            rules={{
              required: "Wajib diisi",
            }}
            render={({ field: { value, onChange } }) => (
              <SelectField
                message={errors.gender?.message}
                value={value}
                onChange={({ value }: any) => onChange(value)}
                label="Jenis Kelamin"
                containerClassName="mb-5"
                options={[
                  {
                    value: "male",
                    label: "Laki-laki",
                  },
                  {
                    value: "female",
                    label: "Perempuan",
                  },
                ]}
              />
            )}
          />

          <TextField
            type="numeric"
            label="No. HP"
            message={errors.phone?.message}
            {...register("phone", {
              required: "Wajib diisi",
            })}
            containerClassName="mb-5"
          />
          <Controller
            control={control}
            name="groups"
            rules={{
              required: "Wajib diisi",
            }}
            render={({ field: { value, onChange } }) => (
              <CreatableSelectField
                label="Grup"
                value={value.map((item) => item.id || item.name)}
                onChange={(e: any) =>
                  onChange(
                    ((e as any[]) || []).map((item) => ({
                      id: item.__isNew__ ? undefined : item.value,
                      name: item.__isNew__ ? item.value : undefined,
                    }))
                  )
                }
                containerClassName="mb-5"
                options={
                  indexGroupsApi.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })) || []
                }
                isMulti
              />
            )}
          />
          <div className="border-t pt-5">
            <button
              type="submit"
              className="py-3 px-5 bg-green-600 text-white rounded"
            >
              {modalState?.id ? "Edit" : "Tambah"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
