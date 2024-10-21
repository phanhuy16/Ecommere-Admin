import handleAPI from "@/apis/handleAPI";
import TableComponent from "@/components/TableComponent";
import ToogleSupplier from "@/modals/ToogleSupplier";
import { FormModel } from "@/models/FormModel";
import { SupplierModel } from "@/models/SupplierModel";
import { Button, message, Modal, Space, Tooltip } from "antd";
import { Edit2, UserRemove } from "iconsax-react";
import { useEffect, useState } from "react";

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
  //     render: (isTalking: boolean) => (
  //       <Text type={isTalking ? "success" : "danger"}>
  //         {isTalking ? "Taking Return" : "Not Taking Return"}
  //       </Text>
  //     ),
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getSuppliers();
  }, [page, pageSize]);

  const getData = async () => {
    setIsLoadingForms(true);
    try {
      await getForms();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoadingForms(false);
    }
  };

  const getForms = async () => {
    const api = `/Suppliers/get-form`;
    const res: any = await handleAPI(api);
    res.value.form && setForms(res.value.form);
  };

  const getSuppliers = async () => {
    setIsLoading(true);
    const api = `/Suppliers/get-pagination?PageNumber=${page}&PageSize=${pageSize}`;
    try {
      const res: any = await handleAPI(api);
      res.value.data && setSuppliers(res.value.data);
      const items = res.value.data.map(
        (supplier: SupplierModel, index: number) => ({
          ...supplier,
          index: (page - 1) * pageSize + index + 1,
        })
      );
      setSuppliers(items);
      setTotalRecords(totalRecords);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    const api = `/Suppliers/delete/${id}`;
    try {
      setIsLoading(true);
      await handleAPI(api, undefined, "delete");
      await getSuppliers();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {forms && (
        <TableComponent
          api="Suppliers"
          total={totalRecords}
          loading={isLoading || isLoadingForms}
          forms={forms}
          records={suppliers}
          onPageChange={(val) => {
            setPage(val.page);
            setPageSize(val.pageSize);
          }}
          onAddNew={() => {
            setIsVisibleModalAddNew(true);
          }}
          extraColumn={(item) => (
            <Space>
              <Tooltip title="Edit">
                <Button
                  type="text"
                  onClick={() => {
                    setSupplierSelected(item);
                    setIsVisibleModalAddNew(true);
                  }}
                  icon={
                    <Edit2 variant="Bold" size={18} className="text-info" />
                  }
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  onClick={() =>
                    confirm({
                      title: "Confirm",
                      content: "Are you sura you want to delete this supplier",
                      onOk: () => handleDeleteSupplier(item.id),
                    })
                  }
                  type="text"
                  icon={<UserRemove size={18} className="text-danger" />}
                />
              </Tooltip>
            </Space>
          )}
        />
      )}
      <ToogleSupplier
        visible={isVisibleModalAddNew}
        onClose={() => {
          supplierSelected && getSuppliers();
          setIsVisibleModalAddNew(false);
          setSupplierSelected(undefined);
        }}
        onAddNew={() => getSuppliers()}
        supplier={supplierSelected}
      />
    </div>
  );
};

export default SupplierScreen;
