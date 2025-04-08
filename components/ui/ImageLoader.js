export default function ImageLoader({ src, width, quality }) {
  return `${src}?width=${width || 10}&quality=${quality || 10}`;
}
