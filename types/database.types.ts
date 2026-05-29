export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          title: string;
          ingredients: string[];
          instructions: string[];
          cooking_time: number | null;
          difficulty: "easy" | "medium" | "hard" | null;
          category: string | null;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          title: string;
          ingredients?: string[];
          instructions?: string[];
          cooking_time?: number | null;
          difficulty?: "easy" | "medium" | "hard" | null;
          category?: string | null;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          title?: string;
          ingredients?: string[];
          instructions?: string[];
          cooking_time?: number | null;
          difficulty?: "easy" | "medium" | "hard" | null;
          category?: string | null;
          image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      recipe_likes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          recipe_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          recipe_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          recipe_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recipe_likes_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      recipe_comments: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          recipe_id: string;
          body: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          recipe_id: string;
          body: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          recipe_id?: string;
          body?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recipe_comments_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
