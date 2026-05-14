type UploadFormType = {
  handleFormChange: (audioFile: File) => void;
}

export default function UploadForm({ handleFormChange }: UploadFormType) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      handleFormChange(file);
    }
  };

  return (
    <section>
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
    </section>
  );
}
