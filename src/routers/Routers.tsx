import { useDispatch, useSelector } from "react-redux";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";
import { addAuth, authSeletor, AuthState } from "../redux/reducres/authReducer";
import { useEffect, useState } from "react";
import { localDataNames } from "../constants/appInfo";
import { Spin } from "antd";

const Routers = () => {
  const [isLoading, setIsLoading] = useState(false);

  const auth: AuthState = useSelector(authSeletor);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);

    try {
      const res = localStorage.getItem(localDataNames.jwt);
      if (res) {
        dispatch(addAuth(JSON.parse(res)));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Spin fullscreen />
  ) : !auth.accessToken && !auth.refreshToken ? (
    <AuthRouter />
  ) : (
    <MainRouter />
  );
};

export default Routers;
