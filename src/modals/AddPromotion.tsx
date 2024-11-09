import handleAPI from "@/apis/handleAPI";
import { PromotionModel } from "@/models/PromotionModel";
import { uploadFile } from "@/utils/uploadFile";
import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Upload,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { replaceName } from "@/utils/replaceName";

interface Props {
  visible: boolean;
  onClose: () => void;
  promotion?: PromotionModel;
  onAddNew: (val: PromotionModel) => void;
}

const AddPromotion = (props: Props) => {
  const { visible, onClose, onAddNew, promotion } = props;

  const [form] = Form.useForm();

  const [imageUpload, setImageUpload] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (promotion) {
      form.setFieldsValue({
        ...promotion,
        startAt: dayjs(promotion.startAt),
        endAt: dayjs(promotion.endAt),
      });

      if (promotion.imageURL) {
        setImageUpload([{ url: promotion.imageURL, status: "done" }]);
      }
    }
  }, [promotion, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const items = newFileList.map((item) =>
      item.originFileObj
        ? {
            ...item,
            url: item.originFileObj
              ? URL.createObjectURL(item.originFileObj)
              : "",
            status: "done",
          }
        : { ...item }
    );
    setImageUpload(items);
  };

  const handleAddNewPromotion = async (values: any) => {
    if (imageUpload.length === 0) {
      message.error("Please upload one image");
    } else {
      const start = values.startAt;
      const end = values.endAt;

      if (new Date(end).getTime() < new Date(start).getTime()) {
        message.error("The end time must be greater than the start time");
      } else {
        const data: any = {};

        for (const i in values) {
          data[i] = values[i] ?? "";
        }

        data.startAt = new Date(start);
        data.endAt = new Date(end);

        data.imageURL =
          imageUpload.length > 0 && imageUpload[0].originFileObj
            ? await uploadFile(imageUpload[0].originFileObj)
            : "";

        data.slug = replaceName(values.title);

        const api = `/Promotion/${
          promotion ? `update?id=${promotion.id}` : "add-new"
        }`;
        setIsLoading(true);
        try {
          const res: any = await handleAPI(
            api,
            data,
            promotion ? "put" : "post"
          );
          onAddNew(res.data);
          handleClose();
        } catch (error: any) {
          message.error(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <Modal
      title={
        promotion ? "Update promotion/discount" : "Add new promotion/discount"
      }
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
      cancelButtonProps={{ loading: isLoading }}
    >
      <Upload
        accept="image/*"
        fileList={imageUpload}
        listType="picture-card"
        className="mb-3"
        onChange={handleChange}
      >
        {imageUpload.length === 0 ? "Image" : undefined}
      </Upload>
      <Form
        disabled={isLoading}
        form={form}
        size="middle"
        onFinish={handleAddNewPromotion}
        layout="vertical"
      >
        <Form.Item
          name={"title"}
          label="Title"
          rules={[{ required: true, message: "Please enter promotion" }]}
        >
          <Input placeholder="Promotion title" allowClear />
        </Form.Item>
        <Form.Item name={"description"} label="Description">
          <Input.TextArea
            rows={3}
            placeholder="Promotion description"
            allowClear
          />
        </Form.Item>
        <div className="row">
          <div className="col">
            <Form.Item
              name={"code"}
              label="CODE"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item
              name={"value"}
              label="Value"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Form.Item
              name={"numOfAvailable"}
              help="Number of times used"
              label="Num of value"
            >
              <Input type="number" />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item name={"type"} label="Type" initialValue={"discount"}>
              <Select
                options={[
                  {
                    label: "Discount",
                    value: "discount",
                  },
                  {
                    label: "Percent",
                    value: "percent",
                  },
                ]}
              />
            </Form.Item>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Form.Item name={"startAt"} label="Start time">
              <DatePicker showTime format={"DD/MM/YYYY HH:mm:ss"} />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item name={"endAt"} label="End time">
              <DatePicker showTime format={"DD/MM/YYYY HH:mm:ss"} />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPromotion;
