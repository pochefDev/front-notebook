import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import EditForm from "./editForm";

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
}

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [info, setInfo] = useState<User | null>(null);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api-notebook/get-user/${id}`
        );

        if (!response.ok) {
          alert(`Error ${response.status}`);
        }

        const loadUserData = await response.json();
        setInfo(loadUserData.userfound);
      } catch (error) {
        alert(
          "error al consultar http://localhost:3000/api-notebook/get-user/"
        );
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [id]);

  if (loading) {
    return <div>Cargando información...</div>;
  }

  return (
    <div className="bg-gray-900 w-screen h-screen p-5">
      {/* mostrar informacion pasada del usuario */}
      <h1 className="p-5 flex justify-center text-5xl font-bold text-slate-500">
        Formulario de edicion
      </h1>

      <div className="grid grid-cols-2 place-items-center">
        <div className="border border-white p-4 text-white space-y-5">
          <p>{info?._id}</p>
          <p className="text-3xl">Username:</p>
          <span className="text-orange-600 text-xl font-bold">
            {info?.username}
          </span>
          <p>
            Email: <span className="font-bold">{info?.email}</span>
          </p>
          <p>
            Password: <span className="font-bold">xxxxxxxxx...</span>
          </p>
        </div>

        {/* formulario para editar */}
        <div>
          {info && <EditForm user={info} />}
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          to="/welcome"
          className="bg-neutral-950 p-1 rounded-md font-semibold text-white hover:bg-neutral-700"
        >
          Regresar
        </Link>
      </div>
    </div>
  );
}
