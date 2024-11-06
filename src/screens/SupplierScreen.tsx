import { colors } from "@/constants/color";
import { ToogleSupplier } from "@/modals";
import { FormModel } from "@/models/FormModel";
import { SupplierModel } from "@/models/SupplierModel";
import { Button, Modal, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table/Column";
import { Sort } from "iconsax-react";
import { useState } from "react";

const { Title } = Typography;

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

  const { confirm } = Modal;

  // const getSuppliers = async () => {
  //   setIsLoading(true);
  //   const api = `/Suppliers/get-pagination?PageNumber=${page}&PageSize=${pageSize}`;
  //   try {
  //     const res: any = await handleAPI(api);
  //     res.value.data && setSuppliers(res.value.data);
  //     const items = res.value.data.map(
  //       (supplier: SupplierModel, index: number) => ({
  //         ...supplier,
  //         index: (page - 1) * pageSize + index + 1,
  //       })
  //     );
  //     setSuppliers(items);
  //     setTotalRecords(totalRecords);
  //   } catch (error: any) {
  //     message.error(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const columns: ColumnProps<SupplierModel>[] = [];

  return (
    <div>
      <Table
        dataSource={[]}
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
          setIsVisibleModalAddNew(false);
        }}
        onAddNew={(val) => {
          console.log(val);
        }}
        supplier={supplierSelected}
      />
    </div>
  );
};

export default SupplierScreen;
