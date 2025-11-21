// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase connection configuration.
 * Add these to your .env file:
 * 
 * VITE_SUPABASE_URL=https://xxxxx.supabase.co
 * VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get or create Supabase client singleton
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  // Skip if placeholder values
  if (!supabaseUrl || 
      !supabaseAnonKey || 
      supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL' ||
      supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn('⚠️ Supabase credentials not configured. Running in MOCK mode.');
    console.info('💡 Edit .env file and add your Supabase credentials to connect to real database');
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
      console.log('✅ Supabase client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error);
      return null;
    }
  }

  return supabaseInstance;
};

/**
 * Check if app is running with real Supabase backend
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL' &&
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
  );
};
