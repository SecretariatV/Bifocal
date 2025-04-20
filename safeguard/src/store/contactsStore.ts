import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { contacts as initialContacts } from '../data/contacts'

export interface Contact {
  id: number;
  name: string;
  risk: 'low' | 'medium' | 'high';
  phone?: string;
  email?: string;
  relationship?: string;
  isSelected?: boolean;
}

interface ContactsState {
  contacts: Contact[];
  selectedContacts: Contact[];
  updateContactRelationship: (contactId: number, relationship: string) => void;
  setSelectedContacts: (contacts: Contact[]) => void;
  clearSelectedContacts: () => void;
  resetStore: () => void;
}

const useContactsStore = create<ContactsState>()(
  persist(
    (set) => ({
      contacts: initialContacts,
      selectedContacts: [],
      updateContactRelationship: (contactId: number, relationship: string) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === contactId
              ? { ...contact, relationship }
              : contact
          ),
          selectedContacts: state.selectedContacts.map((contact) =>
            contact.id === contactId
              ? { ...contact, relationship }
              : contact
          )
        }));
      },
      setSelectedContacts: (contacts: Contact[]) => {
        set({ selectedContacts: contacts });
      },
      clearSelectedContacts: () => {
        set({ selectedContacts: [] });
      },
      resetStore: () => {
        set({ contacts: initialContacts, selectedContacts: [] });
      }
    }),
    {
      name: 'contacts-storage',
    }
  )
)

export default useContactsStore 