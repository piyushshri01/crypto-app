import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './component/Header';
import Home from './component/Home';
import Exchanges from './component/Exchanges';
import Coins from './component/Coins';
import CoinDetails from './component/CoinDetails';
import Footer from './component/Footer';


function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='/' element={ <Home/> }/>
        <Route path='/coins' element={ <Coins/> }/>
        <Route path='/exchanges' element={ <Exchanges/> }/>
        <Route path='/coin/:id' element={ <CoinDetails/> }/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
