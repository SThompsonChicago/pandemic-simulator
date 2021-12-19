import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import { Transition, animated } from "react-spring";
import Simulate from "./pages/Simulate";
import Header from './Header';
import Footer from './Footer';
import Home from './pages/Home';

// class Container extends React.Component {

//   render() {
//     return (
//       <div className="App">
//         <Header />
//         <Home />
//         <Footer />
//       </div>
//     );
//   }
// }


export default function Container () {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderPage = () => {
      if (currentPage === 'Home') {
          return <Home />
      }
      return <Simulate />
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (currentPage === 'Home' 
  ?
      <div className="notification is-black">

<Header currentPage={currentPage} handlePageChange={handlePageChange}/>
      {renderPage()}
      <Footer />
      </div>
      :
      <div className="notification is-black">

      <Header currentPage={currentPage} handlePageChange={handlePageChange}/>
      {renderPage()}
      <Footer />
  </div>
  );
}

