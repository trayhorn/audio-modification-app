import { useState } from "react";
import { uploadAudioReq } from "../../api.ts";

export default function UploadForm({handleFormChange}) {
  return (
    <>
      <form className="upload-form">
        <label htmlFor="audioFile">Choose an audio file:</label>
        <input
          type="file"
          id="audioFile"
          name="audioFile"
          accept="audio/*"
          onChange={(e) => handleFormChange(e.target.files[0])}
        />
      </form>
    </>
  );
}
