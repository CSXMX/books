const customIterable = {
  data: [1, 2, 3, 4, 5],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          const value = this.data[index];
          index++;
          return { value, done: false };
        } else {
          return { done: true };
        }
      },
    };
  },
};

for (const item of customIterable) {
  console.log(item);
}
