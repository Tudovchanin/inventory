// utils/getImageUrl.js
export default function getImageUrl(path) {
  return new URL(path, import.meta.url).href;
}