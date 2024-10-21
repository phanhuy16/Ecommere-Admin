import { Button, Card, Form, Input, message, Space, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import SocialLogin from "./components/SocialLogin";
import handleAPI from "../../apis/handleAPI";
import { useDispatch } from "react-redux";
import { addAuth } from "../../redux/reducres/authReducer";

const { Title, Paragraph, Text } = Typography;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const handleLogin = async (values: {
    email: string;
    fullName: string;
    password: string;
  }) => {
    const api = "/Account/register";
    setIsLoading(true);

    try {
      const res: any = await handleAPI(api, values, "post");
      if (res && res.statusCode <= 300) {
        dispatch(addAuth(res.value));
        message.success(res.value.message);
      } else {
        message.error(res.value.message);
      }
      console.log(res);
    } catch (error: any) {
      console.log(error.message);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Card style={{ width: "365px" }}>
        <div className="text-center">
          <img
            className="mb-3 mx-auto"
            src="https://firebasestorage.googleapis.com/v0/b/website-42fdb.appspot.com/o/kanban_logo.png?alt=media&token=ed10f4ad-7495-46a7-b226-219edc2de635"
            alt="kanban_logo"
            style={{ width: 48, height: 48 }}
          />
          <Title level={2}>Create an account</Title>
          <Paragraph type="secondary">Start your 30-day free trial.</Paragraph>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleLogin}
          disabled={isLoading}
          size="large"
        >
          <Form.Item
            name={"fullName"}
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter your name!",
              },
            ]}
          >
            <Input placeholder="Enter your name" allowClear type="name" />
          </Form.Item>
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
              () => ({
                validator: (_, value) => {
                  if (value.length < 6) {
                    return Promise.reject(
                      new Error("Password must have at least six characters")
                    );
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Create a password"
              maxLength={100}
              type="password"
            />
          </Form.Item>
        </Form>

        <div className="mt-4">
          <Button
            loading={isLoading}
            onClick={() => form.submit()}
            type="primary"
            style={{ width: "100%" }}
            size="large"
          >
            Sign up
          </Button>
        </div>
        <SocialLogin />
        <div className="mt-4 text-center">
          <Space>
            <Text type="secondary">Already have an account?</Text>
            <Link to={"/"}> Log in</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Register;
