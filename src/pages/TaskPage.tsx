import { JSXElementConstructor, ReactElement, useEffect } from "react";
import { Container, render } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import deleteTask from "../apis/delete-task";
import indexGroups from "../apis/index-groups";
import indexTask from "../apis/index-task";
import storeTask from "../apis/store-task";
import updateTask from "../apis/update-task";
import SelectField from "../components/SelectField";
import Table from "../components/Table";
import TextField from "../components/TextField";
import Modal from "../components/modal";
import { useModal } from "../components/modal/useModal";
import { TaskModel } from "../models/Task";
import { useApi } from "../utilities/api";
import Header from "../components/Header";

export default function TaskPage({ employee = false }: { employee?: boolean }) {
  const { control: modal, state: modalState } = useModal({
    initialState: null as TaskModel | null,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      group_id: null as string | null | number,
    },
  });

  const indexGroupsApi = useApi({
    api: indexGroups,
  });

  const indexTaskApi = useApi({
    api: indexTask,
    onSuccess: () => {
      indexGroupsApi.process({});
    },
  });

  const deleteTaskApi = useApi({
    api: deleteTask,
    onSuccess: () => {
      indexTaskApi.process({});
      modal.close();
    },
  });

  const storeTaskApi = useApi({
    api: storeTask,
    onSuccess: () => {
      indexTaskApi.process({});
      modal.close();
    },
  });

  const updateTaskApi = useApi({
    api: updateTask,
    onSuccess: () => {
      indexTaskApi.process({});
      modal.close();
    },
  });

  useEffect(() => {
    indexTaskApi.process({});
  }, []);

  useEffect(() => {
    reset({
      title: modalState?.title || "",
      group_id: modalState?.group_id || null,
    });
  }, [modalState]);

  return (
    <div className="w-full min-h-screen bg-gray-200 flex flex-col items-center">
      <Header />
      {!employee && (
        <div className="container flex justify-start space-x-5 mt-8">
          <Link to="/" className="py-3 px-5 rounded bg-white text-sm">
            Pengguna
          </Link>
          <Link
            to="/task"
            className="py-3 px-5 rounded bg-blue-500 text-white text-sm"
          >
            Tugas
          </Link>
        </div>
      )}
      <div className="mt-5 bg-white rounded p-5 container">
        {!employee && (
          <div className="mb-5 border-b pb-5">
            <button
              type="button"
              className="py-3 px-5 bg-green-600 text-white rounded"
              onClick={() => modal.open(null)}
            >
              Tambah
            </button>
          </div>
        )}
        <Table
          config={{
            data: (indexTaskApi.data || []).map(
              (item, index) =>
                ({
                  index: index + 1,
                  ...item,
                } as TaskModel & { index: number })
            ),
            columns: [
              { title: "NO", data: "index", className: "w-16" },
              {
                title: "GRUP",
                render: (_a, _b, row: TaskModel) => `${row.group.name}`,
                className: "w-[20%]",
              },
              {
                title: "TUGAS",
                data: "title",
              },
              {
                title: "",
                data: "id",
                createdCell: (td, _cellData, rowData, _row, _col) =>
                  render(
                    (employee ? (
                      ""
                    ) : (
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
                              deleteTaskApi.process({ id: rowData.id }),
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
                    )) as unknown as ReactElement<
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
        title={modalState?.id ? "Edit Tugas" : "Tambah Tugas"}
      >
        <form
          onSubmit={handleSubmit(({ group_id, ...data }) => {
            toast.promise(
              modalState?.id
                ? updateTaskApi.process({
                    id: modalState.id,
                    group_id: group_id as number,
                    ...data,
                  })
                : storeTaskApi.process({
                    group_id: group_id as number,
                    ...data,
                  }),
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
            label="Tugas"
            message={errors.title?.message}
            {...register("title", {
              required: "Wajib diisi",
            })}
            containerClassName="mb-5"
          />
          <Controller
            control={control}
            name="group_id"
            rules={{
              required: "Wajib diisi",
            }}
            render={({ field: { value, onChange } }) => (
              <SelectField
                label="Grup"
                value={value || ""}
                onChange={(item: any) => onChange(item.value)}
                containerClassName="mb-5"
                options={
                  indexGroupsApi.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })) || []
                }
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
