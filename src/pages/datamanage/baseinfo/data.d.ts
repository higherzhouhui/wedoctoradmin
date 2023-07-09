export type TableListItem = {
  course: string;
  expandRule: string;
  groupFreezeDay: string;
  groupFreezeRatio: string;
  groupName: string;
  groupNum: string;
  groupOne: string;
  groupPhoto: string;
  groupThree: string;
  groupTwo: string;
  id: string;
  officialGroup: string;
  video: string;
};

export type TableListPagination = {
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
