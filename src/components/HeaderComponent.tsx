import { colors } from "@/constants/color";
import { removeAuth } from "@/redux/reducres/authReducer";
import { Avatar, Button, Dropdown, Input, MenuProps } from "antd";
import { BsSearch } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: async () => {
        dispatch(removeAuth({}));
        navigate("/");
      },
    },
  ];
  return (
    <div className="p-3 d-flex bg-white">
      <div className="col">
        <Input
          placeholder="Search product, supplier, order"
          style={{
            borderRadius: 100,
            width: "50%",
          }}
          size="large"
          prefix={<BsSearch className="text-muted" size={20} />}
        />
      </div>
      <div className="col d-flex align-items-center justify-content-end">
        <Button
          style={{ marginRight: "16px" }}
          type="text"
          icon={<IoIosNotificationsOutline size={22} color={colors.gray600} />}
        />
        <Dropdown menu={{ items }}>
          <Avatar
            src={
              "https://firebasestorage.googleapis.com/v0/b/website-42fdb.appspot.com/o/Avatar.png?alt=media&token=649daf49-6793-45cb-9bef-642df0d5cbbf"
            }
            size={40}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default HeaderComponent;
