import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

interface PostData {
  _id: string;
  title: string;
  description: string;
  date: Date;
  author: string;
}

interface FormValues {
  _id: string,
  title: string;
  description: string;
  date: Date;
  author: string;
}

export default function EditPost() {
  const [postData, setPostData] = useState<PostData | null>(null);
  const { postId } = useParams<{ postId: string }>();
  const [loading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getPostData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api-notebook/get-post/${postId}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          alert("Post no encontrado");
        } else if (response.status === 500) {
          alert("Ocurrio un error al recuperar la información");
        }
        return;
      }
      const data = await response.json();
      const postInfo = data.postFound;
      setPostData(postInfo);
    } catch (error: any) {
      alert("Error " + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostData();
  }, [postId]);

  const formik = useFormik<FormValues>({
    initialValues: {
      _id : postData?._id || '',
      title: postData?.title || "",
      description: postData?.description || "",
      date: new Date() || '',
      author: postData?.author || ''

    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const authorId = userData.id;
        const response = await fetch(
          `http://localhost:3000/api-notebook/edit-post/${postData?._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "author-id": `${authorId}`,
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          let errorMessage = "Error desconocido";
          if (response.status === 400) {
            errorMessage = "Parametros incompletos ";
          } else if (response.status === 403) {
            errorMessage = "No eres dueño de este post";
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
          title: "Post actualizado",
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
    <div className="bg-gray-900 w-screen h-screen flex flex-col items-center justify-center">
      <div className="flex justify-center mb-4">
        <h1 className="text-white font-semibold text-4xl">
          Formulario de edición
        </h1>
      </div>
      <div className="bg-slate-950 rounded-md flex justify-center p-5">
        <form onSubmit={formik.handleSubmit} className="flex flex-col p-5 space-y-2 text-white">
          <label htmlFor="title" className="font-semibold">
            Titulo
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder={postData?.title}
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
            placeholder={postData?.description}
            onChange={formik.handleChange}
            value={formik.values.description}
            className="bg-slate-900 text-sm focus:outline-none p-2 rounded"
            cols={30}
            rows={5}
          />
          <input
            type="submit"
            value="Guardar"
            className="bg-orange-700 font-bold text-black p-2 rounded cursor-pointer hover:bg-orange-900 hover:text-white"
          />
        </form>
      </div>
      <div className="flex justify-center pt-3">
        <Link
          to="/tabla-posts"
          className="bg-slate-950 p-2 rounded-md font-semibold text-white hover:bg-neutral-700"
        >
          Regresar
        </Link>
      </div>
    </div>
  );
}
