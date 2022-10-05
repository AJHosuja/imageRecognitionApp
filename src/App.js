import { useEffect, useState } from 'react';
import './App.css';
import { computerVision, isConfigured as ComputerVisionIsConfigured } from './computerVision';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import ClipLoader from "react-spinners/ClipLoader";
function App() {

  const [file, setFile] = useState();
  const [downloadUrl, setDownloadUrl] = useState("")
  const [imageData, setImageData] = useState(null)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uploadFile = () => {

      setLoading(true)
      const name = new Date().getTime() + file.name;
      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL)
            setDownloadUrl(downloadURL)
            analyzeFile(downloadURL)

          });
        }
      );
    };


    file && uploadFile();

  }, [file]);



  const analyzeFile = (url) => {
    computerVision(url).then(item => {
      setImageData(item)
      setLoading(false)
    })
  }

  return (
    <div className='flex justify-center mt-20'>
      <div className='flex flex-col space-y-14'>
        <h1 className='font-semibold text-3xl'>Image Recognition APP</h1>
        <input type="file" id="file" onChange={e => setFile(e.target.files[0])} />
        <img src={downloadUrl} className="w-96" />
      </div>
      {imageData &&
        <div className='ml-10'>
          <h1 className='font-semibold'>Tags</h1>
          <ul className="list-disc ml-8">
            {imageData.tags.map((item, index) => {
              return (
                <li key={index}>{item.name}</li>
              )
            })}

          </ul>
          <p>Width: {imageData.metadata.width}</p>
          <p>height: {imageData.metadata.height}</p>
          <p>How many faces: {imageData.faces.length}</p>
          <p>Dominant color background: {imageData.color.dominantColorBackground}</p>
          <p>Dominant color foreground: {imageData.color.dominantColorForeground}</p>
        </div>
      }

      <ClipLoader color={"balck"} loading={loading} size={150} aria-label="Loading Spinner" />
    </div>
  );
}

export default App;
