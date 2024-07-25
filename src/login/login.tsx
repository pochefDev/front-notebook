import { useFormik, FormikErrors } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { IoLogoGithub, IoLogoInstagram } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import { IoKeyOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface FormValues {
  email: string;
  password: string;
}

const validate = (values: FormValues) => {
  const errors: FormikErrors<FormValues> = {};

  if (!values.email) {
    errors.email = "Ingresa tu correo";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Direccion no valida";
  }

  if (!values.password) {
    errors.password = "Ingresa tu contraseña";
  }

  return errors;
};

export default function Login() {
  const navigate = useNavigate();
  const [isComponentRendered, setIsComponentRendered] = useState(false);
  const [isOk, setIsOk] = useState(true);

  const aviso = () => {
    Swal.fire({
      title: "Aviso de privacidad",
      text: "Para acceder al sitio se necesitan algunos datos personales",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Acepto condiciones",
      cancelButtonText: "No acepto",
      background: "#111827",
      color: "#fff",
    }).then((result) => {
      if (result.isDismissed || result.isDenied) {
        setIsOk(false);
      } else if (result.isConfirmed) {
        setIsOk(true);
      }
    });
  };

  useEffect(() => {
    if (!isOk) {
      navigate("/closed-service");
    }
  });

  useEffect(()=>{
    setIsComponentRendered(true);
  })

  useEffect(() => {
    if (isComponentRendered) {
      aviso();
    }
  }, [isComponentRendered]);

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch(
          "http://localhost:3000/api-notebook/log-user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (!response.ok) {
          alert("Ocurrió un error en el login: " + response.status);
        } else {
          const data = await response.json();

          const token = data.token;

          localStorage.setItem(
            "userData",
            JSON.stringify({
              id: data.user._id,
              username: data.user.username,
              email: data.user.email,
            })
          );
          localStorage.setItem("accessToken", token);

          console.log("Login successful: " + JSON.stringify(data));

          navigate("/welcome"); // Usa navigate aquí para redirigir
        }
      } catch (error) {
        console.error("Error durante el login", error);
      } finally {
        setSubmitting(false); // Esto se utiliza para controlar el estado de envío del formulario
      }
    },
  });

  return (
    <>
      <div className="bg-gray-900 w-screen h-screen flex flex-col">
        <div className="flex justify-center content-center mt-5">
          <h1 className="text-white font-bold text-5xl">
            Bienvenido a
            <span className="text-orange-500 italic"> Notebook</span>
          </h1>
        </div>

        <div className="flex justify-center mb-10 mt-10">
          <form
            onSubmit={formik.handleSubmit}
            className="bg-slate-950 p-5 rounded flex flex-col space-y-5"
          >
            <b className="text-white text-center text-lg">
              Entrar con mi cuenta
            </b>
            <div className="flex flex-col space-x-2">
              <div className="flex items-center">
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="p-2 border-b-2 border-orange-500 bg-inherit flex-grow focus:outline-none text-white"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <HiOutlineMail className="text-white items-center" />
              </div>
              <div className="pt-2">
                {formik.touched.email && formik.errors.email ? (
                  <b className="text-red-500">{formik.errors.email}</b>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col space-x-2 ">
              <div className="flex items-center">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Contraseña"
                  className="p-2  border-b-2 border-orange-500 text-white bg-inherit flex-grow focus:outline-none"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <IoKeyOutline className="text-white" />
              </div>
              <div className="pt-2">
                {formik.touched.password && formik.errors.password ? (
                  <b className="text-red-500 flex items-center">
                    {formik.errors.password}
                  </b>
                ) : null}
              </div>
            </div>
            <input
              type="submit"
              value="Entrar"
              className="bg-orange-500 cursor-pointer rounded p-2 font-semibold hover:bg-orange-700 hover:text-white"
              disabled={formik.isSubmitting} // Desactiva el botón durante el envío del formulario
            />
            <Link to="/signup" className="text-blue-400 text-sm text-right">
              Registrarme
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
