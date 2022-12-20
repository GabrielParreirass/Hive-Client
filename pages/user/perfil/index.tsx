import axios from "axios";
import React from "react";
import Cookies from "js-cookie";
const API_URL = process.env.API_URL;
import styles from "../../../styles/Perfil.module.css";
import Image from "next/image";
import Link from "next/link";
import  Router  from "next/router";

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
  console.log(userData);

  const handleClickBin = (post: { id: string }) => {
    axios.delete(API_URL + "/deletePost", {
      data:{
        postId: post.id
      }
    }).then(res=>{
      Router.reload()
    });
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.welcome}>
        <h2>
          Esse é seu perfil, <span>{userData.userData.username}</span>
        </h2>
      </div>
      <div className={styles.postsContainer}>
        <h2>Seus posts:</h2>
        {userData.userData.posts.map(
          (post: { title: string; body: string; id: string }) => (
            <div className={styles.post}>
              <div className={styles.postHeader}>
                <h3>{post.title}</h3>
                <Image
                  src={"/bin.png"}
                  height="24"
                  width="24"
                  alt="perfil"
                  className={styles.bin}
                  onClick={() => handleClickBin(post)}
                ></Image>
              </div>
              <p>{post.body}</p>
            </div>
          )
        )}
      </div>

      <div className={styles.friendsContainer}>
        <h2>Você é amigo de {userData.userData.friends.length} pessoas</h2>
        <br />
        {userData.userData.friends.map(
          (friend: { id: string; username: string }) => (
            <h3>{friend.username}</h3>
          )
        )}
      </div>

      <Link href={"/user"}>
        <div className={styles.homeIcon}>
          <Image src={"/home.png"} height="32" width="32" alt="perfil"></Image>
        </div>
      </Link>
    </div>
  );
}

export default User;
