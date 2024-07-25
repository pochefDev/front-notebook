import { useFormik, FormikErrors } from "formik";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { IoKeyOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

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

export default function EditForm({ user }: { user: User }) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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
      id: user._id,
      username: user.username || "",
      email: user.email || "",
      password: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api-notebook/edit-user/${id}`,
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

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Usuario actualizado",
          background: "#111827",
          color: "#fff",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/welcome");
      } catch (error: any) {
        alert("Error: " + error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className="bg-slate-950 p-5 rounded flex flex-col space-y-5 w-full max-w-xs max-h-md"
      >
        <b className="text-white text-center text-lg">Editar</b>

        <div className="flex flex-col">
          <div className="flex items-center">
            <input
              type="text"
              name="username"
              id="username"
              placeholder="username"
              className="p-2 border-b-2 border-orange-500 text-white bg-inherit focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            <FaRegUser className="text-white" />
          </div>
          <div className="pt-2">
            {formik.touched.username && formik.errors.username ? (
              <b className="text-red-500">{formik.errors.username}</b>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <div className="flex items-center">
            <input
              type="text"
              name="email"
              id="email"
              placeholder="email"
              className="p-2 border-b-2 border-orange-500 text-white bg-inherit focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            <HiOutlineMail className="text-white" />
          </div>
          <div className="pt-2">
            {formik.touched.email && formik.errors.email ? (
              <b className="text-red-500">{formik.errors.email}</b>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col space-y-1">
          <div className="flex items-center">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="contraseña"
              className="p-2 border-b-2 border-orange-500 text-white bg-inherit focus:outline-none"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <IoKeyOutline className="text-white" />
          </div>
          <div className="pt-2">
            {formik.touched.password && formik.errors.password ? (
              <b className="text-red-500 text-sm">{formik.errors.password}</b>
            ) : null}
          </div>
        </div>
        <input
          type="submit"
          value="Guardar"
          className="bg-orange-500 cursor-pointer rounded p-2 font-semibold hover:bg-orange-700 hover:text-white"
          disabled={formik.isSubmitting}
        />
      </form>
    </div>
  );
}
