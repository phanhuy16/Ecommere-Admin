import handleAPI from "@/apis/handleAPI";
import { SelectModel } from "@/models/SelectModel";
import {
  Button,
  Card,
  Empty,
  Form,
  message,
  Select,
  Slider,
  Space,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

export interface FilterProductValue {
  color?: string;
  categories?: string[];
  size?: string;
  price?: number[];
}

interface Props {
  onFilter: (vals: FilterProductValue) => void;
}

const FilterProduct = (props: Props) => {
  const { onFilter } = props;

  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [selectDatas, setSelectDatas] = useState<{
    categories: SelectModel[];
    colors: SelectModel[];
    sizes: SelectModel[];
    prices: number[];
  }>();
  const [colorSelected, setColorSelected] = useState<string[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);

    try {
      await getCategories();
      await getFilterValues();
    } catch (error:any) {
     message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangeValue = (key: string, val: any) => {
    const items: any = { ...selectDatas };

    items[`${key}`] = val;

    setSelectDatas(items);
  };

  const getCategories = async () => {
    const res: any = await handleAPI(`/Categories/get-all`);

    const data =
      res && res.length > 0
        ? res.map((item: any) => ({
            label: item.title,
            value: item.id,
          }))
        : [];

    handleChangeValue("categories", data);
  };

  const getFilterValues = async () => {
    const res: any = await handleAPI("/Products/get-all-values");

    const colors = res.data.colors.map((item: any) => ({
      label: item,
      value: item,
    }));

    const sizes = res.data.sizes.map((item: any) => ({
      label: item,
      value: item,
    }));

    setSelectDatas((prev: any) => ({
      ...prev,
      colors: colors,
      sizes: sizes,
      prices: res.data.prices,
    }));
  };

  const handleFilter = (values: any) => {
    onFilter({ ...values, colors: colorSelected });
  };

  return (
    <Card
      title="Filter"
      className="filter-card"
      style={{ width: 320 }}
      size="small"
    >
      {isLoading ? (
        <Spin />
      ) : selectDatas ? (
        <>
          <Form form={form} layout="vertical" onFinish={handleFilter}>
            <Form.Item name={"categories"} label="Categories">
              <Select
                style={{ width: "100%" }}
                placeholder="Select category"
                options={selectDatas.categories}
                allowClear
                mode="multiple"
              />
            </Form.Item>
            <>
              {selectDatas.colors && selectDatas.colors.length > 0 && (
                <Space wrap className="mb-3">
                  {selectDatas.colors.map((color) => (
                    <Button
                      onClick={() => {
                        const items = [...colorSelected];
                        const index = items.findIndex(
                          (element) => element === color.value
                        );
                        if (index !== -1) {
                          items.splice(index, 1);
                        } else {
                          items.push(color.value);
                        }
                        setColorSelected(items);
                      }}
                      key={color.value}
                      style={{
                        borderColor: colorSelected.includes(color.value)
                          ? color.value
                          : undefined,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          border: 8,
                          background: color.value,
                          borderRadius: 2,
                        }}
                      />
                      <Typography.Text style={{ color: color.value }}>
                        {color.label}
                      </Typography.Text>
                    </Button>
                  ))}
                </Space>
              )}
            </>
            <Form.Item name={"size"} label="Size">
              <Select
                options={selectDatas.sizes}
                allowClear
                placeholder="Size select"
              />
            </Form.Item>
            {selectDatas.prices && selectDatas.prices.length > 0 && (
              <Form.Item name={"price"} label="Price">
                <Slider
                  range
                  min={Math.min(...selectDatas.prices)}
                  max={Math.max(...selectDatas.prices)}
                />
              </Form.Item>
            )}
          </Form>
          <div className="mt-4 text-right">
            <Button type="primary" onClick={() => form.submit()}>
              Filter
            </Button>
          </div>
        </>
      ) : (
        <Empty />
      )}
    </Card>
  );
};

export default FilterProduct;
