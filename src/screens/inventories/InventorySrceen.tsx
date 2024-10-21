import handleAPI from "@/apis/handleAPI";
import { FilterProduct } from "@/components";
import CategoryComponent from "@/components/CategoryComponent";
import { FilterProductValue } from "@/components/FilterProduct";
import { colors } from "@/constants/color";
import { AddSubProductModal } from "@/modals";
import { ProductModel, SubProductModel } from "@/models/Products";
import { replaceName } from "@/utils/replaceName";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Dropdown,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ColumnProps, TableProps } from "antd/es/table";
import axios from "axios";
import { Edit2, Sort, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { MdLibraryAdd } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const { confirm } = Modal;

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

const InventoryScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isVisibleAddSubProduct, setIsVisibleAddSubProduct] = useState(false);
  const [productSelected, setProductSelected] = useState<ProductModel>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState<number>(10);
  const [searchKey, setSearchKey] = useState("");
  const [isFilting, setIsFilting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!searchKey) {
      getProducts(
        `/Products/get-pagination?PageNumber=${page}&PageSize=${pageSize}`
      );
    }
  }, [searchKey]);

  useEffect(() => {
    getProducts(
      `/Products/get-pagination?PageNumber=${page}&PageSize=${pageSize}`
    );
  }, [page, pageSize]);

  const getMinMaxValues = (data: SubProductModel[]) => {
    const nums: number[] = [];

    if (data.length > 0) {
      data.forEach((item) => nums.push(item.price));
    }
    return nums.length > 0
      ? `${Math.min(...nums).toLocaleString()} - ${Math.max(
          ...nums
        ).toLocaleString()}`
      : "";
  };

  const getProducts = async (api: string) => {
    setIsLoading(true);

    try {
      const res: any = await handleAPI(api);
      const item = res.value;
      setProducts(item.data.map((item: any) => ({ ...item, key: item.id })));
      setTotal(item.totalRecords);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = async (id: string) => {
    const api = `/Products/delete/${id}`;

    try {
      await handleAPI(api, undefined, "delete");
      message.success("Delete success!!!");
      getProducts(
        `/Products/get-pagination?PageNumber=${page}&PageSize=${pageSize}`
      );
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const onSelectChange = (newSelectRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectRowKeys);
  };

  const rowSelection: TableRowSelection<ProductModel> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSelectAllProduct = async () => {
    try {
      const res: any = await handleAPI("/Products/get-all");

      const items = res;

      if (items.length > 0) {
        const keys = items.map((item: any) => item.id);
        setSelectedRowKeys(keys);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchProducts = async () => {
    const key = replaceName(searchKey);
    const api = `/Products/${key}`;
    setIsLoading(true);
    try {
      const res: any = await handleAPI(api);

      setProducts(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterProducts = async (vals: FilterProductValue) => {
    const api = `/Products/filter-product`;
    setIsFilting(true);
    try {
      const res: any = await handleAPI(api, vals, "post");
      setProducts(res);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: "title",
      dataIndex: "",
      title: "Title",
      width: 200,
      render: (item: ProductModel) => (
        <Link to={`/inventory/detail/${item.slug}?id=${item.id}`}>
          {item.title}
        </Link>
      ),
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Description",
      render: (desc: string) => (
        <Tooltip title={desc}>
          <span className="text">{desc}</span>
        </Tooltip>
      ),
      width: 300,
    },
    {
      key: "categories",
      dataIndex: "productCategories",
      title: "Categories",
      render: (ids: any[]) => (
        <Space wrap key={"category"}>
          {ids.map((id, index) => (
            <CategoryComponent id={id?.category.id} key={index} />
          ))}
        </Space>
      ),
      width: 200,
    },
    {
      key: "images",
      dataIndex: "images",
      title: "Images",
      render: (imgs: string[]) =>
        imgs &&
        imgs.length > 0 && (
          <Space wrap>
            <Avatar.Group
              size="large"
              max={{
                count: 4,
                style: { color: "#f56a00", backgroundColor: "#fde3cf" },
              }}
            >
              {imgs.map((img, index) => (
                <Avatar src={img} size={40} key={index} />
              ))}
            </Avatar.Group>
          </Space>
        ),
      width: 200,
    },
    {
      key: "colors",
      dataIndex: "subProducts",
      title: "Color",
      render: (items: SubProductModel[]) => {
        const colors: string[] = [];

        items.forEach(
          (sub) => !colors.includes(sub.color) && colors.push(sub.color)
        );
        return (
          <Space>
            {colors.length > 0 &&
              colors.map((item, index) => (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: item,
                    borderRadius: "12px",
                  }}
                  key={`color${item}${index}`}
                />
              ))}
          </Space>
        );
      },
      width: 200,
    },
    {
      key: "sizes",
      dataIndex: "subProducts",
      title: "Size",
      render: (items: SubProductModel[]) => (
        <Space wrap>
          {items.length > 0 &&
            items.map((item) => (
              <Tag key={`size${item.size}`}>{item.size}</Tag>
            ))}
        </Space>
      ),
      width: 150,
    },
    {
      key: "price",
      dataIndex: "subProducts",
      title: "Price",
      render: (items: SubProductModel[]) => (
        <Typography.Text>{getMinMaxValues(items)}</Typography.Text>
      ),
      width: 200,
    },
    {
      key: "stock",
      dataIndex: "subProducts",
      title: "Stock",
      render: (items: SubProductModel[]) =>
        items.reduce((a, b) => a + b.qty, 0),
      align: "center",
      width: 100,
    },

    {
      key: "actions",
      title: "Actions",
      dataIndex: "",
      fixed: "right",
      render: (item: ProductModel) => (
        <Space>
          <Tooltip title="Add sub product" key={"addSubProduct"}>
            <Button
              icon={<MdLibraryAdd color={colors.primary500} size={20} />}
              type="text"
              onClick={() => {
                setProductSelected(item);
                setIsVisibleAddSubProduct(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Edit product" key={"btnEdit"}>
            <Button
              icon={
                <Edit2 variant="Bold" color={colors.primary500} size={20} />
              }
              type="text"
              onClick={() => {
                navigate(`/inventory/add-product?id=${item.id}`);
              }}
            />
          </Tooltip>

          <Tooltip title="Delete product" key={"btnDelete"}>
            <Button
              icon={<Trash variant="Bold" className="text-danger" size={20} />}
              type="text"
              onClick={() => {
                confirm({
                  title: "Confirm",
                  content: "Are you sure you want to delete this item?",
                  onCancel: () => console.log("Cancel"),
                  onOk: () => handleRemoveProduct(item.id),
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
      align: "right",
      width: 150,
    },
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const democolors = [
    "#E15353",
    "#5553E1",
    "#E1A053",
    "#131118",
    "#A3D139",
    "#E1D353",
  ];

  const images = [
    "https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2752045/pexels-photo-2752045.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1485031/pexels-photo-1485031.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2010812/pexels-photo-2010812.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2233703/pexels-photo-2233703.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3363204/pexels-photo-3363204.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/983497/pexels-photo-983497.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3672825/pexels-photo-3672825.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/36029/aroni-arsa-children-little.jpg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2738792/pexels-photo-2738792.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2866077/pexels-photo-2866077.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2010925/pexels-photo-2010925.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/3054973/pexels-photo-3054973.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2693849/pexels-photo-2693849.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];

  const cats = [
    "41513726-da1e-4296-1770-08dcf1889641",
    "bc53fddb-1eab-44a7-176f-08dcf1889641",
    "55263f0e-c5b8-4a2b-176e-08dcf1889641",
    "d53869ab-b66c-4fc6-176d-08dcf1889641",
    "095734e6-ea41-4afd-176c-08dcf1889641",
    "5ece2452-6400-4ba6-176b-08dcf1889641",
    "6de796df-dc79-4a87-176a-08dcf1889641",
    "3e7533e8-2da6-435e-1769-08dcf1889641",
    "061f0bf4-4fd7-4f1b-1768-08dcf1889641",
    "2bff2d65-355c-49d2-1767-08dcf1889641",
    "9c287843-2b58-4992-1766-08dcf1889641",
    "e990f7ab-dd32-47bc-1765-08dcf1889641",
    "d2bde611-5aca-421a-1764-08dcf1889641",
    "680569be-230b-45d5-1763-08dcf1889641",
    "c71320ad-f68a-42de-1762-08dcf1889641",
    "f3a402e7-0abd-4244-1761-08dcf1889641",
    "6b394805-33e9-4a57-1760-08dcf1889641",
    "533248a0-c1dc-46f9-175f-08dcf1889641",
    "090fcd7a-e3e8-4008-175e-08dcf1889641",
    "d14e8199-8c18-4708-175d-08dcf1889641",
    "007704cc-2fc6-4c8c-175c-08dcf1889641",
    "9dc9b329-44b0-446b-175b-08dcf1889641",
    "d7cc06d8-21db-4815-175a-08dcf1889641",
    "cec8bbb9-f0a0-4f09-1759-08dcf1889641",
    "7396f10f-80ca-4a5b-1758-08dcf1889641",
    "14723c62-71c0-4d2c-1757-08dcf1889641",
    "bea3d8bc-ad0e-442d-1756-08dcf1889641",
    "dbe0765e-ceaa-417a-1755-08dcf1889641",
    "dff895ae-1d1e-42bc-1754-08dcf1889641",
    "a5eb4574-97fd-478f-1753-08dcf1889641",
    "086e9440-1f6e-4158-1752-08dcf1889641",
    "a70821d8-40b3-4c6c-1751-08dcf1889641",
    "394edf8c-40d7-40c1-1750-08dcf1889641",
    "340b8761-6748-4528-174f-08dcf1889641",
  ];

  const handleAddDemoProduct = async () => {
    Array.from({ length: 500 }).forEach(async (_item) => {
      const categories: { categoryId: string }[] = [];

      const shuffledCats = cats.sort(() => 0.5 - Math.random());
      const selectedCats = shuffledCats.slice(0, 3);

      selectedCats.forEach((cat) => {
        categories.push({ categoryId: cat });
      });

      const data = {
        title: "Girls Pink Moana Printed Dress",
        slug: replaceName("Girls Pink Moana Printed Dress"),
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum quisquam doloremque, hic aliquam maxime, neque exercitationem rerum officiis fugit deserunt rem ipsum? Aspernatur maxime consectetur quod explicabo cum deleniti aliquid.",
        productCategories: categories,
        supplier: "YK Disney",
        content: "",
        images: [images[Math.floor(Math.random() * images.length)]],
      };

      try {
        const res: any = await handleAPI(`/Products/add-new`, data, "post");
        console.log("Add product done");
        if (res.data) {
          await handleAddSubProduct(res.data.id);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleAddSubProduct = async (id: string) => {
    Array.from({ length: 5 }).forEach(async () => {
      const data = {
        product_Id: id,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        color: democolors[Math.floor(Math.random() * democolors.length)],
        price: Math.floor(Math.random() * 1000),
        qty: Math.floor(Math.random() * 100),
        images: [images[Math.floor(Math.random() * images.length)]],
      };

      try {
        const res = await handleAPI("/Products/add-sub-product", data, "post");
        console.log("Add sub product done");
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div>
      <Button onClick={handleAddDemoProduct}>Add demo product</Button>
      <Button
        onClick={async () => {
          try {
            const res: any = await handleAPI("/Categories/get-all");
            const cats: string[] = [];
            res.forEach((item: any) => cats.push(item.id));
            console.log(cats);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Add demo{" "}
      </Button>
      <div className="row mb-3">
        <div className="col">
          <Typography.Title level={4}>Product</Typography.Title>
        </div>
        <div className="col">
          {selectedRowKeys.length > 0 && (
            <Space>
              <Tooltip title="Delete item">
                <Button
                  onClick={() => {
                    confirm({
                      title: "Confirm",
                      content: "Are you sure you want to delete this item?",
                      onCancel: () => {
                        setSelectedRowKeys([]);
                      },
                      onOk: () => {
                        selectedRowKeys.forEach(
                          async (key: any) => await handleRemoveProduct(key)
                        );
                      },
                    });
                  }}
                  danger
                  type="text"
                  icon={<Trash size={14} className="text-danger" />}
                >
                  Delete
                </Button>
              </Tooltip>
              <Typography.Text>
                {selectedRowKeys.length} items selected
              </Typography.Text>
              {selectedRowKeys.length < total && (
                <Button type="link" onClick={handleSelectAllProduct}>
                  Select all
                </Button>
              )}
            </Space>
          )}
        </div>
        <div className="col text-right">
          <Space>
            {isFilting && (
              <Button
                onClick={async () => {
                  setIsFilting(false);
                  await getProducts(
                    `/Products/get-pagination?PageNumber=${page}&PageSize=${pageSize}`
                  );
                }}
              >
                Clear filter values
              </Button>
            )}
            <Input.Search
              value={searchKey}
              onChange={(val) => setSearchKey(val.target.value)}
              onSearch={handleSearchProducts}
              placeholder="Search..."
            />
            <Dropdown
              dropdownRender={(menu) => (
                <FilterProduct
                  values={{}}
                  onFilter={(vals) => handleFilterProducts(vals)}
                />
              )}
            >
              <Button icon={<Sort size={20} />}>Filter</Button>
            </Dropdown>
            <Divider type="vertical" />
            <Button type="primary">Add Product</Button>
          </Space>
        </div>
      </div>
      <Table
        pagination={{
          showSizeChanger: true,
          onChange: (current, size) => {
            setPage(current);
            setPageSize(size);
          },
          total: total,
          current: page,
          pageSize: pageSize,
        }}
        rowSelection={rowSelection}
        dataSource={products}
        columns={columns}
        loading={isLoading}
        scroll={{
          y: "420px",
          x: "100%",
        }}
        bordered
      />

      <AddSubProductModal
        product={productSelected}
        visible={isVisibleAddSubProduct}
        onClose={() => {
          setIsVisibleAddSubProduct(false);
          setProductSelected(undefined);
        }}
        onAddNew={async (_val) => {
          await getProducts(
            `/Products/get-pagination?PageNumber=${page}&PageSize=${pageSize}`
          );
        }}
      />
    </div>
  );
};

export default InventoryScreen;
