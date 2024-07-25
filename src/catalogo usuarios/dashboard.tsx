// iconos
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

// demás importaciones (librerias externas y funcionalidades de react)
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api-notebook/users"
        );
        if (!response) {
          alert(
            "No se ha conectado con la api correctamente http://localhost:3000/api-notebook/users"
          );
        }
        const data = await response.json();

        // obtengo usuario autenticado desde localStorage y se parsea a un objeto JS
        const userData = localStorage.getItem("userData");
        const usuarioActual = userData ? JSON.parse(userData) : null; // se valida que no sea nulo

        // filtro lista de usuarios sin el autentificado
        const filteredUsers = data.usuarios.filter(
          (usuario: User) => usuario.email !== usuarioActual.email
        );

        setUsers(filteredUsers);
      } catch (error) {
        alert("ERROR FATAL");
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, []);

  if (loading) {
    return <div>Cargando al información...</div>;
  }

  const eliminar = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api-notebook/delete-user/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = "Error desconocido";
        if (response.status === 401) {
          errorMessage = "Token no válido o permisos insuficientes";
        } else if (response.status === 403) {
          errorMessage = "No tienes permisos para realizar esta acción";
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

      setUsers((filtrar) => filtrar.filter((user) => user._id !== id));
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
        text: "Hubo un problema al intentar eliminar el usuario",
        icon: "error",
        color: "#fff",
        background: "#111827",
      });
    }
  };

  const eliminarAlert = (id: string) => {
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
    <div className="flex justify-center">
      <table className="table-fixed bg-slate-950 rounded-md pr-2 pl-2 border-separate border-spacing-2 border-2 border-slate-900">
        <thead>
          <tr>
            <th className="bg-orange-500 rounded-t-md">User ID</th>
            <th className="bg-orange-500 rounded-t-md">Username</th>
            <th className="bg-orange-500 rounded-t-md">Email</th>
            <th className="bg-orange-500 rounded-t-md">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {users.map((user) => (
            <tr key={user._id} className="p-6">
              <td className="">{user._id}</td>
              <td className="">{user.username}</td>
              <td className="">{user.email}</td>
              <td className="">
                <div className="flex align-middle justify-center space-x-2 ">
                  <Link
                    to={`/edit-user/${user._id}`}
                    className="rounded-md bg-green-700 p-1 text-black font-bold"
                  >
                    <FaRegEdit />
                  </Link>
                  <button
                    className="bg-red-800 rounded-sm p-1"
                    onClick={() => eliminarAlert(user._id)}
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
  );
}
