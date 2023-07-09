export type TableListItem = {
  id: number;
  form: string;
  to: string;
  createTime: string;
  content: string;
  stat: boolean;
  userId: string;
  phone: string;
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
