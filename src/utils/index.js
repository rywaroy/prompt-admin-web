export const buildTree = (arr) => {
    const tree = [];
    const childrenOf = {};

    arr.forEach((item) => {
        const { id, parentId } = item;
        childrenOf[id] = childrenOf[id] || [];
        item.children = childrenOf[id];
        if (parentId === null) {
            tree.push(item);
        } else {
            childrenOf[parentId] = childrenOf[parentId] || [];
            childrenOf[parentId].push(item);
        }
    });

    arr.forEach((item) => {
        if (!item.children || !item.children.length) {
            delete item.children;
        }
    });

    return tree;
};
