
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

    const { data, error } = await supabase
      .from('portfolios')
      .insert([{
        user_id: user.id,
        content: portfolio
      }])
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
