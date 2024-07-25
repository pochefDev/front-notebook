import { useEffect, useState } from "react";
import Menu from "../dashboard/menu";

interface PostsData {
  title: string;
  description: string;
  date: Date;
  authorData: {
    username: string;
  };
}

export default function Search() {
  const [postData, setPostData] = useState<PostsData[]>([]);
  const [title, setTitle] = useState("");
  const [mensaje, setMensaje] = useState<string>("");

  function handleChange(value: string) {
    setTitle(value);
  }

  const getService = async (searchTitle: string) => {
    if (searchTitle.trim() === "") {
      setMensaje("Escribe para buscar un post");
      setPostData([]); // Limpiar los datos anteriores
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api-notebook/find-by-title/${searchTitle}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          setMensaje("No se han encontrado coincidencias");
          setPostData([]); // Limpiar los datos anteriores
        } else {
          setMensaje(
            "Ups, ocurrió un error al enlazar con el webservice BUSQUEDA"
          );
          setPostData([]); // Limpiar los datos anteriores
        }
        return;
      }
      const data = await response.json();
      if (data.posts && data.posts.length > 0) {
        setPostData(data.posts);
        setMensaje(""); // Limpiar el mensaje
      } else {
        setPostData([]);
        setMensaje("No se han encontrado coincidencias");
      }
    } catch (error) {
      setMensaje("Ups, ocurrió un error al enlazar con el webservice BUSQUEDA");
      setPostData([]); // Limpiar los datos anteriores
    }
  };

  useEffect(() => {
    getService(title);
  }, [title]);

  return (
    <div className="bg-gray-900 h-screen overflow-y-scroll scrollbar-hidden">
      <div className="pt-5">
        <Menu />
      </div>
      <div className="flex justify-center">
        <input
          type="text"
          className="bg-gray-800 p-2 m-2 text-white focus:outline-none"
          placeholder="Buscar un post"
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <div className="p-5">
        {postData.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {postData.map((post, index) => (
              <div
                key={index}
                className="bg-gray-950 rounded-md p-2 text-white space-y-1"
              >
                <h2 className="text-3xl font-bold text-orange-600">
                  {post.title}
                </h2>
                <p className="font-thin text-sm">{post.description}</p>
                <p className="font-semibold text-base">
                  Author: {post.authorData.username}
                </p>
                <p className="font-extralight">
                  Date: {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <p className="text-3xl text-white font-semibold text-center">
              {mensaje}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
