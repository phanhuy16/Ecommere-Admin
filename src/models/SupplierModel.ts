export interface SupplierModel {
  id: string
  name: string
  slug: string
  price: number
  product: string
  contact: string
  isTalking: boolean
  email: string
  active: number
  image: string
  createdAt: string
  updatedAt: string
  supplierCategory: any[]
  products: any[]
}