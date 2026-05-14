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

export const modifyPitchReq = async (audioId: string, pitch: number) => {
  const response = await fetch(`${URL}/audio/modify_pitch`, {
    method: 'POST',
    body: JSON.stringify({audioId, pitch}),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if(!response.ok) {
    console.log('Reponse not okay: ', response);
    return
  }

  const blob = await response.blob();
  const filename = await response.headers.get('X-File-Name');

  if(!filename) throw Error('No filename in headers');
  const audioFile = new File(
    [blob],
    filename,
    {
      type: blob.type
    }
  )

  return audioFile;
}