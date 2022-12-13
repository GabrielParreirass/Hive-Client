import { FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Router from "next/router";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
const API_URL = process.env.API_URL;

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(API_URL + "/login", {
        email: email,
        password: password,
      })
      .then(async (res) => {
        if (res.data == "") {
          toast.warn("Dados incorretos!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        const token = res.data.token;
        const send = await fetch("/api/login", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        });

        if (send.status == 200) {
          Router.push("/user");
        }
      });

    setEmail("");
    setPassword("");
  };

  return (
    <div className={styles.container}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.loginBox}>
          <h3>
            Entre no <span>HiVe</span>
          </h3>
          <div className={styles.wrapperInputs}>
            <input
              value={email}
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              value={password}
              type="password"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className={styles.loginButton} type="submit">
            Entrar
          </button>
          <hr />
          <Link href={"/createAccount"}>
            <button className={styles.createAcc}>Criar conta</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
