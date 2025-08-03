
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || '',
  role: localStorage.getItem('role') || '',
  login: (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    set({ token, role });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ token: '', role: '' });
  },
}));

export default useAuthStore;
