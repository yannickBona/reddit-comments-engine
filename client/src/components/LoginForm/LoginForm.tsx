import React, { useContext, useState } from "react";
import styled from "./styled";
import { IAuthContext, TUser } from "../../contexts/types";
import { AuthContext } from "../../contexts/AuthContext";
import { useAsync, useAsyncFn } from "../../hooks/useAsync";
import { loginUser } from "../../api/User/loginUser";
import { createUser } from "../../api/User/createUser";
import { useNavigate } from "react-router-dom";

interface IFormData {
  username: string;
  password: string;
  isLogin: boolean;
  name?: string;
  lastName?: string;
}

const LoginForm: React.FC = () => {
  const { setUser } = useContext<IAuthContext>(AuthContext);
  const [formData, setFormData] = useState<IFormData>({
    username: "",
    password: "",
    isLogin: true,
  });
  const [error, setError] = useState("");
  const { execute: createUserFn } = useAsyncFn(createUser);
  const { execute: loginUserFn } = useAsyncFn(loginUser);

  const navigate = useNavigate();

  /**
   * Handles the login & sign up
   * @param e
   */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.isLogin) {
      const response = await loginUserFn(formData.username, formData.password);

      switch (response.status) {
        case 200:
          setUser(response.user);
          localStorage.setItem("token", response.user.token);

          setFormData({ username: "", password: "", isLogin: true });
          navigate("/");
          break;
        case 404:
          setError("User does not exist. Please sign up.");
          break;
        case 401:
          setError("Wrong credentials");
          break;

        default:
          setError("An error occurred");
          break;
      }
    } else {
      const response = await createUserFn(
        formData.name,
        formData.lastName,
        formData.username,
        formData.password
      );

      switch (response.status) {
        case 200:
          setFormData({ username: "", password: "", isLogin: true });
          navigate("/");
          break;
        case 400:
          setError(response.details);
          break;

        default:
          setError("An error occurred");
          break;
      }
    }
  };
  return (
    <styled.LoginForm onSubmit={handleLogin}>
      <h1>Chatly</h1>
      {!formData.isLogin && (
        <>
          <input
            onFocus={() => setError("")}
            onChange={(e) =>
              setFormData((prev) => {
                return {
                  ...prev,
                  name: e.target.value,
                };
              })
            }
            value={formData.name}
            placeholder="name"
          />
          <input
            onFocus={() => setError("")}
            onChange={(e) =>
              setFormData((prev) => {
                return {
                  ...prev,
                  lastName: e.target.value,
                };
              })
            }
            value={formData.lastName}
            placeholder="Last name"
          />
        </>
      )}
      <input
        onFocus={() => setError("")}
        onChange={(e) =>
          setFormData((prev) => {
            return {
              ...prev,
              username: e.target.value,
            };
          })
        }
        value={formData.username}
        placeholder="username"
      />
      <input
        onFocus={() => setError("")}
        placeholder="password"
        type="password"
        value={formData.password}
        onChange={(e) =>
          setFormData((prev) => {
            return { ...prev, password: e.target.value };
          })
        }
      />

      <a
        href="#"
        onClick={() => {
          setError("");
          setFormData((prev) => {
            return { ...prev, isLogin: !prev.isLogin };
          });
        }}
      >
        {formData.isLogin
          ? "Don't have an account? Sign Up "
          : "Go to the login"}
      </a>
      {error && <p>{error}</p>}
      <button disabled={!formData.password || !formData.username}>
        {formData.isLogin ? "Login " : "Sign Up"}
      </button>
    </styled.LoginForm>
  );
};

export default LoginForm;
