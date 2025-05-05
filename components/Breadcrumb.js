import { useRouter } from 'next/router';
import Link from 'next/link';
import { BreadcrumbJsonLd } from './JsonLd';

export default function Breadcrumb() {
  const router = useRouter();
  const pathSegments = router.asPath.split('/').filter(segment => segment);
  
  // 生成帶有索引的路徑
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // 構建從開始到當前級別的路徑
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    
    // 處理段落名稱，首字母大寫並替換連字符為空格
    const name = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
    
    return { name, url };
  });
  
  // 添加首頁到麵包屑開始
  const fullBreadcrumbs = [
    { name: '首頁', url: '/' },
    ...breadcrumbItems
  ];
  
  // 如果當前頁面是首頁，則不顯示麵包屑
  if (router.asPath === '/') {
    return null;
  }
  
  return (
    <>
      <BreadcrumbJsonLd items={fullBreadcrumbs} />
      
      <nav aria-label="麵包屑" className="flex py-3 px-4 text-sm text-gray-600">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {fullBreadcrumbs.map((item, index) => (
            <li key={item.url} className="inline-flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
              
              {index === fullBreadcrumbs.length - 1 ? (
                <span className="text-gray-800 font-medium">{item.name}</span>
              ) : (
                <Link href={item.url}>
                  <a className="text-blue-600 hover:text-blue-800 hover:underline">
                    {item.name}
                  </a>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
} 