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

  return (
    <div>
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
              dropdownRender={() => (
                <FilterProduct
                  onFilter={(vals) => handleFilterProducts(vals)}
                />
              )}
            >
              <Button icon={<Sort size={20} />}>Filter</Button>
            </Dropdown>
            <Divider type="vertical" />
            <Link to={"/inventory/add-product"}>
              <Button type="primary">Add Product</Button>
            </Link>
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
        onAddNew={async (val) => {
          console.log(val);
          await getProducts(
            `/Products/get-pagination?PageNumber=${page}&PageSize=${pageSize}`
          );
        }}
      />
    </div>
  );
};

export default InventoryScreen;
