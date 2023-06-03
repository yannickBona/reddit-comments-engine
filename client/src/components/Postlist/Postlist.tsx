import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletePost } from "../../api/Posts/deletePost";
import { MainContext } from "../../contexts/MainContext";
import { IMainContext } from "../../contexts/types";
import { IPost } from "../../types";
import Post from "../Post/Post";
import styled from "./styled";
import { useUser } from "../../hooks/useUser";

const Postlist: React.FC = () => {
  const { postList, setPosts } = useContext<IMainContext>(MainContext);
  const { setUser } = useUser();

  const handleDelete = async (id: string) => {
    // e.preventDefault();
    const response = await deletePost(id);
    if (response.status !== 200) return;

    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, postsUploaded: prevUser?.postsUploaded - 1 };
    });

    const newPosts = postList?.filter(
      (post) => post._id !== response.data.post._id
    );
    setPosts(newPosts);
  };

  // if (loading) return <h1>Loading...</h1>;
  // if (error) return <h1>Error!</h1>;

  return (
    <styled.Container>
      {postList && postList.length > 0 ? (
        postList.map((post: IPost) => (
          <Link key={post._id} className="post-card" to={`/post/${post._id}`}>
            <Post onDelete={handleDelete} isHomePage={true} {...post} />
          </Link>
        ))
      ) : (
        <div>No posts found!</div>
      )}
    </styled.Container>
  );
};

export default Postlist;
