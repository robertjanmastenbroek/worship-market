export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'leader' | 'partner' | 'admin'
export type ProductType = 'service' | 'asset' | 'knowledge'
export type OrderStatus = 'pending' | 'in_progress' | 'revision' | 'completed' | 'cancelled'
export type MessageSender = 'buyer' | 'seller' | 'system'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: UserRole
          bio: string | null
          avatar_url: string | null
          verified: boolean
          statement_of_faith_agreed: boolean
          statement_of_faith_agreed_at: string | null
          stripe_connect_id: string | null
          stripe_onboarding_complete: boolean
          total_earnings: number
          partner_score: number
          total_sales: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: UserRole
          bio?: string | null
          avatar_url?: string | null
          verified?: boolean
          statement_of_faith_agreed?: boolean
          statement_of_faith_agreed_at?: string | null
          stripe_connect_id?: string | null
          stripe_onboarding_complete?: boolean
          total_earnings?: number
          partner_score?: number
          total_sales?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: UserRole
          bio?: string | null
          avatar_url?: string | null
          verified?: boolean
          statement_of_faith_agreed?: boolean
          statement_of_faith_agreed_at?: string | null
          stripe_connect_id?: string | null
          stripe_onboarding_complete?: boolean
          total_earnings?: number
          partner_score?: number
          total_sales?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string
          type: ProductType
          category: string
          title: string
          description: string
          price: number
          image_url: string | null
          audio_url: string | null
          file_url: string | null
          file_size: string | null
          delivery_time: string | null
          requirements: string | null
          tags: string[] | null
          key: string | null
          bpm: number | null
          vibe: string | null
          views: number
          sales: number
          rating: number
          review_count: number
          active: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          type: ProductType
          category: string
          title: string
          description: string
          price: number
          image_url?: string | null
          audio_url?: string | null
          file_url?: string | null
          file_size?: string | null
          delivery_time?: string | null
          requirements?: string | null
          tags?: string[] | null
          key?: string | null
          bpm?: number | null
          vibe?: string | null
          views?: number
          sales?: number
          rating?: number
          review_count?: number
          active?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          type?: ProductType
          category?: string
          title?: string
          description?: string
          price?: number
          image_url?: string | null
          audio_url?: string | null
          file_url?: string | null
          file_size?: string | null
          delivery_time?: string | null
          requirements?: string | null
          tags?: string[] | null
          key?: string | null
          bpm?: number | null
          vibe?: string | null
          views?: number
          sales?: number
          rating?: number
          review_count?: number
          active?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          buyer_id: string
          seller_id: string
          product_id: string
          amount: number
          platform_fee: number
          seller_payout: number
          stripe_payment_intent_id: string | null
          status: OrderStatus
          delivered_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          buyer_id: string
          seller_id: string
          product_id: string
          amount: number
          platform_fee: number
          seller_payout: number
          stripe_payment_intent_id?: string | null
          status?: OrderStatus
          delivered_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          buyer_id?: string
          seller_id?: string
          product_id?: string
          amount?: number
          platform_fee?: number
          seller_payout?: number
          stripe_payment_intent_id?: string | null
          status?: OrderStatus
          delivered_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          order_id: string
          sender_id: string
          sender_type: MessageSender
          content: string
          attachment_url: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          sender_id: string
          sender_type: MessageSender
          content: string
          attachment_url?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          sender_id?: string
          sender_type?: MessageSender
          content?: string
          attachment_url?: string | null
          read?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          order_id: string
          product_id: string
          reviewer_id: string
          seller_id: string
          rating: number
          comment: string | null
          flagged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          reviewer_id: string
          seller_id: string
          rating: number
          comment?: string | null
          flagged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          reviewer_id?: string
          seller_id?: string
          rating?: number
          comment?: string | null
          flagged?: boolean
          created_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          requester_id: string
          title: string
          description: string
          category: string
          budget: number | null
          deadline: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          title: string
          description: string
          category: string
          budget?: number | null
          deadline?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          title?: string
          description?: string
          category?: string
          budget?: number | null
          deadline?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      request_replies: {
        Row: {
          id: string
          request_id: string
          partner_id: string
          message: string
          proposed_price: number | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          partner_id: string
          message: string
          proposed_price?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          partner_id?: string
          message?: string
          proposed_price?: number | null
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_type: string
          reported_id: string
          reason: string
          details: string | null
          status: string
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_type: string
          reported_id: string
          reason: string
          details?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_type?: string
          reported_id?: string
          reason?: string
          details?: string | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      product_type: ProductType
      order_status: OrderStatus
      message_sender: MessageSender
    }
  }
}
