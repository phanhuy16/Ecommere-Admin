import { FormItemModel } from "@/models/FormModel";
import { Checkbox, Form, Input, Select } from "antd";

interface Props {
  item: FormItemModel;
}

const FormItem = (props: Props) => {
  const { item } = props;

  const renderInput = (item: FormItemModel) => {
    let content = <></>;
    switch (item.type) {
      case "checkbox":
        content = <Checkbox />;
        break;
      case "select":
        content = <Select options={item.lockup_item ?? []} />;
        break;
      default:
        content = (
          <Input type={item.type} placeholder={item.placeholder} allowClear />
        );
        break;
    }
    return content;
  };

  return (
    <Form.Item
      key={item.key}
      name={item.value}
      label={item.label}
      rules={[
        {
          required: item.required,
          message: item.message,
        },
      ]}
    >
      {renderInput(item)}
    </Form.Item>
  );
};

export default FormItem;
