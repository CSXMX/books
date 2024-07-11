function ListNode(val = undefined, next = undefined) {
  this.val = val;
  this.next = next;
}
function createList(arr = []) {
  let head = new ListNode(-1);
  let tail = head;
  for (let item of arr) {
    let node = new ListNode(item);
    tail.next = node;
    tail = tail.next;
  }
  return head.next;
}
const list = createList([1, 2, 3]);

const reverseList = (root) => {
  let pre = null;
  let cur = root;
  while (cur) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return pre;
};
console.log(reverseList(list));
