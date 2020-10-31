import React, {useState} from 'react';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SpinnerLoading from './components/Spinner/Spinner';
import styled from 'styled-components';
import './App.css';
import Particles from 'react-particles-js';

const particlesOptions = 
  {
	    "particles": {
	        "number": {
	            "value": 150
	        },
	        "size": {
	            "value": 4  
	        }
	    },
	    "interactivity": {
	        "events": {
	            "onhover": {
	                "enable": true,
	                "mode": "repulse"
	            }
	        }
	    }
	}

const Container = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

function App() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [boundingBox, setBoundingBox] = useState([]);
  const [loading, setLoading]  = useState(false); 

  const onChangeHandler = (event) => {
    setInput(event.target.value);
  }
  
  const onButtonSubmit = () => {
    setLoading(true);
    setImageUrl(input);
    console.log(input);
    const Clarifai = require('clarifai');
      
    // Instantiate a new Clarifai app by passing in your API key.
    const app = new Clarifai.App({apiKey: 'f7a07536db1144a2976fffdbe7ca41cd'});
    // Predict the contents of an image by passing in a URL.
    app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response => {
        setBoundingBox(response.outputs[0].data.regions);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }


  const MainContent = (
      <Container>
        <Rank />
        <ImageLinkForm onInputChange={(e) => onChangeHandler(e)} input={input} onSubmit={onButtonSubmit} />
        { loading === true ?  <SpinnerLoading /> : ( imageUrl.length > 0 ? <FaceRecognition imageUrl={imageUrl} boundingBox={boundingBox} /> : null ) } 
      </Container>
  );

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      {MainContent}
    </div>
  );
}

export default App;
