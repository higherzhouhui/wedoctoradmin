import React, { useState, useRef, useEffect } from 'react';
import { history } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';
import { CloseOutlined } from '@ant-design/icons';
import type { TagsItemType } from '../index';
import styles from './index.less';

interface IProps {
  tagList: TagsItemType[];
  closeTag: (tag: TagsItemType) => void;
  closeAllTag: () => void;
  closeOtherTag: (tag: TagsItemType) => void;
  refreshTag: (tag: TagsItemType) => void;
}

const Tags: React.FC<IProps> = ({ tagList, closeTag, closeAllTag, closeOtherTag, refreshTag }) => {
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState<TagsItemType>();

  const tagListRef = useRef<any>();
  const contextMenuRef = useRef<any>();

  useEffect(() => {
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 由于react的state不能及时穿透到 document.body.addEventListener去，需要在每次值发送改变时进行解绑和再次监听
  useEffect(() => {
    document.body.removeEventListener('click', handleClickOutside);
    document.body.addEventListener('click', handleClickOutside);
  }, [menuVisible]);

  const handleClickOutside = (event: Event) => {
    const isOutside = !(contextMenuRef.current && contextMenuRef.current.contains(event.target));
    if (isOutside && menuVisible) {
      setMenuVisible(false);
    }
  };

  const openContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: TagsItemType,
  ) => {
    event.preventDefault();
    const menuMinWidth = 105;
    const clickX = event.clientX;
    const clickY = event.clientY; //事件发生时鼠标的Y坐标
    const clientWidth = tagListRef.current?.clientWidth || 0; // container width
    const maxLeft = clientWidth - menuMinWidth; // left boundary
    setCurrentTag(tag);
    setMenuVisible(true);
    setTop(clickY);

    // 当鼠标点击位置大于左侧边界时，说明鼠标点击的位置偏右，将菜单放在左边
    // 反之，当鼠标点击的位置偏左，将菜单放在右边
    const Left = clickX > maxLeft ? clickX - menuMinWidth + 15 : clickX;
    setLeft(Left);
  };

  return (
    <div className={styles.tags_wrapper} ref={tagListRef}>
      <Scrollbars autoHide autoHideTimeout={1000} autoHideDuration={200}>
        {tagList.map((item, i) =>
          item.path ? (
            <div
              key={item.path}
              className={item.active ? `${styles.item} ${styles.active}` : styles.item}
              onClick={() => history.push({ pathname: item.path, query: item.query })}
              onContextMenu={(e) => openContextMenu(e, item)}
            >
              <span>{item.title}</span>
              {i !== 0 && (
                <CloseOutlined
                  className={styles.icon_close}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTag && closeTag(item);
                  }}
                />
              )}
            </div>
          ) : null,
        )}
      </Scrollbars>
      {menuVisible ? (
        <ul
          className={styles.contextmenu}
          style={{ left: `${left}px`, top: `${top}px` }}
          ref={contextMenuRef}
        >
          <li
            onClick={() => {
              setMenuVisible(false);
              currentTag && refreshTag && refreshTag(currentTag);
            }}
          >
            刷新
          </li>
          <li
            onClick={() => {
              setMenuVisible(false);
              currentTag && closeOtherTag && closeOtherTag(currentTag);
            }}
          >
            关闭其他
          </li>
          <li
            onClick={() => {
              setMenuVisible(false);
              closeAllTag && closeAllTag();
            }}
          >
            关闭所有
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default Tags;
