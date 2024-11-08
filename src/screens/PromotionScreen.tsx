import handleAPI from "@/apis/handleAPI";
import { AddPromotion } from "@/modals";
import { PromotionModel } from "@/models/PromotionModel";
import { Avatar, Button, message, Modal, Space, Spin, Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { useEffect, useState } from "react";

const { confirm } = Modal;

const PromotionScreen = () => {
  const [isVisibleModalAddPromotion, setIsVisibleModalAddPromotion] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promotions, setPromotions] = useState<PromotionModel[]>([]);
  const [promotionSelected, setPromotionSelected] = useState<PromotionModel>();

  useEffect(() => {
    getPromotions();
  }, []);

  const getPromotions = async () => {
    const api = `/Promotion/get-all`;

    setIsLoading(true);

    try {
      const res = await handleAPI(api);
      setPromotions(res.data);
    } catch (error: any) {
      message.error(error.message);
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
      message.error(error.message);
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
            <div className="mb-4 text-right">
              <Button onClick={() => setIsVisibleModalAddPromotion(true)}>
                Add Promotion
              </Button>
            </div>
            <Table
              loading={isLoading}
              columns={columns}
              dataSource={promotions}
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
