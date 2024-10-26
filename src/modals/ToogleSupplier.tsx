import { colors } from "@/constants/color";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Typography,
} from "antd";
import { PiUserLight } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "@/utils/uploadFile";
import { replaceName } from "@/utils/replaceName";
import handleAPI from "@/apis/handleAPI";
import { SupplierModel } from "@/models/SupplierModel";
import { FormModel } from "@/models/FormModel";
import FormItem from "@/components/FormItem";

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
  const [isGetting, setIsGetting] = useState(false);
  const [formData, setFormData] = useState<FormModel>();
  const [isTalking, setIsTalking] = useState<boolean>();
  const [file, setFile] = useState<any>();

  const [form] = Form.useForm();
  const inpRef = useRef<any>();

  useEffect(() => {
    getFormData();
  }, []);

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier);
      setIsTalking(supplier.isTalking === true);
    }
  }, [supplier]);

  const addNewSupplier = async (values: any) => {
    setIsLoading(true);

    const data: any = {};
    const api = `/Suppliers/${supplier ? `update/${supplier.id}` : "add-new"}`;

    for (const i in values) {
      data[i] = values[i] ?? "";
    }

    data.category_id = values.category_id ? values.category_id : null;
    data.price = values.price ? parseInt(values.price) : 0;
    data.isTalking = isTalking ? true : false;

    if (file) {
      data.photoUrl = await uploadFile(file);
    }

    data.slug = replaceName(values.name);

    try {
      const res: any = await handleAPI(api, data, supplier ? "put" : "post");
      console.log(res);
      if (res.httpStatusCode === 400) {
        message.error(res.message);
      } else {
        message.success(res.message);
        !supplier && onAddNew(res);
        handleClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFormData = async () => {
    const api = `/Suppliers/get-form`;
    setIsGetting(true);
    try {
      const res: any = await handleAPI(api);
      res.value.form && setFormData(res.value.form);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGetting(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFile(undefined);
    onClose();
  };

  return (
    <Modal
      loading={isGetting}
      closable={!isLoading}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{
        loading: isLoading,
      }}
      title={supplier ? "Update" : "Add Supplier"}
      okText={supplier ? "Update" : "Add Supplier"}
      cancelText="Discard"
    >
      <label htmlFor="inpFile" className="p-2 mb-3 d-flex align-items-center">
        {file ? (
          <Avatar size={100} src={URL.createObjectURL(file)} />
        ) : supplier ? (
          <Avatar size={100} src={supplier.photoUrl} />
        ) : (
          <Avatar
            size={100}
            style={{
              backgroundColor: "white",
              border: "1px dashed #e0e0e0",
            }}
          >
            <PiUserLight size={60} color={colors.gray600} />
          </Avatar>
        )}
        <div className="ml-3 text-center">
          <Paragraph className="text-muted m-0">Drag image here</Paragraph>
          <Paragraph className="text-muted m-0 mt-1">Or</Paragraph>
          <Button onClick={() => inpRef.current.click()} type="link">
            Browse image
          </Button>
        </div>
      </label>
      {formData && (
        <Form
          disabled={isLoading}
          onFinish={addNewSupplier}
          layout={formData.layout}
          labelCol={{ span: formData.labelCol }}
          wrapperCol={{ span: formData.wrapperCol }}
          size="middle"
          form={form}
        >
          {formData.formItem.map((item) => (
            <FormItem item={item} />
          ))}
        </Form>
      )}
      <div className="d-none">
        <input
          ref={inpRef}
          accept="image/*"
          type="file"
          name=""
          id="inpFile"
          onChange={(val: any) => setFile(val.target.files[0])}
        />
      </div>
    </Modal>
  );
};

export default ToogleSupplier;
