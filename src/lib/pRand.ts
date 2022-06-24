export const pRand = function* (seed: number | string): Generator<number, number, number> {
	let value = Number(seed);
	while (true) {
		value = (value * 16807) % 2147483647;
		yield value;
	}
};
