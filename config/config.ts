// https://umijs.org/config/
import { join } from 'path';
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      redirect: '/home/list',
    },
    {
      path: '/home/list',
      icon: 'DashboardOutlined',
      name: 'home',
      component: './home/list',
    },
    {
      path: '/datamanage/list',
      icon: 'BarChartOutlined',
      name: 'datamanage',
      component: './datamanage/list',
    },
    {
      path: '/tongji/list',
      icon: 'PieChartOutlined',
      name: 'tongji',
      component: './tongji/list',
    },
    {
      path: '/user',
      layout: true,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/admins',
      icon: 'Setting',
      name: 'admins',
      routes: [
        {
          path: '/admins',
          redirect: '/admins/list',
          access: 'adminRouteFilter',
        },
        {
          path: '/admins/list',
          name: 'list',
          component: './admins/list',
          access: 'adminRouteFilter',
        },
        {
          path: '/admins/add',
          name: 'add',
          component: './admins/add',
          access: 'adminRouteFilter',
        },
        {
          path: '/admins/center',
          name: 'center',
          component: './admins/percenter',
          access: 'adminRouteFilter',
          hideInMenu: true,
        },
        {
          path: '/admins/changepwd',
          name: 'changepwd',
          component: './admins/changepwd',
          hideInMenu: true,
          access: 'adminRouteFilter',
        },
        {
          path: '/admins/changepwd-result',
          name: 'changepwd-result',
          component: './admins/changepwd-result',
          hideInMenu: true,
          access: 'adminRouteFilter',
        },
        {
          path: '/admins/addaccount-result',
          name: 'addaccount-result',
          component: './admins/changepwd-result',
          hideInMenu: true,
          access: 'adminRouteFilter',
        },
      ],
    },
    {
      path: '/question',
      icon: 'Setting',
      name: 'question',
      routes: [
        {
          path: '/question',
          redirect: '/question/list',
          access: 'developerRouteFilter',
        },
        {
          path: '/question/list',
          name: 'list',
          component: './question/list',
          access: 'developerRouteFilter',
        },
        {
          path: '/question/add',
          name: 'add',
          component: './question/add',
          access: 'developerRouteFilter',
        }
      ],
    },
    // {
    //   path: '/upload',
    //   icon: 'Upload',
    //   name: 'upload',
    //   routes: [
    //     {
    //       path: '/upload',
    //       redirect: '/upload/list',
    //     },
    //     {
    //       name: 'upload-upload',
    //       path: '/upload/upload',
    //       component: './upload/upload',
    //     },
    //   ],
    // },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
