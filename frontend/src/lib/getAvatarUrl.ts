import crypto from 'crypto-js';

export const getAvatarUrl = async (email: string): Promise<string> => {
	const hash = crypto.SHA256(email).toString();
	const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=404`;
	const dicebarUrl = `https://api.dicebear.com/9.x/personas/svg?seed=${hash}`;

	try {
		const response = await fetch(gravatarUrl);
		if (response.ok) {
			return gravatarUrl;
		} else {
			throw new Error('Gravatar not found');
		}
	} catch {
		return dicebarUrl;
	}
};
