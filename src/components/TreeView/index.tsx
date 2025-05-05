import React, { useState, useEffect } from 'react';
import { Tree, Button, Space, Modal, Input, Tooltip } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import './index.css';

const { DirectoryTree } = Tree;

interface TreeViewProps {
  data: DataNode[];
}

const TreeView: React.FC<TreeViewProps> = ({ data: initialData }) => {
  const [treeData, setTreeData] = useState<DataNode[]>(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNodeType, setNewNodeType] = useState('file');
  const [editingKey, setEditingKey] = useState<React.Key | null>(null);
  const [newName, setNewName] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [renameModalVisible, setRenameModalVisible] = useState(false);

  const onSelect: DirectoryTreeProps['onSelect'] = (keys) => setSelectedKeys(keys);

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };

  const handleDrop: DirectoryTreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: DataNode[], keys: React.Key[], callback: (node: DataNode, i: number, arr: DataNode[]) => void) => {
      keys.forEach((key) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            callback(item, index, arr);
          }
          if (item.children) {
            loop(item.children, [key], callback);
          }
        });
      });
    };

    const data = [...treeData];
    const dragObjs: DataNode[] = [];

    // 获取实际拖动的节点键值（兼容单选和多选）
    const dragKeys = selectedKeys.length > 0 ? selectedKeys : [info.dragNode.key];

    loop(data, dragKeys, (item, index, arr) => {
      arr.splice(index, 1);
      dragObjs.push(item);
    });

    if (!info.dropToGap) {
      loop(data, [dropKey], (item) => {
        item.children = item.children || [];
        item.children.push(...dragObjs);
      });
    } else if (dropPosition === 1) {
      loop(data, [dropKey], (_item, index, arr) => {
        arr.splice(index + 1, 0, ...dragObjs);
      });
    } else {
      loop(data, [dropKey], (_item, index, arr) => {
        arr.splice(index, 0, ...dragObjs);
      });
    }
    setTreeData(data);
    setSelectedKeys([]);
  };

  const showModal = (parentKey: React.Key) => {
    setIsModalVisible(true);
    setNewNodeType('file');
    setNewName('新节点');
    setEditingKey(parentKey);
  };

  const handleAddNode = () => {
    const newData = [...treeData];
    const loop = (data: DataNode[]) => {
      data.forEach((item) => {
        if (item.key === editingKey) {
          item.children = item.children || [];
          if (newNodeType === 'folder') {
            item.children.push({
              title: newName,
              key: `${editingKey}-${item.children.length}`,
              isLeaf: false,
              children: [],
            });
          } else {
            item.children.push({
              title: newName,
              key: `${editingKey}-${item.children.length}`,
              isLeaf: true,
            });
          }
        } else if (item.children) {
          loop(item.children);
        }
      });
    };
    loop(newData);
    setTreeData(newData);
    setIsModalVisible(false);
  };

  const handleRenameConfirm = () => {
    const newData = [...treeData];
    const loop = (data: DataNode[]) => {
      data.forEach((item) => {
        if (item.key === editingKey) {
          item.title = newName;
          return;
        }
        if (item.children) {
          loop(item.children);
        }
      });
    };
    loop(newData);
    setTreeData(newData);
    setRenameModalVisible(false);
  };

  const handleRenameCancel = () => {
    setRenameModalVisible(false);
  };

  useEffect(() => {
    if (editingKey) {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const editingElement = document.getElementById(`editing-${editingKey}`);
        if (editingElement && !editingElement.contains(target)) {
          handleRenameCancel();
        }
      };
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, [editingKey]);

  useEffect(() => {
    if (renameModalVisible) {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const modalElement = document.getElementById('rename-modal');
        if (modalElement && !modalElement.contains(target)) {
          handleRenameCancel();
        }
      };
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, [renameModalVisible]);

  const handleDeleteNode = (key: React.Key) => {
    const newData = [...treeData];
    const loop = (data: DataNode[], parent: DataNode | null = null) => {
      data.forEach((item, index) => {
        if (item.key === key) {
          if (parent) {
            parent.children?.splice(index, 1);
          }
          return;
        }
        if (item.children) {
          loop(item.children, item);
        }
      });
    };
    loop(newData);
    setTreeData(newData);
  };

  const titleRender = (node: DataNode) => {
    return (
      <Space>
        <span style={{
          width: '60px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          display: 'inline-block',
          verticalAlign: 'middle',
        }}>
          {node.title?.toLocaleString()}
        </span>
        {!node.isLeaf ? (
          <Space size="small">
            <Tooltip title="新建">
              <Button type="link" size="small" onClick={(e) => {
                e.stopPropagation();
                showModal(node.key);
              }}><PlusOutlined /></Button>
            </Tooltip>
            <Tooltip title="重命名">
              <Button type="link" size="small" onClick={() => {
                setEditingKey(node.key);
                setNewName(node.title?.toString() ?? '');
                setRenameModalVisible(true);
              }}><FormOutlined /></Button>
            </Tooltip>
            <Tooltip title="删除">
              <Button type="link" size="small" danger onClick={() => handleDeleteNode(node.key)}><DeleteOutlined /></Button>
            </Tooltip>
          </Space>
        ) : (
          <Space size="small">
            <Tooltip title="重命名">
              <Button type="link" size="small" onClick={() => {
                setEditingKey(node.key);
                setNewName(node.title?.toString() ?? '');
                setRenameModalVisible(true);
              }}><FormOutlined /></Button>
            </Tooltip>
            <Tooltip title="删除">
              <Button type="link" size="small" danger onClick={() => handleDeleteNode(node.key)}><DeleteOutlined /></Button>
            </Tooltip>
          </Space>
        )}
      </Space>
    );
  };

  return (
    <>
      <DirectoryTree
        multiple
        draggable
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        onDrop={handleDrop}
        treeData={treeData}
        titleRender={titleRender}
        className="custom-tree"
      />
      <Modal
        title="新建节点"
        open={isModalVisible}
        onOk={handleAddNode}
        onCancel={() => {
          setIsModalVisible(false);
          setNewNodeType('file');
          setNewName('新节点');
          setEditingKey(null);
        }}
        okButtonProps={{ disabled: !newName.trim() }}
      >
        <Button
          type={newNodeType === 'file' ? 'primary' : 'text'}
          className="node-type-btn"
          onClick={(e) => {
            e.stopPropagation();
            setNewNodeType('file');
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              setNewNodeType('folder');
            }
          }}
        >
          新建文件
        </Button>
        <Button
          type={newNodeType === 'folder' ? 'primary' : 'text'}
          className="node-type-btn"
          style={{ marginLeft: '10px' }}
          onClick={(e) => {
            e.stopPropagation();
            setNewNodeType('folder');
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              setNewNodeType('file');
            }
          }}
        >
          新建文件夹
        </Button>
        <Input
          placeholder="输入节点名称"
          value={newName}
          style={{ marginTop: '10px' }}
          onChange={(e) => setNewName(e.target.value)}
        />
      </Modal>
      <Modal
        title="重命名节点"
        open={renameModalVisible}
        onOk={handleRenameConfirm}
        onCancel={handleRenameCancel}
        okButtonProps={{ disabled: !newName.trim() }}
      >
        <Input
          autoFocus
          placeholder="输入新名称"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default TreeView;
