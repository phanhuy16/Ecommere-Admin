import handleAPI from "@/apis/handleAPI";
import { AddCategory } from "@/components";
import { colors } from "@/constants/color";
import { TreeModel } from "@/models/FormModel";
import { CategoryModel } from "@/models/Products";
import { getTreeValues } from "@/utils/getTreeValues";
import { replaceName } from "@/utils/replaceName";
import {
  Button,
  Card,
  message,
  Modal,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CatDemoProp {
  title: string;
  description: string;
  parentId: string;
  slug: string;
}

const { confirm } = Modal;

const Categories = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [treeValues, setTreeValues] = useState<TreeModel[]>([]);
  const [categorySelected, setCategorySelected] = useState<CategoryModel>();

  useEffect(() => {
    getAllCategories();
    getCategories(`/Categories/get-pagination`, true);
  }, []);

  useEffect(() => {
    getAllCategories();
    const api = `/Categories/get-pagination?PageNumber=${page}&PageSize=${pageSize}`;
    getCategories(api);
  }, [page, pageSize]);

  const getCategories = async (api: string, isSelect?: boolean) => {
    setIsLoading(true);

    try {
      const res: any = await handleAPI(api);

      setCategories(getTreeValues(res.value.data, false));

      if (isSelect) {
        setTreeValues(getTreeValues(res.value.data, true));
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCategories = async () => {
    setIsLoading(true);

    try {
      const res: any = await handleAPI(`/Categories/get-all`);
      setCategories(getTreeValues(res, false));
      setTreeValues(getTreeValues(res, true));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    const api = `/Categories/delete/${id}`;

    try {
      await handleAPI(api, undefined, "delete");

      setCategories((categories: any) =>
        categories.filter((element: CategoryModel) => element.id !== id)
      );
      await getCategories(
        `/Categories/get-pagination?PageNumber=${page}&PageSize=${pageSize}`
      );
      message.success("Delete success!!!");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns: ColumnProps<CategoryModel>[] = [
    {
      key: "title",
      title: "Name",
      dataIndex: "",
      render: (item: CategoryModel) => (
        <Link to={`/Categories/detail/${item.slug}?id=${item.id}`}>
          {item.title}
        </Link>
      ),
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "btnContainer",
      title: "Actions",
      dataIndex: "",
      render: (item: any) => (
        <Space>
          <Tooltip title="Edit category" key={"btnEdit"}>
            <Button
              onClick={() => setCategorySelected(item)}
              icon={
                <Edit2 variant="Bold" size={20} color={colors.primary500} />
              }
              type="text"
            />
          </Tooltip>
          <Tooltip title="Delete category" key={"btnDelete"}>
            <Button
              onClick={() =>
                confirm({
                  title: "Confirm",
                  content: "What are you sure you want to remove this item ?",
                  onOk: async () => {
                    handleRemove(item.id);
                  },
                })
              }
              icon={<Trash variant="Bold" size={20} className="text-danger" />}
              type="text"
            />
          </Tooltip>
        </Space>
      ),
      align: "right",
    },
  ];

  const demoCategories = [
    {
      key: "men",
      title: "Men",
      child: [
        "T-Shirts",
        "Casual Shirts",
        "Formal Shirts",
        "Jackets",
        "Blazers & Coats",
      ],
    },
    {
      key: "Women",
      title: "Women",
      child: [
        "Kurtas & Suits",
        "Sarees",
        "Ethnic Wear",
        "Lehenga Cholis",
        "Jackets",
      ],
    },
    {
      key: "Footwear",
      title: "Footwear",
      child: [
        "Flats",
        "Casual Shoes",
        "Heels",
        "Boots",
        "Sports Shoes & Floaters",
      ],
    },
    {
      key: "Kids",
      title: "Kids",
      child: [
        "T-Shirts",
        "Shirts",
        "Jeans",
        "Trousers",
        "Party Wear",
        "Innerwear & Thermal",
        "Track Pants",
        "Value Pack",
      ],
    },
    {
      key: "Indian & Festive Wear",
      title: "Indian & Festive Wear",
      child: ["Kurtas & Kurta Sets", "Sherwanis"],
    },
    {
      key: "Western Wear",
      title: "Western Wear",
      child: ["Dresses", "Jumpsuits"],
    },
    {
      key: "Product Features",
      title: "Product Features",
      child: ["360 Product Viewer", "Product with Video"],
    },
  ];

  const handleAddDemodata = async () => {
    demoCategories.forEach(async (cat) => {
      const data: CatDemoProp = {
        title: cat.title,
        parentId: "",
        slug: replaceName(cat.title),
        description: "",
      };

      await handleAddCategory(cat.child, data);
    });
  };

  const handleAddCategory = async (child: string[], data: CatDemoProp) => {
    const api = "/Categories/add-new";
    try {
      const res = await handleAPI(api, data, "post");
      console.log(res);
      console.log("Add cat done");
      if (res.data && child.length > 0) {
        child.forEach(async (title) => {
          const item = {
            title,
            slug: replaceName(title),
            description: "",
            parentId: res.data.id,
          };
          await handleAPI(api, item, "post");
          console.log("Add sub cat done");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading ? (
    <Spin />
  ) : (
    <div>
      <div className="container-fluid">
        <Button onClick={handleAddDemodata}>Add Demo data</Button>
        <div className="row">
          <div className="col-md-4">
            <Card title={"Add new"}>
              <AddCategory
                onClose={() => setCategorySelected(undefined)}
                seleted={categorySelected}
                values={treeValues}
                onAddNew={async (val) => {
                  if (categorySelected) {
                    const items = [...categories];
                    const index = items.findIndex(
                      (element) => element.id === categorySelected.id
                    );
                    if (index !== -1) {
                      items[index] = val;
                    }
                    setCategories(items);
                    setCategorySelected(undefined);
                    await getCategories(`/Categories/get-pagination`, true);
                    await getAllCategories();
                  } else {
                    await getCategories(
                      `/Categories/get-pagination?PageNumber=${page}&PageSize=${pageSize}`
                    );
                  }
                }}
              />
            </Card>
          </div>
          <div className="col-md-8">
            <Card>
              <Table
                // pagination={{
                //   pageSize: 1,
                //   showSizeChanger: true,
                //   onChange: (vals) => {
                //     setPage(vals);
                //   },
                //   onShowSizeChange: (val) => {
                //     console.log(val);
                //   },
                // }}
                size="small"
                dataSource={categories}
                columns={columns}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
