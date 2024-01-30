const arr = [1, 0, 2, 3, 6, 8];

const targetNum = 2;

const test = (targetNum, arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length - 1; j++) {
            if (arr[i] + arr[j] === targetNum) {
                return [i, j];
            }
        }
    }
}