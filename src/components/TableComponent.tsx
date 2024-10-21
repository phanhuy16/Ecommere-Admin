import { colors } from "@/constants/color";
import { ModalExportData } from "@/modals";
import { FormModel } from "@/models/FormModel";
import { Button, Space, Table, Typography } from "antd";
import { ColumnProps } from "antd/es/table";
import { Sort } from "iconsax-react";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";

interface Props {
  forms: FormModel;
  loading: boolean;
  records: any[];
  onPageChange: (val: { page: number; pageSize: number }) => void;
  onAddNew: () => void;
  scrollHeight?: string;
  total?: number;
  extraColumn?: (item: any) => void;
  api: string;
}

const { Title } = Typography;
const TableComponent = (props: Props) => {
  const {
    forms,
    loading,
    records,
    onPageChange,
    onAddNew,
    total,
    scrollHeight,
    extraColumn,
    api,
  } = props;

  const [pageInfo, setPageInfo] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: 1,
    pageSize: 10,
  });

  const [columns, setColumns] = useState<ColumnProps<any>[]>([]);
  const [isVisibleModalExport, setIsVisibleModalExport] = useState(false);

  useEffect(() => {
    onPageChange(pageInfo);
  }, [pageInfo]);

  useEffect(() => {
    if (forms && forms.formItem && forms.formItem.length > 0) {
      const items: any[] = [];

      forms.formItem.forEach((item) => {
        items.push({
          key: item.key,
          dataIndex: item.value,
          title: item.label,
          width: item.displayLength,
        });
      });

      items.unshift({
        title: "#",
        dataIndex: "index",
        align: "center",
        width: 50,
      });

      if (extraColumn) {
        items.push({
          key: "actions",
          dataIndex: "",
          title: "Actions",
          render: (item: any) => extraColumn(item),
          fixed: "right",
          align: "right",
          width: 100,
        });
      }

      setColumns(items);
    }
  }, [forms]);

  const RenderTitle = (props: any) => {
    const { children, ...restProps } = props;
    return (
      <th {...restProps} style={{ padding: "10px 12px" }}>
        <Resizable
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          onResizeStop={(_e, _direction, _ref, d) => {
            const item = columns.find(
              (element) => element.title === children[1]
            );

            if (item) {
              const items = [...columns];
              const newWidth = (item.width as number) + d.width;
              const index = columns.findIndex(
                (element) => element.key === item?.key
              );

              if (index !== -1) {
                items[index].width = newWidth;
              }
              setColumns(items);
            }
          }}
        >
          {children}
        </Resizable>
      </th>
    );
  };

  return (
    <>
      <Table
        bordered
        pagination={{
          showSizeChanger: true,
          onShowSizeChange(_current, size) {
            setPageInfo({ ...pageInfo, pageSize: size });
          },
          total,
          onChange(page, pageSize) {
            setPageInfo({ page, pageSize: pageSize ?? pageInfo.pageSize });
          },
          position: ["bottomRight"],
        }}
        scroll={{
          y: scrollHeight ?? "calc(100vh - 280px)",
        }}
        loading={loading}
        dataSource={records}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>{forms.title}</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button type="primary" onClick={onAddNew}>
                  Add Supplier
                </Button>
                <Button icon={<Sort size={20} color={colors.gray600} />}>
                  Filter
                </Button>
                <Button onClick={() => setIsVisibleModalExport(true)}>
                  <SiMicrosoftexcel /> Export excel
                </Button>
              </Space>
            </div>
          </div>
        )}
        components={{
          header: { cell: RenderTitle },
        }}
      />

      <ModalExportData
        visible={isVisibleModalExport}
        onClose={() => setIsVisibleModalExport(false)}
        api={api}
        name={api}
      />
    </>
  );
};

export default TableComponent;
