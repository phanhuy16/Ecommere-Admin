export interface SupplierModel {
  id: string
  category_id: string
  name: string
  slug: string
  product: string
  category: string[]
  price: number
  contact: string
  isTalking: boolean
  email: string
  active: number
  photoUrl: string
  created_at: string
  updated_at: string
  index: number
}