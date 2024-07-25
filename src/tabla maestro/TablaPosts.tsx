import { useEffect, useState } from "react";
import Menu from "../dashboard/menu";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface PostsData {
  _id: string;
  title: string;
  date: Date;
  author: string;
  authorData: {
    email: string;
    username: string;
  };
}

export default function TablaPosts() {
  const [postData, setPostData] = useState<PostsData[]>([]);
  const [mensaje, setMensaje] = useState<string>("");
  const navigate = useNavigate();

  const getPostData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api-notebook/posts");
      if (!response.ok) {
        if (response.status === 404) {
          setMensaje("No existen posts por el momento");
        } else {
          setMensaje("Ocurrio un error al recuperar la información");
        }
        setPostData([]); // Asegurarse de que postData es un arreglo vacío
        return;
      }
      const data = await response.json();
      setPostData(data.posts);
    } catch (error) {
      console.log(error);
      setPostData([]); // Asegurarse de que postData es un arreglo vacío
      setMensaje("Ocurrió un error al recuperar la información");
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  const eliminar = async (id: string) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const authorId = userData.id;
      

      if (!authorId) {
        Swal.fire({
          title: "ERROR",
          text: "ID del autor no disponible. No puedes realizar esta acción.",
          icon: "error",
          color: "#fff",
          background: "#111827",
        });
        localStorage.clear();
        console.clear();
        navigate("/");
      }
      const response = await fetch(
        `http://localhost:3000/api-notebook/delete-post/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "author-id": `${authorId}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = "Error desconocido";
        if (response.status === 400) {
          errorMessage = "Parametros insuficientes";
        } else if (response.status === 403) {
          errorMessage = "No eres dueño de este POST, no lo puedes modificar";
        }
        else if (response.status === 404) {
          errorMessage = "Post no encontrado";
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

      setPostData((filtrar) => filtrar.filter((post) => post._id !== id));
      Swal.fire({
        title: "Eliminado!!",
        text: "Este documento ha sido eliminado",
        icon: "success",
        color: "#fff",
        background: "#111827",
        confirmButtonColor: "#c2410c",
      });
    } catch (error: any) {
      Swal.fire({
        title: "ERROR",
        text: "Hubo un problema al intentar eliminar el POST",
        icon: "error",
        color: "#fff",
        background: "#111827",
      });
      console.log(error)
    }
  };

  const deleteAlert = (id: string) => {
    console.log(id);
    
    Swal.fire({
      title: "¿Estás seguro de esta acción?",
      text: "Este proceso es irreversible",
      icon: "warning",
      background: "#111827",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#c2410c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, adelante",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(id);
      }
    });
  };

  return (
    <div className="bg-gray-900 w-screen h-screen flex flex-col">
      <div className="flex justify-center p-4">
        <Menu />
      </div>
      <div className="flex justify-center">
        <h1 className="text-white text-3xl font-semibold">Catalogo Posts</h1>
      </div>
      {postData.length > 0 ? (
        <div className="flex justify-center p-2">
          <table className="table-fixed bg-slate-950 rounded-md border-separate border-spacing-2 border-2 border-slate-900 text-white">
            <thead>
              <tr>
                <th className="bg-orange-500 rounded-sm text-black">Titulo</th>
                <th className="bg-orange-500 rounded-sm text-black">
                  Author ID
                </th>
                <th className="bg-orange-500 rounded-sm text-black">Author</th>
                <th className="bg-orange-500 rounded-sm text-black">
                  Correo author
                </th>
                <th className="bg-orange-500 rounded-sm text-black">
                  Fecha de creacion
                </th>
                <th className="bg-orange-500 rounded-sm text-black">Editar</th>
              </tr>
            </thead>
            <tbody className="font-normal">
              {postData.map((post, index) => (
                <tr key={index} className="font-thin">
                  <td>{post.title}</td>
                  <td>{post.author}</td>
                  <td>{post.authorData.username}</td>
                  <td>{post.authorData.email}</td>
                  <td>{new Date(post.date).toLocaleDateString()}</td>
                  <td>
                    <div className="flex align-middle justify-center space-x-2 ">
                      <Link
                        to={`/edit-post/${post._id}`}
                        className="rounded-md bg-green-700 p-1 text-black font-bold"
                      >
                        <FaRegEdit />
                      </Link>
                      <button
                        className="bg-red-800 rounded-sm p-1"
                        onClick={() => deleteAlert(post._id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <p>{mensaje}</p>
        </div>
      )}
    </div>
  );
}
