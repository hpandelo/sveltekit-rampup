import type { RecordSubscription } from 'pocketbase';
import { pb } from './pocketbase';

export const addMessage = async (message: AddMessage) => {
	try {
		return await pb.collection<Message>('messages').create(message);
	} catch (error) {
		console.error('Error adding message:', error);
		throw error;
	}
};

export const deleteMessage = async (id: string) => {
	try {
		return await pb.collection<Message>('messages').delete(id);
	} catch (error) {
		console.error('Error deleting message:', error);
		throw error;
	}
};

export const getMessages = async () => {
	try {
		const result = await pb.collection<Message>('messages').getFullList({
			sort: 'created'
		});
		return result;
	} catch (error) {
		console.error('Error getting messages:', error);
		throw error;
	}
};

export const subscribeToMessages = (callback: (data: RecordSubscription<Message>) => void) =>
	pb.collection<Message>('messages').subscribe('*', callback);
