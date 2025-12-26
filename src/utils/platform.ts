export function getPlatformLink(links: any) {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("iphone") || ua.includes("ipad")) return links.appstore;
  if (ua.includes("android")) return links.playmarket;
  if (ua.includes("huawei")) return links.appgallery;

  return links.rustore;
}
