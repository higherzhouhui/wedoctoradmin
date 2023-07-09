export type TableListItem = {
  //购买项目数量
  buyProjectNumList: [{
    date: string;
    num: number;
   }];
   //购买项目金额
   buyProjectPriceList: [{
    date: string;
    num: number;
   }];
   // 购买项目总金额
   buyProjectSumPrice: number;
   // 实名用户总数
   sumUserNum: number;
   // 用户统计
   userList: [{
    date: string;
    num: number;
   }];
   //出款金额
   withdrawPriceList: [{
    date: string;
    num: number;
  }];
  withdrawSumPrice: '总出款金额'
};

export type ITongji = {
  num?: number;
  title: string;
};

export type TableListPagination = {
  day: number
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
