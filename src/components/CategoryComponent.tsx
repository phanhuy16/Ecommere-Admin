import handleAPI from "@/apis/handleAPI";
import { listColors } from "@/constants/color";
import { CategoryModel } from "@/models/Products";
import { message, Tag } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  id: string;
}

const CategoryComponent = (props: Props) => {
  const { id } = props;

  const [category, setCategory] = useState<CategoryModel>();

  useEffect(() => {
    getCategoryDetail();
  }, [id]);

  const getCategoryDetail = async () => {
    const api = `/Categories/get-by-id?id=${id}`;

    try {
      const res = await handleAPI(api);
      if (res.data) {
        setCategory(res.data);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <Link to={`/Categories/get-by-id/${category?.slug}?id=${id}`}>
      <Tag color={listColors[Math.floor(Math.random() * listColors.length)]}>
        {category?.title}
      </Tag>
    </Link>
  );
};

export default CategoryComponent;
