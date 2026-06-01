export interface CategoryBudget {
  id: string;
  amount: number;
  month: string;

  categoryId: string;
  userId: string;

  spent?: number;

  category?: {
    id: string;
    name: string;
  };
}

export interface categoryBudgetState {
    categoryBudgets: CategoryBudget[]
}