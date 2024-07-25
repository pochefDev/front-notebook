import { Link, useNavigate } from "react-router-dom";
import { IoLogoGithub, IoLogoInstagram } from "react-icons/io";
import { useFormik, FormikErrors } from "formik";
import { HiOutlineMail } from "react-icons/hi";
import { IoKeyOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import Swal from "sweetalert2";


interface FormValues {
  username: string;
  email: string;
  password: string;
}

// Función para verificar letras consecutivas en secuencia
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

  if (!values.username) {
    errors.username = "Ingresa un usuario";
  }

  if (!values.email) {
    errors.email = "Ingresa un correo";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Direccion no valida";
  }

  if (!values.password) {
    errors.password = "Ingresa una contraseña";
  } else {
    // Validación de longitud mínima
    if (values.password.length < 8) {
      errors.password = "Debe ser mínimo 8 caracteres";
    }
    // Validación de mayúscula
    if (!/[A-Z]/.test(values.password)) {
      errors.password = "Debe contener al menos una letra mayúscula";
    }
    // Validación de minúscula
    if (!/[a-z]/.test(values.password)) {
      errors.password = "Debe contener al menos una letra minúscula";
    }
    // Validación de carácter especial
    if (!/[^A-Za-z0-9]/.test(values.password)) {
      errors.password = "Debe contener al menos un carácter especial";
    }
    // Validación de números consecutivos
    if (/\d{2,}/.test(values.password)) {
      errors.password = "No se permiten números consecutivos";
    }
    if (/(.)\1/.test(values.password)) {
      errors.password = "No se permiten letras consecutivas";
    }
    // Validación de letras consecutivas en secuencia
    if (hasConsecutiveLetters(values.password)) {
      errors.password = "No se permiten letras consecutivas en secuencia";
    }
  }

  return errors;
};
export default function Signup() {
  const navigate = useNavigate();
  const formik = useFormik<FormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      const response = await fetch(
        "http://localhost:3000/api-notebook/register-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        alert("Hubo un error" + response.status);
      } else {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Usuario registrado",
          background: "#111827",
          color: "#fff",
          showConfirmButton: false,
          timer: 2000
        });
        
        navigate("/");
      }
    },
  });

  return (
    <>
      <div className="bg-gray-900 w-screen h-screen flex flex-col">
        <div className="flex justify-center content-center mt-5">
          <h1 className="text-white font-bold text-5xl">
            Crear un nuevo{" "}
            <span className="text-orange-500 italic">Usuario</span>
          </h1>
        </div>

        <div className="flex justify-center mb-10 mt-10">
          <form
            onSubmit={formik.handleSubmit}
            className="bg-slate-950 p-5 rounded flex flex-col space-y-4 min-w-md"
          >
            <b className="text-white text-center text-lg">Registrarme</b>

            <div className="flex flex-col space-x-2">
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

            <div className="flex flex-col space-x-2">
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

            <div className="flex flex-col space-x-2">
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
                <IoKeyOutline className="text-white"/>
              </div>
              <div className="pt-2 ">
                {formik.touched.password && formik.errors.password ? (
                  <b className="text-red-500">{formik.errors.password}</b>
                ) : null}
              </div>
            </div>
            <input
              type="submit"
              value="Guardar"
              className="bg-orange-500 cursor-pointer rounded p-2 font-semibold hover:bg-orange-700 hover:text-white"
            />
            <Link to="/" className="text-blue-400 text-sm text-right">
              Ya tengo una cuenta
            </Link>
          </form>
        </div>

        <footer className="fixed bottom-0 w-screen flex justify-center bg-slate-950 text-white">
          <div className="inline-flex items-center space-x-2">
            <p className="text-white p-2 ">Repo y redes sociales:</p>
            <IoLogoGithub /> <IoLogoInstagram />
          </div>
        </footer>
      </div>
    </>
  );
}
