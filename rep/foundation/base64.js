function dataURLtoBlob(dataURL) {
  let arr = dataURL.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let binaryString = atob(arr[1]);
  let n = binaryString.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = binaryString.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

function dataURLtoFile(dataURL, fileName) {
  let arr = dataURL.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let binaryString = atob(arr[1]);
  let n = binaryString.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = binaryString.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}
