import React, { useContext, useEffect, useState } from "react";
import { IAuthContext, IPostListContext } from "../../contexts/types";
import { AuthContext } from "../../contexts/AuthContext";
import styled from "./styled";
import { AiOutlineUser } from "react-icons/ai";
import { PostListContext } from "../../contexts/PostListContext";
import { IPost } from "../../types";
import { Link } from "react-router-dom";
import Post from "../../components/Post/Post";
import { deletePost } from "../../api/Posts/deletePost";
import LogoutButton from "../../components/LogoutButton/LogoutButton";

const Profile = () => {
  const { user } = useContext<IAuthContext>(AuthContext);
  const { postList } = useContext<IPostListContext>(PostListContext);
  const [ownerPosts, setOwnerPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const ownerPosts = postList?.filter((post) => post.owner === user.username);
    setOwnerPosts(ownerPosts ?? []);
  }, []);

  const handleDelete = async (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    const response = await deletePost(id);
    if (response.status !== 200) return;

    const newPosts = ownerPosts?.filter(
      (post) => post._id !== response.data.post._id
    );
    setOwnerPosts(newPosts);
  };

  return (
    <styled.Container>
      <h1>Profile Overview | {user.username}</h1>
      <div className="profile-info">
        <span className="avatar">
          <AiOutlineUser />
        </span>
        <h2>@{user.username}</h2>
        <section className="profile-details">
          <h3>
            <span>0</span>
            <br />
            Posts
          </h3>
          <h3>
            <span>0</span> <br />
            Followers
          </h3>
          <h3>
            <span>0</span>
            <br />
            Followed
          </h3>
        </section>
        <section className="profile-actions">
          <button>Modify Profile</button>
          <Link to="/explore">Add friends</Link>
        </section>
      </div>

      <h3>Your posts</h3>
      <div className="post-list">
        {ownerPosts.map((post) => (
          <Link to={`/post/${post._id}`} key={post._id}>
            <Post {...post} onDelete={(e) => handleDelete(e, post._id)} />
          </Link>
        ))}
      </div>
      <LogoutButton />
    </styled.Container>
  );
};

export default Profile;
