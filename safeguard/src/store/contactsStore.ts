import { create, StateCreator } from 'zustand'
import { contacts as initialContacts } from '../data/contacts'

export interface Contact {
  id: number;
  name: string;
  risk: 'low' | 'medium' | 'high';
  phone?: string;
  email?: string;
  relationship?: string;
  customRelationship?: string;
}

interface ContactsStore {
  contacts: Contact[];
  updateContactRelationship: (contactId: number, relationship: string) => void;
  updateCustomRelationship: (contactId: number, customRelationship: string) => void;
}

type ContactsState = {
  contacts: Contact[];
}

type ContactsActions = {
  updateContactRelationship: (contactId: number, relationship: string) => void;
  updateCustomRelationship: (contactId: number, customRelationship: string) => void;
}

const useContactsStore = create<ContactsStore>((set: StateCreator<ContactsStore>) => ({
  contacts: initialContacts,
  updateContactRelationship: (contactId: number, relationship: string) =>
    set((state: ContactsStore) => ({
      contacts: state.contacts.map((contact: Contact) =>
        contact.id === contactId
          ? { ...contact, relationship }
          : contact
      ),
    })),
  updateCustomRelationship: (contactId: number, customRelationship: string) =>
    set((state: ContactsStore) => ({
      contacts: state.contacts.map((contact: Contact) =>
        contact.id === contactId
          ? { ...contact, customRelationship }
          : contact
      ),
    })),
}))

export default useContactsStore 