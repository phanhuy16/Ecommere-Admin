export interface SupplierModel {
  id: string
  name: string
  slug: string
  product: string
  category: string[]
  price: number
  contact: string
  isTalking: boolean
  email: string
  active: number
  image: string
  created_at: string
  updated_at: string
}