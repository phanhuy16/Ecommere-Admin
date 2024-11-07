
export interface SelectModel {
  label: string
  value: string
}

export interface TreeModel {
  label: string
  value: string
  children?: SelectModel[]
}