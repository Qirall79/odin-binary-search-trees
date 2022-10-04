class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    this.arr = arr
      .sort((a, b) => a - b)
      .filter((item, index) => arr.indexOf(item) == index);
    this.root = this.buildTree(this.arr, 0, this.arr.length - 1);
  }
  // Create balanced tree
  buildTree(arr, start, end) {
    if (start > end) return null;
    let mid = parseInt((start + end) / 2);
    let node = new Node(arr[mid]);
    node.left = this.buildTree(arr, start, mid - 1);
    node.right = this.buildTree(arr, mid + 1, end);
    return node;
  }
  // Print full tree
  prettyPrint = (node = this.root, prefix = "", isLeft = true) => {
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  //Insert new node
  insert = (data, root = this.root) => {
    if (!root) {
      root = new Node(data);
      return root;
    }
    if (data < root.data) {
      root.left = this.insert(data, root.left);
    } else if (data > root.data) {
      root.right = this.insert(data, root.right);
    }
    return root;
  };

  // Delete node
  deleteNode = (data, root = this.root) => {
    if (!root) return root;

    if (data < root.data) {
      root.left = this.deleteNode(data, root.left);
    } else if (data > root.data) {
      root.right = this.deleteNode(data, root.right);
    } else {
      if (root.left == null) {
        return root.right;
      } else if (root.right == null) {
        return root.left;
      }

      root.data = this.minNode(root.right);
      root.right = this.deleteNode(root.data, root.right);
    }
    return root;
  };

  //Find minimum node value
  minNode = (root) => {
    let minim = root.data;
    while (root.left != null) {
      minim = root.left.data;
      root = root.left;
    }
    return minim;
  };

  //Find node
  findNode = (data, root = this.root) => {
    if (root == null || root.data == data) return root;

    return data < root.data
      ? this.findNode(data, root.left)
      : this.findNode(data, root.right);
  };

  // Traverse tree using Breadth-First
  levelOrder = (fn) => {
    if (this.root == null) return;
    let values = [];
    let queue = [];
    queue.push(this.root);
    values.push(this.root.data);

    while (queue.length > 0) {
      let current = queue[0];
      if (fn) {
        fn(current);
      } else {
        values.push(current.data);
      }
      if (current.left != null) queue.push(current.left);
      if (current.right != null) queue.push(current.right);
      queue.shift();
    }
    return values;
  };

  // Traverse tree using Depth-First
  preOrder(root = this.root, fn) {
    if (root == null) return;
    let arr = [];
    if (!fn) {
      arr.push(root.data);
      if (root.left == null && root.right == null) return arr;
      else if (root.right == null) return arr.concat(this.preOrder(root.left));
      else if (root.left == null) return arr.concat(this.preOrder(root.right));
      else
        return arr.concat(this.preOrder(root.left), this.preOrder(root.right));
    }
    fn(root);
    this.preOrder(root.left, fn);
    this.preOrder(root.right, fn);
  }

  inOrder(root = this.root, fn) {
    if (root == null) return;
    let arr = [];
    if (!fn) {
      arr.push(root.data);
      if (root.left == null && root.right == null) {
        return arr;
      } else if (root.right == null) {
        return this.inOrder(root.left).concat(arr);
      } else if (root.left == null) {
        return arr.concat(this.inOrder(root.right));
      } else
        return this.inOrder(root.left).concat(arr, this.inOrder(root.right));
    }
    this.inOrder(root.left, fn);
    fn(root);
    this.inOrder(root.right, fn);
  }

  postOrder(root = this.root, fn) {
    if (root == null) return;
    let arr = [];
    if (!fn) {
      arr.push(root.data);
      if (root.left == null && root.right == null) {
        return arr;
      } else if (root.right == null) {
        return this.postOrder(root.left).concat(arr);
      } else if (root.left == null) {
        return this.postOrder(root.right).concat(arr);
      } else
        return this.postOrder(root.left).concat(
          this.postOrder(root.right),
          arr
        );
    }
    this.postOrder(root.left, fn);
    this.postOrder(root.right, fn);
    fn(root);
  }

  // Calculate longest path to leaf from given node
  height = (root) => {
    if (root == null) return 0;
    let rightHeight = 1 + this.height(root.right);
    let leftHeight = 1 + this.height(root.left);
    return Math.max(rightHeight, leftHeight);
  };

  // Calculate number of edges from node to root
  depth = (node = this.root) => {
    let dep = 0;
    let current = this.root;
    while (current != null) {
      if (current.data == node.data) return dep;
      if (node.data < current.data) current = current.left;
      else if (node.data > current.data) current = current.right;
      dep++;
    }
    return null;
  };

  // Check if tree is balanced
  isBalanced = (root = this.root) => {
    if (root == null) return true;
    let diff = Math.abs(this.height(root.right) - this.height(root.left));

    if (diff > 1) return false;

    return this.isBalanced(root.right) && this.isBalanced(root.left);
  };

  // Rebalance the tree
  rebalance = () => {
    let arr = this.levelOrder().sort((a, b) => a - b);
    arr = arr.filter((item, index) => arr.indexOf(item) == index);
    this.root = this.buildTree(arr, 0, arr.length - 1);
  };
}

// Tests
/*
const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);

tree.insert(9);
tree.insert(10);
tree.insert(6.5);
tree.insert(3);
tree.insert(3.5);
console.log(tree.isBalanced());
tree.rebalance();
tree.deleteNode(6.5);
tree.deleteNode(3.5);
tree.deleteNode(4);
tree.rebalance();
tree.prettyPrint();
console.log(tree.isBalanced());
console.log(tree.findNode(9));
*/
