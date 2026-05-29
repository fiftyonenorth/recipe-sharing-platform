export interface Recipe {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cooking_time: number | null;
  difficulty: Difficulty | null;
  category: string | null;
  author: string;
  author_avatar_url: string | null;
  image_url: string | null;
}

export type RecipeCategory =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert"
  | "snack"
  | "drink";

export type Difficulty = "easy" | "medium" | "hard";

export interface RecipeInput {
  title: string;
  ingredients: string[];
  instructions: string[];
  cooking_time?: number | null;
  difficulty?: Difficulty | null;
  category?: string | null;
}

export interface RecipeComment {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  recipe_id: string;
  body: string;
  author: string;
  author_avatar_url: string | null;
}

export interface RecipeSocialStats {
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
}
