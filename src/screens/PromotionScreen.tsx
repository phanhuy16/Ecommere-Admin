import handleAPI from "@/apis/handleAPI";
import { AddPromotion } from "@/modals";
import { PromotionModel } from "@/models/PromotionModel";
import { handleExportExcel } from "@/utils/handleExportExcel";
import { replaceName } from "@/utils/replaceName";
import {
  Avatar,
  Button,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { PiDownloadLight } from "react-icons/pi";

const { confirm } = Modal;
const { Title } = Typography;

const PromotionScreen = () => {
  const [isVisibleModalAddPromotion, setIsVisibleModalAddPromotion] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promotions, setPromotions] = useState<PromotionModel[]>([]);
  const [promotionSelected, setPromotionSelected] = useState<PromotionModel>();
  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState<number>(10);

  useEffect(() => {
    if (!searchKey) {
      getPromotions();
    }
  }, [searchKey]);

  useEffect(() => {
    getPromotions();
  }, [page, pageSize]);

  const getPromotions = async () => {
    const api = `/Promotion/get-all`;

    setIsLoading(true);

    try {
      const res: any = await handleAPI(api);
      setPromotions(res.data);
      setTotalRecords(res.value.totalRecords);
    } catch (error: any) {
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePromotion = async (id: string) => {
    const api = `/Promotion/delete?id=${id}`;
    setIsLoading(true);

    try {
      await handleAPI(api, undefined, "delete");
      await getPromotions();
    } catch (error: any) {
      message.error(error);
    }
  };

  const handleSearchPromotions = async () => {
    const key = replaceName(searchKey);
    const api = `/Promotion/search?slug=${key}`;
    setIsLoading(true);
    try {
      const res = await handleAPI(api);

      setPromotions(res.data);
    } catch (error: any) {
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<PromotionModel>[] = [
    {
      key: "image",
      dataIndex: "imageURL",
      title: "Image",
      render: (img: string) => <Avatar src={img} size={50} />,
    },
    {
      key: "title",
      dataIndex: "title",
      title: "Title",
    },
    {
      key: "slug",
      dataIndex: "slug",
      title: "Slug",
    },
    {
      key: "desciption",
      dataIndex: "description",
      title: "Descirption",
    },
    {
      key: "code",
      dataIndex: "code",
      title: "Code",
    },
    {
      key: "value",
      dataIndex: "value",
      title: "Value",
    },
    {
      key: "numOfAvailable",
      dataIndex: "numOfAvailable",
      title: "Num Of Available",
    },
    {
      key: "type",
      dataIndex: "type",
      title: "Type",
    },
    {
      key: "btn",
      dataIndex: "",
      title: "Actions",
      align: "right",
      fixed: "right",
      render: (item: PromotionModel) => (
        <Space>
          <Button
            onClick={() => {
              setPromotionSelected(item);
              setIsVisibleModalAddPromotion(true);
            }}
            type="text"
            icon={<Edit2 variant="Bold" size={20} className="text-info" />}
          />
          <Button
            onClick={() => {
              confirm({
                title: "Confirm",
                content: "Are you sure you want to remove this promotion?",
                onOk: () => handleRemovePromotion(item.id),
              });
            }}
            type="text"
            icon={<Trash variant="Bold" size={20} className="text-danger" />}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {isLoading ? (
        <Spin fullscreen />
      ) : (
        <>
          <div className="container-fluid">
            <Table
              pagination={{
                onChange: (current, size) => {
                  setPage(current);
                  setPageSize(size);
                },
                total: totalRecords,
                current: page,
                pageSize: pageSize,
              }}
              loading={isLoading}
              columns={columns}
              dataSource={promotions}
              title={() => (
                <div className="row">
                  <div className="col">
                    <Title level={5}>Promotions</Title>
                  </div>
                  <div className="col text-right">
                    <Space>
                      <Input.Search
                        value={searchKey}
                        onChange={(val) => setSearchKey(val.target.value)}
                        onSearch={handleSearchPromotions}
                        placeholder="Search..."
                      />
                      <Button
                        type="primary"
                        onClick={() => setIsVisibleModalAddPromotion(true)}
                      >
                        Add Promotion
                      </Button>
                      <Button
                        icon={<PiDownloadLight size={20} />}
                        onClick={() =>
                          handleExportExcel("/Promotion/export-excel")
                        }
                        loading={isLoading}
                      >
                        Download
                      </Button>
                    </Space>
                  </div>
                </div>
              )}
            />
          </div>
        </>
      )}

      <AddPromotion
        promotion={promotionSelected}
        onAddNew={async (val) => {
          await getPromotions();
          console.log(val);
        }}
        visible={isVisibleModalAddPromotion}
        onClose={() => setIsVisibleModalAddPromotion(false)}
      />
    </div>
  );
};

export default PromotionScreen;
