export interface Category {
  id: string
  name: string
  icon?: string
  userId: string
}

export interface CategoryState {
  categories: Category[]
}