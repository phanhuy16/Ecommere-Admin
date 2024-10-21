import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Register } from "../screens";
import { Typography } from "antd";
import { colors } from "@/constants/color";

const { Title } = Typography;

const AuthRouter = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col d-none d-md-none d-lg-block">
          <div
            className="d-flex justify-content-center align-items-center flex-column"
            style={{ height: "100vh" }}
          >
            <div className="mb-4">
              <img
                style={{ width: 256, objectFit: "cover" }}
                src="https://firebasestorage.googleapis.com/v0/b/website-42fdb.appspot.com/o/kanban_logo.png?alt=media&token=ed10f4ad-7495-46a7-b226-219edc2de635"
                alt="kanban_logo"
              />
            </div>
            <div>
              <Title style={{ color: colors.primary500 }}>KANBAN</Title>
            </div>
          </div>
        </div>
        <div className="col content-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/sign-up" element={<Register />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
