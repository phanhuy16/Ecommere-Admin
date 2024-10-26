import handleAPI from "@/apis/handleAPI";
import { colors } from "@/constants/color";
import { AddSubProductModal } from "@/modals";
import { ProductModel, SubProductModel } from "@/models/Products";
import { VND } from "@/utils/handleCurrency";
import {
  Avatar,
  Button,
  Empty,
  message,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ProductDetail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productDetail, setProductDetail] = useState<ProductModel>();
  const [subProduct, setSubProduct] = useState<SubProductModel[]>([]);
  const [productSelected, setProductSelected] = useState<ProductModel>();
  const [isVisibleAddSubProduct, setIsVisibleAddSubProduct] = useState(false);
  const [subProductSelected, setSubProductSelected] =
    useState<SubProductModel>();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      getProductDetail();
    }
  }, [id]);

  useEffect(() => {
    setProductSelected(productDetail);
  }, [productDetail]);

  const getProductDetail = async () => {
    const api = `/Products/get-by-id?id=${id}`;

    setIsLoading(true);

    try {
      const res: any = await handleAPI(api);
      setProductDetail(res);
      setSubProduct(res.subProducts);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSubProduct = async (id: string) => {
    const api = `/Products/delete-sub-product?id=${id}`;
    try {
      await handleAPI(api, undefined, "delete");
      message.success("Remove sub product success");

      const items = [...subProduct];
      const index = items.findIndex((element) => element.id === id);
      if (index !== -1) {
        items.splice(index, 1);
      }

      setSubProduct(items);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnProps<SubProductModel>[] = [
    {
      key: "images",
      title: "Image",
      dataIndex: "images",
      render: (imgs: string[]) => (
        <Space>
          {imgs
            ? imgs.length > 0 &&
              imgs.map((img) => <Avatar src={img} size={40} />)
            : null}
        </Space>
      ),
    },
    {
      key: "size",
      title: "Size",
      dataIndex: "size",
      render: (size: string) => <Tag>{size}</Tag>,
      align: "center",
    },
    {
      key: "color",
      title: "Color",
      dataIndex: "color",
      render: (color: string) => <Tag color={color}>{color}</Tag>,
      align: "center",
    },
    {
      key: "price",
      title: "Price",
      dataIndex: "price",
      render: (price: number) => VND.format(price),
      align: "right",
    },
    {
      key: "discount",
      title: "Discount",
      dataIndex: "discount",
      render: (discount: number) =>
        discount ? discount.toLocaleString() : null,
      align: "right",
    },
    {
      key: "stock",
      title: "stock",
      dataIndex: "qty",
      render: (qty: number) => qty.toLocaleString(),
      align: "right",
    },
    {
      key: "actions",
      dataIndex: "",
      render: (item: SubProductModel) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              onClick={() => {
                setSubProductSelected(item);
                setIsVisibleAddSubProduct(true);
              }}
              icon={
                <Edit2 variant="Bold" color={colors.primary500} size={18} />
              }
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              onClick={() =>
                Modal.confirm({
                  title: "Confirm",
                  content:
                    "Are you sure you want to remove this sub product item?",
                  onOk: async () => await handleRemoveSubProduct(item.id),
                })
              }
              type="text"
              danger
              icon={<Trash variant="Bold" size={18} />}
            />
          </Tooltip>
        </Space>
      ),
      align: "right",
      fixed: "right",
    },
  ];

  return isLoading ? (
    <Spin />
  ) : productDetail ? (
    <div className="container">
      <div className="row">
        <div className="col">
          <Typography.Title level={3}>{productDetail?.title}</Typography.Title>
        </div>
        <div className="col text-right">
          <Button
            onClick={() => setIsVisibleAddSubProduct(true)}
            type="primary"
          >
            Add Sub Product
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <Table columns={columns} dataSource={subProduct} />
      </div>
      {productDetail && (
        <AddSubProductModal
          product={productSelected}
          visible={isVisibleAddSubProduct}
          onClose={() => {
            setIsVisibleAddSubProduct(false);
            setProductSelected(undefined);
          }}
          subProduct={subProductSelected}
          onAddNew={async (_val) => {
            await getProductDetail();
          }}
        />
      )}
    </div>
  ) : (
    <Empty description="Data Not Found!!" />
  );
};

export default ProductDetail;
