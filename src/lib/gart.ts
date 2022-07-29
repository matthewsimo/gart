export const noOp = () => ({});

export const getSeed = () => Date.now();

export const randomGenerator = function* (seed: number): Generator<number, number, number> {
	let value = Number(seed);
	while (true) {
		value = (value * 16807) % 2147483647;
		yield value;
	}
};

export const constrainRand = (rand: number, min: number, max: number): number => {
	return (rand % max) + min;
};
