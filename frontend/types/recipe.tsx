export interface Recipe {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_name: string;
  category_id: number;
  recipe_ingredients: RecipeIngredent[];
}

export interface RecipeIngredent {
  product_id: number
  product_name: string;
  quantity: number;
  unit_id: number;
  unit_name: string;
}
