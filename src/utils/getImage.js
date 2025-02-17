
export default function getImageUrl(path) {
  console.log(path);
  return new URL(path, import.meta.url).href;
}