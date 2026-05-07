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

export const sampleFormUpload = async (body: FormData) => {
  const res = await fetch(`${URL}/audio/test`, {
    method: 'POST',
    body: body, 
  })

  if(!res.ok) return;

  return await res.json();
}