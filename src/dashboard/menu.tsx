// iconos

import { IoHomeOutline } from "react-icons/io5"; // para home // dashboard
import { FaRegUser } from "react-icons/fa"; // para editar la informacion del usuario autenticado
import { FaTableColumns } from "react-icons/fa6"; // para la tabla maestro-detalle
import { MdOutlinePostAdd } from "react-icons/md"; // para los posts
import { TiWeatherPartlySunny } from "react-icons/ti"; //  web service CLIMA de openweather
import { IoSearchSharp } from "react-icons/io5"; // web service BUSQUEDA
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center p-3">
        <div className="flex text-white space-x-7 p-2 bg-slate-950 rounded-md">
          <IoHomeOutline
            className="hover:cursor-pointer hover:text-orange-500"
            onClick={() => {
              navigate("/welcome");
            }}
          />
          <IoSearchSharp
            className="hover:cursor-pointer hover:text-orange-500"
            onClick={() => {
              navigate("/search");
            }}
          />
          <FaRegUser
            className="hover:cursor-pointer hover:text-orange-500"
            onClick={() => {
              navigate("/edit-my-profile");
            }}
          />
          <FaTableColumns
            className="hover:cursor-pointer hover:text-orange-500"
            onClick={() => {
              navigate("/tabla-posts");
            }}
          />
          <MdOutlinePostAdd
            className="hover:cursor-pointer hover:text-orange-500"
            onClick={() => {
              navigate("/post-a-post");
            }}
          />
          <TiWeatherPartlySunny
            className="hover:cursor-pointer hover:text-orange-500"
            onClick={() => {
              navigate("/weather-service");
            }}
          />
        </div>
      </div>
    </>
  );
}
