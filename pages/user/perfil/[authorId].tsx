import React from "react";
const API_URL = process.env.API_URL;
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import styles from "../../../styles/ThirdPerfil.module.css";

export async function getStaticPaths() {
  const res = await fetch(API_URL + `/getUsers`);

  const data = await res.json();

  const paths = data.users.map((user: any) => {
    return {
      params: {
        authorId: `${user._id}`,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context: any) {
  const { params } = context;

  const res = await fetch(API_URL + `/getUser/${params.authorId}`);

  const data = await res.json();

  console.log(res.status);

  return {
    props: {
      data: data.message,
    },
  };
}

function perfil({ data }: any) {
  console.log(data);

  if (!data) {
    return <div>Carregando Informações...</div>;
  }

  if (data == "Usuario não encontrado!") {
    return (
      <div>
        <div>{data}</div>
        <div>{}</div>
      </div>
    );
  }

  const posts = data.posts;

  return (
    <div className={styles.MainContainer}>
      <div>
        <div className={styles.username}><h3>Usuário: {data.username}</h3></div>
        <div className={styles.friends}><h3>Amigos: {data.friends.length}</h3></div>
        <div className={styles.posts}><h3>Posts: {data.posts.length}</h3></div>
        <div className={styles.listPosts} id="list_posts">
          {posts.map((post: any) => (
            <div className={styles.post}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      </div>

      <Link href={"/user"}>
        <div className={styles.homeButton}>
          <Image src={"/home.png"} height="32" width="32" alt="perfil"></Image>
        </div>
      </Link>
    </div>
  );
}

export default perfil;
