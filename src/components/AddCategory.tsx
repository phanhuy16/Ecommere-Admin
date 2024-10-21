import handleAPI from "@/apis/handleAPI";
import { TreeModel } from "@/models/FormModel";
import { CategoryModel } from "@/models/Products";
import { replaceName } from "@/utils/replaceName";
import { Button, Form, Input, message, Space, TreeSelect } from "antd";
import { useEffect, useState } from "react";

interface Props {
  onAddNew: (val: any) => void;
  values: TreeModel[];
  seleted?: CategoryModel;
  onClose?: () => void;
}

const AddCategory = (props: Props) => {
  const { values, onAddNew, seleted, onClose } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (seleted) {
      form.setFieldsValue(seleted);
    } else {
      form.resetFields();
    }
  }, [seleted]);

  const handleCategory = async (values: any) => {
    setIsLoading(true);
    const api = seleted
      ? `/Categories/update/${seleted.id}`
      : `/Categories/add-new`;

    const data: any = {};

    for (const i in values) {
      data[i] = values[i] ?? null;
    }

    data.slug = replaceName(values.title);

    try {
      const res: any = await handleAPI(api, data, seleted ? "put" : "post");

      if (!res.isSuccess) {
        message.error(res.message);
      } else {
        message.success(res.message);
        onAddNew(res.data);
      }

      form.resetFields();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form
        disabled={isLoading}
        layout="vertical"
        form={form}
        onFinish={handleCategory}
        size="large"
      >
        <Form.Item name={"parentId"} label="Parent category">
          <TreeSelect
            treeData={values}
            allowClear
            showSearch
            treeDefaultExpandAll
          />
        </Form.Item>
        <Form.Item
          name={"title"}
          label="Title"
          rules={[
            {
              required: true,
              message: "Enter category title",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item name={"description"} label="Description">
          <Input.TextArea rows={4} allowClear />
        </Form.Item>
      </Form>

      <div className="text-right">
        <Space>
          {onClose && (
            <Button
              loading={isLoading}
              disabled={isLoading}
              onClick={() => {
                form.resetFields();
                onClose();
              }}
            >
              Cancel
            </Button>
          )}

          <Button
            loading={isLoading}
            disabled={isLoading}
            type="primary"
            onClick={() => form.submit()}
          >
            {seleted ? "Update" : "Submit"}
          </Button>
        </Space>
      </div>
    </>
  );
};

export default AddCategory;
