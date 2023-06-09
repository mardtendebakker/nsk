export default function saveBlob(blob: Blob, fileName: string): void {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.cssText = 'display: none';

  const url = window.URL.createObjectURL(blob);

  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}
