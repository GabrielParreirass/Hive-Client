import React, {
  Component,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
const API_URL = process.env.API_URL;
import styles from "../../styles/UserHome.module.css";
import Image from "next/image";
import Router from "next/router";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

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
  useEffect(() => {
    let modal: any = document.getElementById("modal");
    modal.style.display = "none";
  }, []);

  

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleClickPost = (post: {authorId:string}) => {
    Router.push(`/user/perfil/${post.authorId}`);
  };

  const handleCallModal = () => {
    let modal: any = document.getElementById("modal");

    modal.style.display = "flex";
  };

  const handleCloseModal = () => {
    let modal: any = document.getElementById("modal");
    modal.style.display = "none";
  };

  const handleModalSubmit = (e: FormEvent) => {
    e.preventDefault();

    axios
      .post(API_URL + "/createPost", {
        title: title,
        body: body,
        authorId: data.userData.id,
      })
      .then((res) => {
        console.log(res);
        if (res) {
          toast.success("Post criado com sucesso!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          Router.push("/user");
        }
      });
  };


  const handleSendComment = (
    postId: string,
    authorId: string,
    authorUsername: string
  ) => {
    let input: any = document.getElementById(`input-comment-${postId}`);
    axios.patch(API_URL + "/sendComment", {
      comment: input.value,
      postId: postId,
      authorId: authorId,
      authorUsername: authorUsername,
    }).then(res => {
      console.log(res)
    });

    Router.push("/user");
    input.value = "";
  };

  const handleClickCommentAuthor = (comment:{authorId:string}) =>{
    Router.push(`/user/perfil/${comment.authorId}`);
  }

  return (
    <>
      <div className={styles.MainContainer}>
        <div className={styles.welcome}>
          <h2>
            Seja bem vindo ao HiVe, <span>{data.userData.username}</span>
          </h2>
        </div>

        <div className={styles.newPostButton}>
          <button onClick={() => handleCallModal()}>Faça um novo post</button>
        </div>

        <div className={styles.containerNewPost} id="modal">
          <div className={styles.closeBtn} onClick={() => handleCloseModal()}>
            X
          </div>

          <form onSubmit={(e) => handleModalSubmit(e)}>
            <h2>Conta Pra Gente</h2>
            <label>Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Texto</label>
            <textarea
              name=""
              id=""
              cols={30}
              rows={10}
              spellCheck={true}
              maxLength={280}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>

            <button type="submit" className={styles.buttonPublish}>
              Publicar
            </button>
          </form>
        </div>

        <div className={styles.postsContainer}>
          <h2>Posts mais recentes🔥</h2>
          {data.allUserData.map((user: any) =>
            user.posts.reverse().map((post: any) => (
              <div className={styles.post}>
                <div className={styles.postHeader}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <h2
                    className={styles.postAuthor}
                    onClick={() => handleClickPost(post)}
                  >
                    {data.userData.id == user.id ? (
                      <div >{user.username} (Você)</div>
                    ) : (
                      <div >{user.username}</div>
                    )}
                  </h2>
                </div>

                <p className={styles.postBody}>{post.body}</p>
                <div className={styles.bottomPost}>
                  <div
                    className={styles.comments}
                  >
                    <Image
                      src={"/comment.png"}
                      height="24"
                      width="24"
                      alt="comments"
                    ></Image>
                  </div>
                  <div className={styles.likes}>
                    <Image
                      src={"/like.png"}
                      height="24"
                      width="24"
                      alt="like"
                    ></Image>
                  </div>
                </div>
                <div className={styles.commentsContainer}>
                  <div>
                    {data.comments.map((comment: any) => (
                      <div>
                        {post.id == comment.postId ? (
                          <div className={styles.comment}>
                            {" "}
                            {data.userData.id == comment.authorId ? (
                              <p className={styles.commentAuthor} onClick={()=>{handleClickCommentAuthor(comment)}}>
                                {comment.authorUsername} (Você):{" "}
                              </p>
                            ) : (
                              <p className={styles.commentAuthor} onClick={()=>{handleClickCommentAuthor(comment)}}>
                                {comment.authorUsername}:{" "}
                              </p>
                            )}
                            {comment.comment}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    ))}
                    <div className={styles.wrapperInpComment}>
                      <input
                        type="text"
                        className={styles.inputComment}
                        placeholder="Deixe um comentário..."
                        id={`input-comment-${post.id}`}
                      />
                      <button
                        className={styles.buttonSendComment}
                        onClick={() =>
                          handleSendComment(
                            post.id,
                            data.userData.id,
                            data.userData.username
                          )
                        }
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
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
    </>
  );
}

export default User;
