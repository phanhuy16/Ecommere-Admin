import { FormLayout } from "antd/es/form/Form";

export interface FormItemModel {
  key: string
  value: string
  label: string
  placeholder: string
  type: 'default' | 'select' | 'number' | 'email' | 'tel' | 'file' | 'checkbox'
  required: boolean
  message: string
  default_value: string
  lockup_item: SelectModel[]
  displayLength: number
}

export interface FormModel {
  title: string;
  layout?: FormLayout;
  labelCol: number;
  wrapperCol: number;
  formItem: FormItemModel[];
}

export interface SelectModel {
  label: string
  value: string
}

export interface TreeModel {
  label: string
  value: string
  children?: SelectModel[]
}