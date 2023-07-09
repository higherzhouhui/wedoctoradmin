import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'realDark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  headerTheme: 'light',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  splitMenus: false,
  title: '消化疾病采集',
  pwa: false,
  // logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  logo: '/logo.png',
  iconfontUrl: '',
};

export default Settings;
