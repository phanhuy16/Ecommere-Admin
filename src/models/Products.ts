export interface CategoryModel {
  id: string
  title: string
  slug: string
  parentId: string
  description: string
  createdAt: string
  updatedAt: any
  parent: any
  subCategories: any[]
  productCategories: any[]
  suppliers: any[]
}

export interface ProductModel {
  id: string
  title: string
  slug: string
  supplier: string
  description: string
  expiryDate: any
  createdAt: string
  updatedAt: any
  productCategories: any[]
  subProducts: SubProductModel[]
}

export interface SubProductModel {
  id: string
  color: string
  size: string
  qty: number
  price: number
  productid: string
  images: string[]
}
