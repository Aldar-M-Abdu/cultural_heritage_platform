import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  role: localStorage.getItem('role') || 'guest',

  login: ({ userData, token, role }) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    set({ user: userData, token, isAuthenticated: true, role });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ user: null, token: null, isAuthenticated: false, role: 'guest' });
  },

  updateUser: (updatedUserData) => {
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    set((state) => ({ user: { ...state.user, ...updatedUserData } }));
  },
}));

export default useAuthStore;
