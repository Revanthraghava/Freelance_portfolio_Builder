
import { supabase } from './supabase';
import { PortfolioData } from '../types';

export const portfolioService = {
  async getPortfolios() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getPortfolioById(id: string) {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createPortfolio(portfolio: PortfolioData) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Use upsert to prevent duplicate key errors if an ID is somehow present
    const { data, error } = await supabase
      .from('portfolios')
      .upsert([{
        user_id: user.id,
        content: portfolio,
        updated_at: new Date().toISOString()
      }], { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePortfolio(id: string, portfolio: PortfolioData) {
    const { data, error } = await supabase
      .from('portfolios')
      .update({
        content: portfolio,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePortfolio(id: string) {
    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
