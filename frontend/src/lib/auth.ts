import { pb } from './pocketbase';

export const login = async (inputEmail: string, password: string) => {
	const authResponse = await pb.collection<User>('users').authWithPassword(inputEmail, password);
	const { id, username, email, avatarUrl } = authResponse.record;
	return { id, username, email, avatarUrl };
};

export const register = async (user: AddUser) => {
	console.log('Registering', { user });
	const authResponse = await pb.collection<User>('users').create({ ...user });
	const { id, username, email, avatarUrl } = authResponse;
	return { id, username, email, avatarUrl };
};

export const logout = async () => {
	return pb.authStore.clear();
};
