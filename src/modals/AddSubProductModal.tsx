import handleAPI from "@/apis/handleAPI";
import { colors } from "@/constants/color";
import { ProductModel, SubProductModel } from "@/models/Products";
import { uploadFile } from "@/utils/uploadFile";
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
  subProduct?: SubProductModel;
}

const AddSubProductModal = (props: Props) => {
  const { visible, onClose, product, onAddNew, subProduct } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue("color", colors.primary500);
  }, [form]);

  useEffect(() => {
    if (subProduct) {
      form.setFieldsValue(subProduct);

      if (subProduct.images && subProduct.images.length > 0) {
        const items = subProduct.images.map((item) => ({
          url: item,
        }));
        setFileList(items);
      }
    }
  }, [subProduct, form]);

  const handleAddSubProduct = async (values: any) => {
    if (product) {
      const data: any = {};
      for (const i in values) {
        data[i] = values[i] ?? "";
      }

      data.product_Id = product.id;

      // Kiểm tra nếu có file ảnh
      if (fileList.length > 0) {
        const uploadPromises = fileList.map(async (file) => {
          const url = await uploadFile(file.originFileObj);
          return url;
        });

        // Đợi tất cả các ảnh được tải lên
        const urls = await Promise.all(uploadPromises);

        // Gán các URL đã upload vào data
        data.images = urls.filter((url) => url);
      }

      if (data.color) {
        data.color =
          typeof data.color === "string"
            ? data.color
            : data.color.toHexString();
      }
      setIsLoading(true);
      console.log(data);

      const api = `/Products/${
        subProduct
          ? `update-sub-product?id=${subProduct.id}`
          : "add-sub-product"
      }`;
      try {
        const res: any = await handleAPI(
          api,
          data,
          subProduct ? "put" : "post"
        );

        console.log(res);

        // await uploadFileForId(res.data.id, data);

        message.success("Add success");
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

  // const uploadFileForId = async (subId: string, data: any) => {
  //   try {
  //     if (fileList.length > 0) {
  //       const uploadPromises = fileList.map(async (file) => {
  //         const url = await uploadFile(file.originFileObj);
  //         console.log(`Uploaded file: ${url}`);
  //         return url;
  //       });

  //       // Đợi tất cả các ảnh được tải lên
  //       const urls = await Promise.all(uploadPromises);

  //       if (urls.length > 0) {
  //         await handleAPI(
  //           `/Products/update-sub-product?id=${subId}`,
  //           { images: urls.filter((url) => url), ...data },
  //           "put"
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
      title={subProduct ? "Update Sub Product" : "Add Sub Product"}
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
          <div className="col">
            <Form.Item name="discount" label="Discount">
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
