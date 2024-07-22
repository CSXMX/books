var sortArray = function (nums) {
    function partition(l, r) {
        let pivot = nums[l];
        while (l < r) {
            while (l < r && pivot <= nums[r]) {
                r--;
            }
            nums[l] = nums[r];
            while (l < r && nums[l] <= pivot) {
                l++;
            }
            nums[r] = nums[l];
        }
        nums[l] = pivot;
        return l;
    }
    function quickSort(l, r) {
        if (l < r) {
            let pivot = partition(l, r);
            quickSort(l, pivot - 1);
            quickSort(pivot + 1, r);
        }
    }
    quickSort(0, nums.length - 1)
    return nums
};
// 数组的第K个最大元素
var findKthLargest = function (nums, k) {
    const swap = (i, j) => {
        let t = nums[i];
        nums[i] = nums[j];
        nums[j] = t;
    }
    const buildHeap = (i, len) => {
        let l = 2 * i + 1;
        let r = 2 * i + 2;
        let max = i;
        if (l < len && nums[l] > nums[max]) {
            max = l;
        }
        if (r < len && nums[r] > nums[max]) {
            max = r;
        }
        if (max !== i) {
            swap(i, max);
            buildHeap(max, len);
        }
    }
    let len = nums.length;
    for (let i = Math.floor(len / 2) ; i >= 0; i--) {
        buildHeap(i, len);
    }
    // k - 1 次 与 0 交换 再从0开始挪动, 条件为 i > nums.length - k
    // (nums.length -k , nums.length - 1] === k - 1 次
    // 如果是完整的堆排序，则为 nums.length - 1次交换，条件为 i > 0
    for (let i = nums.length - 1; i > nums.length - k; i--) {
        swap(0, i);
        buildHeap(0, --len);
    }
    return nums[0];
}
function bubbleSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
function insertionSort(arr) {
    let len = arr.length;
    for (let i = 1; i < len; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}
function selectionSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    return arr;
}
function mergeSort(arr) {
    if (arr.length < 2) {
        return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [];
    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    return result.concat(left, right);
}
function shellSort(arr) {
    let n = arr.length;
    let gap = Math.floor(n / 2);
    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            let temp = arr[i];
            let j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
        gap = Math.floor(gap / 2);
    }
    return arr;
}
function radixSort(arr) {
    const maxNum = Math.max(...arr);
    const maxDigits = Math.floor(Math.log10(maxNum)) + 1;

    for (let digit = 0; digit < maxDigits; digit++) {
        const buckets = Array.from({length: 10}, () => []);

        // 按照当前位的数字分配到对应的桶中
        arr.forEach(num => {
            const bucketIndex = Math.floor((num / Math.pow(10, digit)) % 10);
            buckets[bucketIndex].push(num);
        });

        // 将桶中的数字收集回原数组，准备下一轮分配
        arr = [].concat(...buckets);
    }

    return arr;
}