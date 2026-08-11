import { MdDownload } from "react-icons/md";

type DownloadBtnProps = {
  audioSrc: string;
  filename: string;
};

export default function DownloadBtn({audioSrc, filename}: DownloadBtnProps) {
  return (
    <div className="audioDownload">
      <a href={audioSrc} download={filename}>
        <MdDownload size={30} color="black" />
      </a>
    </div>
  );
}
