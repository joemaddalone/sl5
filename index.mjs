const round25 = (val) => Math.ceil(val / 2.5) * 2.5;
const round5 = (val) => Math.ceil(val / 5) * 5;

export default class SL {
	constructor(weight, lift) {
		this.weight = parseInt(weight, 0)
		this.lift = lift
		if (isNaN(this.weight)) {
			throw new Error('Weight must be a number')
		}
		if(!['squat', 'bench', 'deadlift', 'row', 'press'].includes(this.lift)) {
			throw new Error('Lift must be one of squat, bench, deadlift, row, or press')
		}
		this.bar = 45
		this.plates = [
			{ weight: 45, count: 8 },
			{ weight: 35, count: 4 },
			{ weight: 25, count: 4 },
			{ weight: 10, count: 4 },
			{ weight: 5, count: 8 },
			{ weight: 2.5, count: 4 },
			{ weight: 1.25, count: 4 },
			{ weight: 0.5, count: 8 },
		]
	}

	warmups() {
		const percentage = this.weight < 200 ? [0.65, 0.85] : [0.45, 0.65, 0.85]
		let count = 0
		return percentage.map((p, index) => {
			const weight = round5(this.weight * p)
			if(weight < 135 && this.lift === 'deadlift') {
				return
			}
			count++
			return { name: `Warm ${count}`, reps: 5, weight, plates: this.calcPlates(weight) }
		})
	}

	workingWeight() {
		const weight = round25(this.weight)
		return { name: 'Work', reps: 5, weight, plates: this.calcPlates(weight) }
	}

	calcPlates(totalWeight) {
		if (totalWeight <= this.bar) {
			return ["no plates"];
		}
		let oneSide = (totalWeight - this.bar) / 2;
		const result = [];
		for (let i = 0; i < this.plates.length; i++) {
			const plate = this.plates[i];
			if (oneSide < plate.weight) {
				continue;
			} else {
				let count = 0;
				let available = plate.count;
				while (count < Math.floor(oneSide / plate.weight)) {
					count++;
					result.push(plate.weight);
				}
				oneSide = oneSide % plate.weight;
			}
		}
		return result;
	};

	workout() {
		const workingLifts = [
			{...this.workingWeight(), name: 'Work 1'},
			{...this.workingWeight(), name: 'Work 2'},
			{...this.workingWeight(), name: 'Work 3'},
			{...this.workingWeight(), name: 'Work 4'},
			{...this.workingWeight(), name: 'Work 5'}
		]
		const plan = {
			lift: this.lift,
			weight: this.weight,
			sets: [...this.warmups().filter(x => x), ...workingLifts]
		}
		if (this.lift !== 'deadlift' && this.lift !== 'row') {
			plan.sets.unshift({
				name: 'Warm B',
				reps: 5,
				weight: this.bar,
			})
			plan.sets.unshift({
				name: 'Warm A',
				reps: 5,
				weight: this.bar,
			})
		}
		return plan
	}
}
