import { useState } from "react";
import { uploadAudioReq, sampleFormUpload } from "../../api.ts";

export default function UploadForm() {
  const [audioFile, setAudioFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append("audioFile", file);
    const res = await uploadAudioReq(formData);
    console.log(res);
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    const {name, phone} = e.target.elements;
    console.log({name: name.value, phone: phone.value});

    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('phone', phone.value);
    console.log(formData);

    const res = await sampleFormUpload(formData);
    console.log(res);
  }

  return (
    <>
      <form className="upload-form">
        <label htmlFor="audioFile">Choose an audio file:</label>
        <input
          type="file"
          id="audioFile"
          name="audioFile"
          accept="audio/*"
          onChange={handleFileChange}
        />
      </form>
      <form onSubmit={handleSubmitTest}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" />
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input type="number" id="phone" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
