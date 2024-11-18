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
  categoryId: string
  category: Category
  products: any[]
}

export interface Category {
  id: string
  title: string
  slug: string
  parentId: any
  description: string
  createdAt: string
  updatedAt: string
  products: any[]
  suppliers: any[]
}
