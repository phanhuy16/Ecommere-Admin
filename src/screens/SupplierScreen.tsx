import handleAPI from "@/apis/handleAPI";
import { colors } from "@/constants/color";
import { ToogleSupplier } from "@/modals";
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
import { saveAs } from "file-saver";
import { Edit2, Sort, UserRemove } from "iconsax-react";
import { useEffect, useState } from "react";
import { PiDownloadLight } from "react-icons/pi";

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
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderIndex = (id: string) => {
    const index = suppliers.findIndex((element) => element.id === id);

    return `${(page - 1) * pageSize + index + 1}`;
  };

  const handleExcel = async () => {
    setIsLoading(true);

    const api = "/Suppliers/export-excel";

    try {
      const res = await handleAPI(api);

      const byteCharacters = atob(res.data.fileContents);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // Convert byte array to a blob
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: res.data.contentType });

      saveAs(blob, res.data.fileDownloadName);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: "stt",
      title: "#",
      dataIndex: "id",
      render: (id: string) => renderIndex(id),
      align: "center",
      width: 50,
    },
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
                <Button
                  icon={<PiDownloadLight size={20} />}
                  onClick={handleExcel}
                >
                  Download
                </Button>
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
