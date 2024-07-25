import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Menu from "../dashboard/menu";

interface FormValues {
  title: string;
  description: string;
  author: string;
}

export default function Post() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const authorId = userData.id;
  const navigate = useNavigate();
  const formik = useFormik<FormValues>({
    initialValues: {
      title: "",
      description: "",
      author: authorId || "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch(
          "http://localhost:3000/api-notebook/creating-post",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          let errorMessage = "Error desconocido";
          if (response.status === 500) {
            errorMessage = "Ocurrio un error al enviar la información";
          }
          Swal.fire({
            title: "ERROR",
            text: errorMessage,
            icon: "error",
            color: "#fff",
            background: "#111827",
          });
          return; // Salir de la función si hay un error
        }

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Post creado con exito",
          background: "#111827",
          color: "#fff",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/tabla-posts");
      } catch (error: any) {
        alert("Error: " + error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <div className="bg-gray-900 w-screen h-screen flex flex-col items-center justify-center text-white">
      <div>
        <Menu />
      </div>
      <div className="flex justify-center mb-4">
        <h1 className="text-white font-semibold text-4xl">Crear nuevo post</h1>
      </div>
      <div className="bg-slate-950 rounded-md flex justify-center p-5">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col p-5 space-y-2 text-white"
        >
          <label htmlFor="title" className="font-semibold">
            Titulo
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            className="bg-slate-900 text-sm focus:outline-none p-2 rounded"
          />
          <label htmlFor="description" className="font-semibold">
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            className="bg-slate-900 text-sm focus:outline-none p-2 rounded"
            cols={30}
            rows={5}
          />
          <input
            type="submit"
            value="Crear"
            className="bg-orange-700 font-bold text-black p-2 rounded cursor-pointer hover:bg-orange-900 hover:text-white"
          />
        </form>
      </div>
    </div>
  );
}
