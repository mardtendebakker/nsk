export function openBlob(blob: Blob): void {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.cssText = 'display: none';

  const url = window.URL.createObjectURL(blob);

  a.href = url;
  a.target = '_blank';
  a.click();
  window.URL.revokeObjectURL(url);
}
