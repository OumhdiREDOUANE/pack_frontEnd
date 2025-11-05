// src/app/(site)/layout.js


import Footer from "./component/Footer";
import AllHeader from "./component/AllHeader";


export default function SiteLayout({ children }) {
  return (
    <div>
  
        <AllHeader/>
       
      {children}
    
      
      <Footer />
      </div>
    
  );
}
