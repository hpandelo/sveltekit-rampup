import { writable } from 'svelte/store'

const storedUser = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
const initialUser = storedUser ? JSON.parse(storedUser) : { email: '', username: '', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg' };

export const user = writable<Nullable<User>>(initialUser);

user.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    if (value) {
      localStorage.setItem('user', JSON.stringify(value));
    } else {
      localStorage.removeItem('user');
    }
  }
});