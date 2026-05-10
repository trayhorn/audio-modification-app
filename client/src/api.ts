const URL = 'http://localhost:3000';

export const uploadAudioReq = async (body: FormData) => {
  const response = await fetch(`${URL}/audio/upload`, {
    method: 'POST',
    body
  });

  if(!response.ok) {
    console.log('Reponse not okay: ', response);
    return
  }

  const json = await response.json();
  return json;
}