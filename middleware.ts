import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|de|zh-CN|zh-TW|ru|ja|ko|vi)/:path*']
};

