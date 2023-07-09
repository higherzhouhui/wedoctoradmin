/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    adminRouteFilter: () => currentUser?.role === 'admin' || currentUser?.role === 'developer',
    serviceRouteFilter: () => currentUser?.role === 'admin' || currentUser?.role === 'developer',
    developerRouteFilter: () => currentUser?.role === 'developer',
  };
}
