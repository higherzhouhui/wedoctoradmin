import React, { useState, useEffect, useRef } from 'react';
import { RouteContext } from '@ant-design/pro-layout';
import type { RouteContextType } from '@ant-design/pro-layout';
import { history } from 'umi';
import Tags from './Tags';
import styles from './index.less';

export type TagsItemType = {
  title?: string;
  path?: string;
  active: boolean;
  query?: any;
  children: any;
  refresh: number;
};

interface IProps {
  home: string;
}

/**
 * @component TagView 标签页组件
 */
const TagView: React.FC<IProps> = ({ children, home }) => {
  const [tagList, setTagList] = useState<TagsItemType[]>([]);

  const [currentPath, setCurrentPath] = useState<string | undefined>();
  const routeContextRef = useRef<RouteContextType>();
  const searchPath = (multiDimArr: any[], path: any) => {
    // 遍历数组
    for (let i = 0; i < multiDimArr.length; i++) {
      if (multiDimArr[i].path === path) {
        // 找到符合条件的元素，返回它本身
        return multiDimArr[i];
      } else if (multiDimArr[i].children) {
        // 如果当前元素有children，递归查找
        const result: any = searchPath(multiDimArr[i].children, path);
        if (result) {
          // 如果找到符合条件的元素，返回它本身
          return result;
        }
      }
    }
    // 没有找到符合条件的元素，返回 {}
    return {};
  }
  // 初始化 visitedViews，设置首页
  const initTags = (routeContext: RouteContextType) => {
    const { menuData } = routeContext;
    if (tagList.length === 0 && menuData) {
      const firstTag = searchPath(menuData, home);
      const title = firstTag?.name;
      const path = firstTag?.path;
      history.push({ pathname: firstTag.path, query: firstTag.query });
      setTagList([
        {
          title,
          path,
          children,
          refresh: 0,
          active: true,
        },
      ]);
    }
  };

  // 监听路由改变
  const handleOnChange = (routeContext: RouteContextType) => {
    const { currentMenu } = routeContext;

    // tags初始化
    if (tagList.length === 0) {
      return initTags(routeContext);
    }

    // 判断是否已打开过该页面
    let hasOpen = false;
    const tagsCopy: TagsItemType[] = tagList.map((item) => {
      if (currentMenu?.path === item.path) {
        hasOpen = true;
        // 刷新浏览器时，重新覆盖当前 path 的 children
        return { ...item, active: true, children };
      } else {
        return { ...item, active: false };
      }
    });

    // 没有该tag时追加一个,并打开这个tag页面
    if (!hasOpen) {
      const title = routeContext.title || '';
      const path = currentMenu?.path;
      tagsCopy.push({
        title,
        path,
        children,
        refresh: 0,
        active: true,
      });
    }

    return setTagList(tagsCopy);
  };

  // 关闭标签
  const handleCloseTag = (tag: TagsItemType) => {
    const tagsCopy: TagsItemType[] = tagList.map((el, i) => ({ ...el }));

    // 判断关闭标签是否处于打开状态
    tagList.forEach((el, i) => {
      if (el.path === tag.path && tag.active) {
        const next = tagList[i - 1];
        next.active = true;
        history.push({ pathname: next?.path, query: next?.query });
      }
    });

    setTagList(tagsCopy.filter((el) => el.path !== tag?.path));
  };

  // 关闭所有标签
  const handleCloseAll = () => {
    const tagsCopy: TagsItemType[] = tagList.filter((el) => el.path === home);
    history.push(home);
    setTagList(tagsCopy);
  };

  // 关闭其他标签
  const handleCloseOther = (tag: TagsItemType) => {
    const tagsCopy: TagsItemType[] = tagList.filter(
      (el) => el.path === home || el.path === tag.path,
    );
    history.push({ pathname: tag?.path, query: tag?.query });
    setTagList(tagsCopy);
  };

  // 刷新选择的标签
  const handleRefreshTag = (tag: TagsItemType) => {
    const tagsCopy: TagsItemType[] = tagList.map((item) => {
      if (item.path === tag.path) {
        history.push({ pathname: tag?.path, query: tag?.query });
        return { ...item, refresh: item.refresh + 1, active: true };
      }
      return { ...item, active: false };
    });
    setTagList(tagsCopy);
  };

  useEffect(() => {
    if (routeContextRef.current) {
      handleOnChange(routeContextRef.current);
    }
  }, [routeContextRef.current]);

  return (
    <>
      <RouteContext.Consumer>
        {(value: RouteContextType) => {
          setTimeout(() => {
            setCurrentPath(value.currentMenu?.path);
          }, 0);
          routeContextRef.current = value;
          return null;
        }}
      </RouteContext.Consumer>
      <div className={styles.tag_view}>
        <div className={styles.tags_container}>
          <Tags
            tagList={tagList}
            closeTag={handleCloseTag}
            closeAllTag={handleCloseAll}
            closeOtherTag={handleCloseOther}
            refreshTag={handleRefreshTag}
          />
        </div>
      </div>

      {tagList.map((item) => {
        return (
          <div key={item.path || 'test'} style={{ display: item.active ? 'block' : 'none' }}>
            <div key={item.refresh}>{item.children}</div>
          </div>
        );
      })}
    </>
  );
};

export default TagView;
