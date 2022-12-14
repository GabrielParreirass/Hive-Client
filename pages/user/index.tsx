
import React from "react";

import Link from "next/link";
const API_URL = process.env.API_URL;
import styles from "../../styles/UserHome.module.css";
import Image from "next/image";
import Router from "next/router";

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

  return { props: { data: data } };
}

function User({ data }: any) {
  const handleClickPost = (post:any) => {
    Router.push(`/user/perfil/${post.authorId}`)
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.welcome}>
        <h2>
          Seja bem vindo ao HiVe, <span>{data.userData.username}</span>
        </h2>
      </div>

      <div className={styles.postsContainer}>
        <h2>Posts mais recentes🔥</h2>
        {data.allUserData.map((user: any) =>
          user.posts.map((post: any) => (
            <div className={styles.post} onClick={() => handleClickPost(post)}>
              <div className={styles.postHeader}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <h2 className={styles.postAuthor}> {user.username}</h2>
              </div>

              <p className={styles.postBody}>{post.body}</p>
            </div>
          ))
        )}
      </div>

      <Link href={"/user/perfil"}>
        <div className={styles.perfilIcon}>
          <Image
            src={"/perfil.png"}
            height="32"
            width="32"
            alt="perfil"
          ></Image>
        </div>
      </Link>
    </div>
  );
}

export default User;
