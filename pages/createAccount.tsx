import axios from "axios";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import styles from "../styles/CreateAcc.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Router from "next/router";
const API_URL = process.env.API_URL;

function createAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password === passwordConfirm) {
      axios
        .post(API_URL + "/createUser", {
          username,
          email,
          password,
        })
        .then((res) => {
          console.log(res);

          if(res.data.create == false){
            toast.warn(res.data.message, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }else{
            
            toast.success(res.data.message, {
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

        });
    } else {
      toast.warn("Suas senhas não estão iguais!", {
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

    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setUsername("");
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
            Cire sua conta <span>HiVe</span>
          </h3>
          <div className={styles.wrapperInputs}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={4}
              maxLength={16}
            />
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              autoComplete="new-password"
              minLength={4}
              maxLength={16}
            />
          </div>
          <button className={styles.createAcc} type="submit">
            Criar conta HiVe
          </button>
          <hr />

          <Link href={"/"}>
            <button className={styles.loginButton} type="submit">
              Entrar em conta existente
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default createAccount;
