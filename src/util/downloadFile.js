import { sharepointApi } from '../api';

export default async (uri, filename) => {
  const res = await sharepointApi.uriLocator(uri);
  const blob = new Blob([res.data]);
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // for IE
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.href = blobURL;
    tempLink.setAttribute('download', filename);
    tempLink.click();
  }
};
