import handleAPI from "@/apis/handleAPI";
import { ModalCategory } from "@/modals";
import { SelectModel, TreeModel } from "@/models/FormModel";
import { getTreeValues } from "@/utils/getTreeValues";
import { replaceName } from "@/utils/replaceName";
import { uploadFile } from "@/utils/uploadFile";
import { Editor } from "@tinymce/tinymce-react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
  TreeSelect,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { Add } from "iconsax-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const { Title } = Typography;

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [supplierOptions, setSupplierOptions] = useState<SelectModel[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  const [isVisibleAddCategory, setIsVisibleAddCategory] = useState(false);
  const [categories, setCategories] = useState<TreeModel[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  const editorRef = useRef<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (id) {
      getProductDetail(id);
    }
  }, [id]);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getSuppliers();
      await getCategories();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductDetail = async (id: string) => {
    const api = `/Products/get-by-id?id=${id}`;
    try {
      const res: any = await handleAPI(api);
      const item = res;

      if (item) {
        form.setFieldsValue({
          ...item,
          categories: item.productCategories.map((pc: any) => pc.categoryId),
        });

        setContent(item.content);

        if (item.images && item.images.length > 0) {
          const items = [...fileList];
          item.images.forEach((url: string) =>
            items.push({
              uid: `${Math.floor(Math.random() * 1000)}`,
              name: url,
              status: "done",
              url,
            })
          );

          setFileList(items);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewProduct = async (values: any) => {
    const content = editorRef.current.getContent();
    const data: any = {};

    setIsCreating(true);

    for (const i in values) {
      data[`${i}`] = values[i] ?? "";
    }

    data.content = content;

    data.slug = replaceName(values.title);

    data.productCategories = values.categories?.length
      ? values.categories.map((categoryId: any) => ({ categoryId }))
      : [];

    let urls: string[] = [];
    // Kiểm tra nếu có file ảnh
    if (fileList.length > 0) {
      const uploadPromises = fileList.map(async (file) => {
        if (file.originFileObj) {
          const url = await uploadFile(file.originFileObj);
          return url;
        } else {
          urls.push(file.url);
        }
      });

      // Đợi tất cả các ảnh được tải lên
      const uploadedUrls = await Promise.all(uploadPromises);

      // Gán các URL đã upload vào data
      data.images = [...urls, ...uploadedUrls.filter((url) => url)];
    }

    console.log(data);

    try {
      await handleAPI(
        `/Products/${id ? `update/${id}` : "add-new"}`,
        data,
        id ? "put" : "post"
      );
      window.history.back();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsCreating(false);
    }
  };

  const getSuppliers = async () => {
    const api = "/Suppliers/get-all";
    const res = await handleAPI(api);

    const data: any = res;

    const options = data.map((item: any) => ({
      value: item.id,
      label: item.name,
    }));

    setSupplierOptions(options);
  };

  const getCategories = async () => {
    const api = `/Categories/get-all`;
    const res: any = await handleAPI(api);

    const datas = res;

    const data = datas.length > 0 ? getTreeValues(datas, true) : [];
    setCategories(data);
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

  return isLoading ? (
    <Spin fullscreen />
  ) : (
    <div>
      <div className="container">
        <Title level={3}>{id ? "Update Product" : "Add New Product"}</Title>
        <Form
          disabled={isCreating}
          size="large"
          form={form}
          onFinish={handleAddNewProduct}
          layout="vertical"
        >
          <div className="row">
            <div className="col-8">
              <Form.Item
                name={"title"}
                label="Title"
                rules={[
                  {
                    required: true,
                    message: "Please enter product title",
                  },
                ]}
              >
                <Input allowClear maxLength={150} showCount />
              </Form.Item>
              <Form.Item name={"description"} label="Description">
                <Input.TextArea
                  rows={4}
                  maxLength={1000}
                  showCount
                  allowClear
                />
              </Form.Item>
              <Editor
                disabled={isLoading || isCreating}
                apiKey="rsvkoql7v4bunin8bxgc1xfrstyxh9hixvnqhbcv7wqh6z4i"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={content !== "" ? content : ""}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "link",
                    "lists",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "inserdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks |" +
                    "bold italic forecolor | alignleft aligncenter" +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family: Arial, Helvetica, sans-serif; font-size: 14px; }",
                }}
              />
            </div>
            <div className="col-4">
              <Card size="small" className="mt-4">
                <Space>
                  <Button
                    loading={isCreating}
                    size="middle"
                    onClick={() => form.submit()}
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={isCreating}
                    size="middle"
                    type="primary"
                    onClick={() => form.submit()}
                  >
                    {id ? "Update" : "Submit"}
                  </Button>
                </Space>
              </Card>
              <Card size="small" className="mt-3" title="Categories">
                <Form.Item name={"categories"}>
                  <TreeSelect
                    disabled={isCreating}
                    treeData={categories}
                    multiple
                    dropdownRender={(menu) => (
                      <>
                        {menu}

                        <Divider className="m-0" />
                        <Button
                          onClick={() => setIsVisibleAddCategory(true)}
                          type="link"
                          icon={<Add />}
                          style={{ padding: "0 16px" }}
                        >
                          Add new
                        </Button>
                      </>
                    )}
                  />
                </Form.Item>
              </Card>
              <Card size="small" className="mt-3" title="Suppliers">
                <Form.Item
                  name={"supplier"}
                  rules={[
                    {
                      required: true,
                      message: "Required",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      replaceName(option?.label ? option.label : "").includes(
                        replaceName(input)
                      )
                    }
                    options={supplierOptions}
                  />
                </Form.Item>
              </Card>
              <Card size="small" className="mt-3" title="Images">
                <Upload
                  fileList={fileList}
                  listType="picture-card"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                >
                  Upload
                </Upload>
              </Card>
              <Card className="mt-3">
                <Input
                  allowClear
                  className="mb-3"
                  value={fileUrl}
                  onChange={(val) => setFileUrl(val.target.value)}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (files: any) => {
                    const file = files.target.files[0];

                    if (file) {
                      const donwloadUrl = await uploadFile(file);
                      donwloadUrl && setFileUrl(donwloadUrl);
                    }
                  }}
                />
              </Card>
            </div>
          </div>
        </Form>
      </div>
      <ModalCategory
        visible={isVisibleAddCategory}
        onClose={() => setIsVisibleAddCategory(false)}
        onAddNew={async (_val) => {
          await getCategories();
        }}
        values={categories}
      />
    </div>
  );
};

export default AddProduct;
