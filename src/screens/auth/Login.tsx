import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Space,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import handleAPI from "../../apis/handleAPI";
import { appInfo, localDataNames } from "../../constants/appInfo";
import { addAuth } from "../../redux/reducres/authReducer";
import { jwtDecode } from "jwt-decode";

const { Title, Paragraph, Text } = Typography;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      const res: any = await handleAPI("/Account/login", values, "post");
      if (res.data.value) {
        const accessToken = res.data.value.accessToken;

        const decoded: any = jwtDecode(accessToken);

        if (decoded.role === "Admin") {
          dispatch(addAuth({ ...res.data.value, role: decoded.role }));

          if (isRemember) {
            localStorage.setItem(
              localDataNames.jwt,
              JSON.stringify({ ...res.data.value, role: decoded.role })
            );
          }
          message.success("Login successfully.");
        } else {
          message.error(
            "You do not have permission to access this application."
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Card style={{ width: "23,76%" }}>
        <div className="text-center">
          <img
            className="mb-3 mx-auto"
            src={appInfo.logo}
            alt="kanban_logo"
            style={{ width: 48, height: 48 }}
          />
          <Title level={2}>Log in to your account</Title>
          <Paragraph type="secondary">
            Welcome back! Please enter your details.
          </Paragraph>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleLogin}
          disabled={isLoading}
          size="large"
        >
          <Form.Item
            name={"email"}
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
            ]}
          >
            <Input
              placeholder="Enter your email"
              allowClear
              maxLength={100}
              type="email"
            />
          </Form.Item>
          <Form.Item
            name={"password"}
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              maxLength={100}
              type="password"
            />
          </Form.Item>
        </Form>

        <div className="row">
          <div className="col">
            <Checkbox
              checked={isRemember}
              onChange={(val) => setIsRemember(val.target.checked)}
              style={{ whiteSpace: "nowrap", overflow: "hidden" }}
            >
              Remember for 30 days
            </Checkbox>
          </div>
          <div className="col text-right">
            <Link to={"/"}>Forgot password?</Link>
          </div>
        </div>

        <div className="mt-4">
          <Button
            onClick={() => form.submit()}
            type="primary"
            style={{ width: "100%" }}
            size="large"
            loading={isLoading}
          >
            Login
          </Button>
        </div>
        <div className="mt-4 text-center">
          <Space>
            <Text type="secondary">Don’t have an account?</Text>
            <Link to={"/sign-up"}> Sign up</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Login;
