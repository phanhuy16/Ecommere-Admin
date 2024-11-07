import handleAPI from "@/apis/handleAPI";
import { colors } from "@/constants/color";
import { ToogleSupplier } from "@/modals";
import { FormModel } from "@/models/FormModel";
import { SupplierModel } from "@/models/SupplierModel";
import {
  Button,
  message,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { ColumnProps } from "antd/es/table/Column";
import { Edit2, Sort, UserRemove } from "iconsax-react";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { confirm } = Modal;

const SupplierScreen = () => {
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState<number>(10);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [forms, setForms] = useState<FormModel>();

  useEffect(() => {
    getSuppliers();
  }, [page, pageSize]);

  const getSuppliers = async () => {
    setIsLoading(true);
    const api = `/Suppliers/get-pagination?PageNumber=${page}&PageSize=${pageSize}`;
    try {
      const res: any = await handleAPI(api);
      if (res.value.data) {
        setSuppliers(res.value.data);
      }
      // const items = res.value.data.map(
      //   (supplier: SupplierModel, index: number) => ({
      //     ...supplier,
      //     index: (page - 1) * pageSize + index + 1,
      //   })
      // );
      // setSuppliers(items);
      setTotalRecords(res.value.totalRecords);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSupplier = async (id: string) => {
    const api = `/Suppliers/delete?id=${id}`;

    setIsLoading(true);

    try {
      await handleAPI(api, undefined, "delete");
      getSuppliers();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: "name",
      title: "Supplier name",
      dataIndex: "name",
    },
    {
      key: "product",
      title: "Product",
      dataIndex: "product",
    },
    {
      key: "contact",
      title: "Contact",
      dataIndex: "contact",
    },
    {
      key: "email",
      title: "Email Address",
      dataIndex: "email",
    },
    {
      key: "type",
      title: "Type",
      dataIndex: "isTalking",
      render: (isTaking: boolean) => (
        <Text type={isTaking ? "success" : "danger"}>
          {isTaking ? "Taking Return" : "Not Taking Return"}
        </Text>
      ),
    },
    {
      key: "on",
      title: "On the way",
      dataIndex: "active",
      render: (num: number) => num ?? "-",
    },
    {
      key: "action",
      title: "Actions",
      dataIndex: "",
      render: (item: SupplierModel) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                setSupplierSelected(item);
                setIsVisibleModalAddNew(true);
              }}
              type="text"
              icon={<Edit2 size={20} className="text-info" />}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              onClick={() =>
                confirm({
                  title: "Confirm",
                  content: "Are you sure you want to remove this supplier?",
                  onOk: () => removeSupplier(item.id),
                })
              }
              type="text"
              icon={<UserRemove size={20} className="text-danger" />}
            />
          </Tooltip>
        </Space>
      ),
      fixed: "right",
      align: "center",
    },
  ];

  return (
    <div>
      <Table
        pagination={{
          showSizeChanger: true,
          onChange: (current, size) => {
            setPage(current);
            setPageSize(size);
          },
          total: totalRecords,
          current: page,
          pageSize: pageSize,
        }}
        scroll={{
          y: "calc(100vh - 300px)",
        }}
        loading={isLoading}
        dataSource={suppliers}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Suppliers</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button
                  type="primary"
                  onClick={() => setIsVisibleModalAddNew(true)}
                >
                  Add Product
                </Button>
                <Button icon={<Sort size={20} color={colors.gray600} />}>
                  Filters
                </Button>
                <Button type="primary">Download all</Button>
              </Space>
            </div>
          </div>
        )}
      />
      <ToogleSupplier
        visible={isVisibleModalAddNew}
        onClose={() => {
          if (supplierSelected) {
            getSuppliers();
          }
          setSupplierSelected(undefined);
          setIsVisibleModalAddNew(false);
        }}
        onAddNew={(val) => {
          setSuppliers([...suppliers, val]);
        }}
        supplier={supplierSelected}
      />
    </div>
  );
};

export default SupplierScreen;
