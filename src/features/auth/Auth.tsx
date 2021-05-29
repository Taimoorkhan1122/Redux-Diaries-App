import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { User } from "../../interfaces/user.interface";
import http from "../../services/api";
import { saveToken, setAuthState } from "./authSlice";
import { setUser } from "./userSlice";
import { AuthResponse } from "../../services/miraj/routes/user";
import { useStoreDispatch } from "../../store";

const schema = Yup.object().shape({
  username: Yup.string()
    .required("What? no username?")
    .max(16, "username cnannot be longer than 16 characters"),
  password: Yup.string().required('Without a password, "None shall pass!"'),
  email: Yup.string()
    .required()
    .email("Please provide a valid email address (abc@email.com)"),
});

const Auth: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(schema),
  });
  const [isLogin, setLogin] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useStoreDispatch();

  const submitForm = (data: User) => {
    const path = isLogin ? "/auth/login" : "/auth/signup";
    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;
          dispatch(saveToken(token));
          dispatch(setUser(user));
          dispatch(setAuthState(true));
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="auth">
      <div className="card">
        <form onSubmit={handleSubmit(submitForm)}>
          {/* USERNAME CONTAINER */}
          <div className="inputWrapper">
            <input {...register("username")} placeholder="Username" />
            {errors && errors.username?.message && (
              <p className="error">{errors.username?.message}</p>
            )}
          </div>

          {/* PASSWORD CONTAINER */}
          <div className="inputWrapper">
            <input
              {...register("password")}
              placeholder="Password"
              type="password"
            />
            {errors && errors.password?.message && (
              <p className="error">{errors.password?.message}</p>
            )}
          </div>

          {/* EMAIL CONTAINER */}
          {!isLogin && (
            <div className="inputWrapper">
              <input {...register("email")} placeholder="Email (optional)" />
              {errors && errors.email?.message && (
                <p className="error">{errors.email?.message}</p>
              )}
            </div>
          )}

          {/* BUTTON CONTAINER */}
          <div className="inputWrapper">
            <button type="submit" disabled={isLoading}>
              {isLogin ? "Login" : "Create Account"}
            </button>
          </div>

          <p
            onClick={() => setLogin(!isLogin)}
            style={{ cursor: "pointer", opacity: 0.7 }}>
            {isLogin ? "No account? Create one" : "Already have an account?"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
