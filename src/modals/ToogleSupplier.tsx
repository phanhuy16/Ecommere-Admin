import handleAPI from "@/apis/handleAPI";
import { colors } from "@/constants/color";
import { TreeModel } from "@/models/FormModel";
import { SupplierModel } from "@/models/SupplierModel";
import { getTreeValues } from "@/utils/getTreeValues";
import { replaceName } from "@/utils/replaceName";
import { uploadFile } from "@/utils/uploadFile";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  TreeSelect,
  Typography,
} from "antd";
import { User } from "iconsax-react";
import { useEffect, useRef, useState } from "react";

const { Paragraph } = Typography;

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: SupplierModel) => void;
  supplier?: SupplierModel;
}

const ToogleSupplier = (props: Props) => {
  const { visible, onAddNew, onClose, supplier } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isTaking, setIsTaking] = useState<boolean>();
  const [file, setFile] = useState<any>();
  const [categories, setCategories] = useState<TreeModel[]>([]);

  const [form] = Form.useForm();
  const inpRef = useRef<any>();

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier);
      setIsTaking(supplier.isTalking === true);
    }
  }, [supplier, form]);

  const addNewSupplier = async (values: any) => {
    setIsLoading(true);

    const data: any = {};

    const api = `/Suppliers/${
      supplier ? `update?id=${supplier.id}` : "add-new"
    }`;

    for (const i in values) {
      data[i] = values[i] ?? "";
    }

    data.price = values.price ? parseInt(values.price) : 0;
    data.active = values.active ? parseInt(values.active) : 0;

    data.isTalking = isTaking ? true : false;

    if (file) {
      data.image = await uploadFile(file);
    }

    data.slug = replaceName(values.name);

    data.categoryId = values.categories;

    data.id = supplier?.id;

    console.log(data);

    try {
      const res: any = await handleAPI(api, data, supplier ? "put" : "post");
      console.log(res);
      if (res.httpStatusCode === 400) {
        message.error(res.message);
      } else {
        message.success(res.message);
        if (!supplier) {
          onAddNew(res.data);
        }
        handleClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFile(undefined);
    onClose();
  };

  const getCategories = async () => {
    const res = await handleAPI("/Categories/get-all");

    const datas = res.data;

    const data = datas.length > 0 ? getTreeValues(datas, true) : [];
    setCategories(data);
  };

  return (
    <Modal
      closable={!isLoading}
      width={450}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{
        loading: isLoading,
      }}
      title={supplier ? "Update" : "Add Product"}
      okText={supplier ? "Update" : "Add Product"}
      cancelText="Discard"
    >
      <label htmlFor="inpFile" className="p-2 mb-3 text-center row">
        {file ? (
          <Avatar size={80} src={URL.createObjectURL(file)} />
        ) : supplier ? (
          <Avatar size={80} src={supplier.image} />
        ) : (
          <Avatar
            size={80}
            style={{
              backgroundColor: "transparent",
              border: "1px dashed #e0e0e0",
            }}
          >
            <User size={40} color={colors.gray600} />
          </Avatar>
        )}
        <div className="ml-3">
          <Paragraph className="text-muted m-0">Drag image here</Paragraph>
          <Paragraph className="text-muted m-0">Or</Paragraph>
          <Button
            type="link"
            className="text-muted m-0"
            onClick={() => inpRef.current.click()}
          >
            Browse image
          </Button>
        </div>
      </label>

      <Form
        onFinish={addNewSupplier}
        layout="vertical"
        form={form}
        disabled={isLoading}
      >
        <Form.Item
          label="Supplier name"
          name={"name"}
          rules={[
            {
              required: true,
              message: "Enter supplier name",
            },
          ]}
        >
          <Input placeholder="Enter supplier name" allowClear />
        </Form.Item>
        <Form.Item label="Product" name={"product"}>
          <Input placeholder="Enter product" allowClear />
        </Form.Item>
        <Form.Item label="Email Address" name={"email"}>
          <Input placeholder="Enter email" type="email" allowClear />
        </Form.Item>
        <Form.Item label="Active" name={"active"}>
          <Input placeholder="" type="number" allowClear />
        </Form.Item>
        <Form.Item label="Category" name={"categories"}>
          <TreeSelect
            treeData={categories}
            placeholder="Enter product category"
            allowClear
          />
        </Form.Item>
        <Form.Item label="Buying Price" name={"price"}>
          <Input placeholder="Enter buying price" type="number" allowClear />
        </Form.Item>
        <Form.Item label="Contact Number" name={"contact"}>
          <Input placeholder="Enter supplier contact number" allowClear />
        </Form.Item>

        <Form.Item label="Type">
          <Button
            type={isTaking === false ? "primary" : "default"}
            onClick={() => setIsTaking(false)}
          >
            Not taking return
          </Button>
          <Button
            onClick={() => setIsTaking(true)}
            type={isTaking ? "primary" : "default"}
            className="ml-4 d-inline-block"
          >
            Taking return
          </Button>
        </Form.Item>
      </Form>
      <input
        ref={inpRef}
        className="d-none"
        type="file"
        id="inpFile"
        accept="image/*"
        onChange={(val: any) => setFile(val.target.files[0])}
      />
    </Modal>
  );
};

export default ToogleSupplier;
