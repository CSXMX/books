var removeNthFromEnd = function (head, n) {
  let newhead = new ListNode(-1, head);
  let slow = (fast = newhead);
  while (n--) {
    fast = fast.next;
  }
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return newhead.next;
};
