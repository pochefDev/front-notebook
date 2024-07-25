import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Menu from "../dashboard/menu";
import { FormikErrors, useFormik } from "formik";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
}
interface FormValues {
  id: string;
  username: string;
  email: string;
  password: string;
}

export default function Edit() {
  const [loading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const navigate = useNavigate();
  const getData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const authorId = userData.id;
      const response = await fetch(
        `http://localhost:3000/api-notebook/get-user/${authorId}`
      );

      if (!response.ok) {
        let errorMessage = "Error desconocido";
        if (response.status === 401) {
          errorMessage = "Parametros incompletos 'ID del usuario autenticado'";
        } else if (response.status === 404) {
          errorMessage = "Usuario no encontrado";
        } else if (response.status === 500) {
          errorMessage = "Error al recuperar la información";
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

      const info = await response.json();
      setUserData(info.userfound);
    } catch (error) {
      Swal.fire({
        title: "ERROR",
        text: "Ocurrio un erro al conectar con el servidor",
        icon: "error",
        color: "#fff",
        background: "#111827",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  const hasConsecutiveLetters = (password: string): boolean => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < password.length - 1; i++) {
      const grupo = password.substring(i, i + 2).toLowerCase();
      if (alphabet.includes(grupo)) {
        return true;
      }
    }

    return false;
  };

  const validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    if (
      values.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Direccion no valida";
    }

    if (values.password && values.password.length < 8) {
      errors.password = "Debe tener mínimo 8 caracteres";
    }
    if (values.password && !/[A-Z]/.test(values.password)) {
      errors.password = "Debe contener al menos una letra mayúscula";
    }
    if (values.password && !/[a-z]/.test(values.password)) {
      errors.password = "Debe contener al menos una letra minúscula";
    }
    if (values.password && !/[^A-Za-z0-9]/.test(values.password)) {
      errors.password = "Debe contener al menos un carácter especial";
    }
    if (values.password && /\d{2,}/.test(values.password)) {
      errors.password = "No se permiten números consecutivos";
    }
    if (values.password && /(.)\1/.test(values.password)) {
      errors.password = "No se permiten letras consecutivas";
    }
    if (values.password && hasConsecutiveLetters(values.password)) {
      errors.password = "No se permiten letras consecutivas en secuencia";
    }

    return errors;
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      id: userData?._id || "", 
      username: userData?.email || "",
      email: userData?.email || "",
      password: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const authorId = userData.id;
        const response = await fetch(
          `http://localhost:3000/api-notebook/edit-my-info/${authorId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": `${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(values),
          }
        );
        if (!response.ok) {
          let errorMessage = "Error desconocido";
          if (response.status === 400) {
            errorMessage =
              "Falta el parametro ID para ejecutar la accion de edicion";
          } else if (response.status === 403) {
            errorMessage = "Ya existe un usuario con ese correo";
          } else if (response.status === 404) {
            errorMessage = "Not found el usuario a editar no existe";
          }
          Swal.fire({
            title: "ERROR",
            text: errorMessage,
            icon: "error",
            color: "#fff",
            background: "#111827",
          });
          return;
        }
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Perfil actualizado",
          background: "#111827",
          color: "#fff",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/welcome");
      } catch (error) {
        Swal.fire({
          title: "ERROR",
          text: "Ocurrio un error inesperado",
          icon: "error",
          color: "#fff",
          background: "#111827",
        });
        setSubmitting(false)
      }
    },
  });

  if (loading) {
    return <div>Cargando información...</div>;
  }

  return (
    <div className="bg-gray-900 w-screen h-screen flex flex-col items-center justify-center">
      <div>
        <Menu />
      </div>
      <div className="flex justify-center mb-4">
        <h1 className="text-white font-semibold text-4xl">
          Formulario de edición
        </h1>
      </div>
      <div className="bg-slate-950 rounded-md flex justify-center p-5">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col p-5 space-y-2 text-white"
        >
          <label htmlFor="title" className="font-semibold">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder={userData?.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            className="bg-slate-900 text-sm focus:outline-none p-2 rounded"
          />
          <label htmlFor="description" className="font-semibold">
            email
          </label>
          <input
            name="email"
            id="email"
            placeholder={userData?.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="bg-slate-900 text-sm focus:outline-none p-2 rounded"
          />
          <div>
            {formik.touched.email && formik.errors.email ? (
              <b className="text-red-500">{formik.errors.email}</b>
            ) : null}
          </div>
          <label htmlFor="description" className="font-semibold">
            password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Escribe tu nueva contraseña"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="bg-slate-900 text-sm focus:outline-none p-2 rounded"
          />
          <div>
            {formik.touched.password && formik.errors.password ? (
              <b className="text-red-500">{formik.errors.password}</b>
            ) : null}
          </div>
          <input
            type="submit"
            value="Guardar"
            className="bg-orange-700 font-bold text-black p-2 rounded cursor-pointer hover:bg-orange-900 hover:text-white"
          />
        </form>
      </div>
    </div>
  );
}
