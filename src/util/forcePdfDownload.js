export default base64EncodedString => {
  const byteCharacters = atob(base64EncodedString);
  const byteNumbers = new Array(byteCharacters.length);
  // eslint-disable-next-line
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {
    type: 'application/pdf',
  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, 'download.pdf');
  } else {
    const url = (window.webkitURL || window.URL).createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', url);
    link.click();
  }
};
