import handleAPI from "@/apis/handleAPI";
import { colors } from "@/constants/color";
import { ProductModel, SubProductModel } from "@/models/Products";
import { handleResize, uploadFile } from "@/utils/uploadFile";
import {
  ColorPicker,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { useEffect, useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  product?: ProductModel;
  onAddNew: (val: SubProductModel) => void;
}

const AddSubProductModal = (props: Props) => {
  const { visible, onClose, product, onAddNew } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue("color", colors.primary500);
  }, []);

  const handleAddSubProduct = async (values: any) => {
    if (product) {
      const data: any = {};
      for (const i in values) {
        data[i] = values[i] ?? "";
      }

      data.product_Id = product.id;

      if (data.color) {
        data.color =
          typeof data.color === "string"
            ? data.color
            : data.color.toHexString();
      }

      setIsLoading(true);

      const api = `/Products/add-sub-product`;
      try {
        const res: any = await handleAPI(api, data, "post");

        await uploadFileForId(res.data.id, data);

        message.success(res.message);
        onAddNew(res);
        handleCancel();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      message.error("Need to product detail");
    }
  };

  const uploadFileForId = async (subId: string, data: any) => {
    try {
      if (fileList.length > 0) {
        const uploadPromises = fileList.map(async (file) => {
          const url = await uploadFile(file.originFileObj);
          console.log(`Uploaded file: ${url}`);
          return url;
        });

        console.log(`Sub ID for upload: ${subId}`);
        // Đợi tất cả các ảnh được tải lên
        const urls = await Promise.all(uploadPromises);

        if (urls.length > 0) {
          await handleAPI(
            `/Products/update-sub-product?id=${subId}`,
            { images: urls.filter((url) => url), ...data },
            "put"
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
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
    setFileList(items);
  };

  return (
    <Modal
      title="Add Sub Product"
      open={visible}
      onCancel={handleCancel}
      onClose={handleCancel}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
    >
      <Typography.Title level={5}>{product?.title}</Typography.Title>
      <Form
        layout="vertical"
        onFinish={handleAddSubProduct}
        size="large"
        form={form}
        disabled={isLoading}
      >
        <Form.Item name="color" label="Color">
          <ColorPicker format="hex" />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Type device size",
            },
          ]}
          name="size"
          label="Size"
        >
          <Input allowClear />
        </Form.Item>
        <div className="row">
          <div className="col">
            <Form.Item name="qty" label="Quantity">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <div className="col">
            <Form.Item name="price" label="Price">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </div>
      </Form>
      <Upload
        fileList={fileList}
        listType="picture-card"
        multiple
        accept="image/*"
        onChange={handleChange}
      >
        Upload
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Modal>
  );
};

export default AddSubProductModal;
