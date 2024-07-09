// https://leetcode.cn/problems/add-two-numbers

function ListNode(val, next) {
  this.val = val ? val : 0;
  this.next = next ? next : null;
}
var addTwoNumbers = function (l1, l2) {
  let add = 0;
  let head = new ListNode(-1);
  let tail = head;
  while (l1 || l2) {
    let a = l1 ? l1.val : 0;
    let b = l2 ? l2.val : 0;
    let sum = a + b + add;
    add = Math.floor(sum / 10);
    let node = new ListNode(sum % 10);
    tail.next = node;
    tail = tail.next;
    l1 = l1 && l1.next;
    l2 = l2 && l2.next;
  }
  if (add > 0) {
    tail.next = new ListNode(1);
  }
  return head.next;
};
