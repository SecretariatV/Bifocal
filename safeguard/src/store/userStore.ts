import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useContactsStore from './contactsStore';

interface UserState {
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
  setUser: (name: string, email: string, phone: string) => void;
  login: () => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: '',
      email: '',
      phone: '',
      isLoggedIn: false,
      setUser: (name: string, email: string, phone: string) => set({ name, email, phone }),
      login: () => set({ isLoggedIn: true }),
      logout: () => {
        // Clear user data
        set({ isLoggedIn: false, name: '', email: '', phone: '' });
        // Clear selected contacts
        useContactsStore.getState().clearSelectedContacts();
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore; 