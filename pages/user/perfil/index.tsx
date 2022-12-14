import axios from "axios";
import React from "react";
import Cookies from "js-cookie";
const API_URL = process.env.API_URL;
import styles from "../../../styles/UserHome.module.css";
import Image from "next/image";
import Link from "next/link";

export async function getServerSideProps({ req, res }: any) {
  const response = await fetch(API_URL + "/getUserData", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: req.cookies.authJWT }),
  });

  const data = await response.text().then((res) => {
    return JSON.parse(res);
  });

  return { props: { userData: data } };
}

function User({ userData }: any) {

  console.log(userData)

  return (
    <div className={styles.MainContainer}>
      <div className={styles.welcome}>
        <div>
          <h2>
            Esse é seu perfil, <span>{userData.userData.username}</span>
          </h2>
        </div>
      </div>
        <div>
          <h2>Seus posts:</h2>
          {userData.userData.posts.map((post: {
            title: string,
            body: string
          }) => (
            <div>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))}
        </div>

      <div style={{marginTop:'2em'}}>
        <h2>Você é amigo de:</h2>
        <br />
        {userData.userData.friends.map((friend:{
          id: string,
          username: string
        })=>(
          <h3>{friend.username}</h3>
        ))}
      </div>

      <Link href={"/user"}>
        <div className={styles.perfilIcon}>
          <Image src={"/home.png"} height="32" width="32" alt="perfil"></Image>
        </div>
      </Link>
    </div>
  );
}

export default User;
