

export function createImage(img: string): HTMLImageElement {
  const imgElement = new Image();
  imgElement.src = img;
  imgElement.hidden = true;
  return imgElement;
}

export function createAudio(audio:string){
  const audioElement = new Audio();
  audioElement.src = audio;
  audioElement.hidden = true;
  return audioElement;
}