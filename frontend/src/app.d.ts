// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type Nullable<T> = T | null;

	type User = {
		id: string;
		email: string;
		avatarUrl: string;
		username: string;
	};

	type AddUser = Omit<User, 'id'> & {
		password: string;
		passwordConfirm: string;
	};

	type Message = {
		id: string;
		user: User;
		message: string;
		date: Date;
	};

	type AddMessage = Omit<Message, 'id'>;
}

export {};
