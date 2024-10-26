import { appInfo } from "@/constants/appInfo";
import { colors } from "@/constants/color";
import { Layout, Menu, MenuProps, Typography } from "antd";
import { Box, PercentageSquare } from "iconsax-react";
import { FaTags } from "react-icons/fa";
import { GiChart } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { HiOutlineHome, HiOutlineUserCircle } from "react-icons/hi2";
import { MdOutlineInventory } from "react-icons/md";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const { Sider } = Layout;
const { Text } = Typography;

const SiderComponent = () => {
  const items: MenuItem[] = [
    {
      key: "dashboard",
      label: <Link to={"/"}>Dashboard</Link>,
      icon: <HiOutlineHome size={18} />,
    },
    {
      key: "inventory",
      label: "Inventory",
      icon: <MdOutlineInventory size={18} />,
      children: [
        {
          key: "inventory",
          label: <Link to={"/inventory"}>All</Link>,
        },
        {
          key: "addNew",
          label: <Link to={`/inventory/add-product`}>Add new</Link>,
        },
      ],
    },
    {
      key: "categories",
      label: <Link to={"/categories"}>Categories</Link>,
      icon: <FaTags size={18} className="text-muted" />,
    },
    {
      key: "report",
      label: <Link to={"/report"}>Reports</Link>,
      icon: <GiChart size={18} />,
    },
    {
      key: "supplier",
      label: <Link to={"/suppliers"}>Suppliers</Link>,
      icon: <HiOutlineUserCircle size={18} />,
    },
    {
      key: "orders",
      label: <Link to={"/orders"}>Orders</Link>,
      icon: <Box size={18} />,
    },
    {
      key: "manage store",
      label: <Link to={"/manage-store"}>Manage Store</Link>,
      icon: <GoChecklist size={18} />,
    },
    {
      key: "promotion",
      label: <Link to={"/promotion"}>Promotion</Link>,
      icon: <PercentageSquare size={18} />,
    },
  ];

  return (
    <Sider
      theme="light"
      style={{
        height: "100vh",
      }}
    >
      <div className="m-3 d-flex align-items-center">
        <img src={appInfo.logo} alt={appInfo.title} width={48} />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginLeft: "10px",
            color: colors.primary500,
          }}
        >
          {appInfo.title}
        </Text>
      </div>
      <Menu mode="inline" items={items} theme="light" />
    </Sider>
  );
};

export default SiderComponent;
