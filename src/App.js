import './App.css';
import Header from './Components/Header/Header';
import Listings from './Components/Listings/Listings';

function App() {
  return (
    <div className="app-container">
      <div className='background-gray' />
      <Header />
      <Listings />
    </div>
  );
}

export default App;
