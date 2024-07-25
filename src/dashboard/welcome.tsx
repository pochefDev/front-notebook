// iconos
import { TbLogout2 } from "react-icons/tb";


// demás importaciones
import { useNavigate } from "react-router-dom";
import Dashboard from "../catalogo usuarios/dashboard";
import Menu from "./menu";


export default function Welcome() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api-notebook/close-sesion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        localStorage.clear();
        console.clear();
        navigate("/");
      } else {
        alert("no ha cerrado sesion");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-900 w-screen h-screen flex flex-col">
      <div className="flex justify-between items-center mt-4 p-2 m-5">
        <h1 className="text-white font-bold text-3xl">
          Inicio
          <span className="text-orange-500 italic"> Notebook</span>
        </h1>
        <button onClick={logout} className="bg-slate-950 text-white p-2 rounded-sm">
          <TbLogout2 />
        </button>
      </div>
      <Menu />

      <Dashboard />
    </div>
  );
}
