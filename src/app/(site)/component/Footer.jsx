"use client"

import { Facebook, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#F4F9FB] border-t border-primaryBlue mt-auto font-helveticaBoldCondensed">
<section
    id="newsletter"
    className="bg-[#FFFFFF] border-t border-[#006294] py-12 font-helveticaCondensed"
  >
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
      <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center md:justify-start">
        <img src="/boite.png" alt="Newsletter" width={200} height={200} />
      </div>
      <div className="md:w-2/3 text-right">
        <h2 className="text-2xl text-[#006294] font-semibold mb-2">
          Inscrivez-vous à notre Newsletter.
        </h2>
        <p className="text-[#58595a] mb-4 font-medium">
          et recevez toutes les nouveautés, inspirations, promotions...
        </p>
  
        <form
          
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <input
            type="email"
            placeholder="Saisissez votre email ici"
            required
            value=""
            
            className="flex-1 px-4 py-2 border border-[#006294] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C09200] transition"
          />
          <button
            type="submit"
            className="bg-[#C09200] text-[#FFFFFF] px-6 py-2 rounded-md font-semibold hover:bg-[#006294] hover:text-[#C09200] transition-colors duration-300"
          >
            ENVOYER
          </button>
        </form>
  
    
      </div>
    </div>
  </section>
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 gap-8">
  
        {/* Left Column - Navigation Links */}
        <div className="col-span-3 space-y-3">
          <a href="/qui_sommes_nous" className="flex items-center text-[#004466] hover:text-[#C09200] transition-colors duration-200 ">
            <span className="text-[#8ca9bb] mr-2"><img src="/share.png" alt="Logo" className="h-8 w-auto" /></span>
            Qui sommes-nous ?
          </a>
          <a href="/contact" className="flex items-center text-[#004466] hover:text-[#C09200] transition-colors duration-200">
            <span className="text-[#8ca9bb] mr-2"><img src="/share.png" alt="Logo" className="h-8 w-auto" /></span>
            Contact
          </a>
        </div>
  
        {/* Center Left Column - More Links */}
        <div className="col-span-2 space-y-3">
        
            <a  href="/blogsClient" className="flex items-center text-[#004466] hover:text-[#C09200] transition-colors duration-200 ">
              <span className="text-[#8ca9bb] mr-2"><img src="/share.png" alt="Logo" className="h-8 w-auto" /></span>
              Blog
            </a>
            <a  href="/faqsClient" className="flex items-center text-[#004466] hover:text-[#C09200] transition-colors duration-200 ">
              <span className="text-[#8ca9bb] mr-2"><img src="/share.png" alt="Logo" className="h-8 w-auto" /></span>
              F.A.Q
            </a>
          
        </div>
  
        {/* Center Column - Logos */}
        <div className="col-span-3 flex flex-col items-center space-y-4">
          <div className="text-center text-[#004466] font-semibold">
            <p className="text-sm mb-4">Nos services dédiés aux entreprises</p>
            <div className="flex items-center justify-center">
              <img src="/LOGO BLUE.png" alt="Weprint Business Logo" className="h-8 w-auto" />
            </div>
          </div>
        </div>
  
        {/* Right Column - Payment Info */}
        <div className="col-span-4 text-center text-[#004466] font-semibold">
          <p className="text-sm mb-4">Paiement à la livraison (selon conditions)</p>
  
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#e3e8f0] rounded-lg flex items-center justify-center mb-2 mx-auto">
                <img src="/cheque.png" alt="cheque" className="h-8 w-auto" />
              </div>
              <span className="text-xs text-[#666666]">Chèque</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#e3e8f0] rounded-lg flex items-center justify-center mb-2 mx-auto">
                <img src="/espece.png" alt="espece" className="h-8 w-auto" />
              </div>
              <span className="text-xs text-[#666666]">Espèces</span>
            </div>
          </div>
        </div>
      </div>
  
      {/* Mobile Layout */}
      <div className="md:hidden space-y-6 text-[#004466] ">
  
        {/* Navigation Links - Two Columns */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-3">
    
              <a href="/qui_sommes_nous" className="flex items-center hover:text-[#C09200] transition-colors duration-200">
                <span className="text-[#8ca9bb] mr-2"><img src="/share.png" alt="Logo" className="h-8 w-auto" /></span>
                 Qui sommes-nous ?
              </a>
               <a href="/contact" className="flex items-center hover:text-[#C09200] transition-colors duration-200">
                <span className="text-[#8ca9bb] mr-2"><img src="/share.png" alt="Logo" className="h-8 w-auto" /></span>
                Contact
              </a>
            
          </div>
          <div className="space-y-3">
           
              <a  href="/blogsClient"  className="flex items-center hover:text-[#C09200] transition-colors duration-200">
                <span className="text-[#8ca9bb] mr-2"><img src="/share.png" alt="Logo" className="h-8 w-auto" /></span>
                Blog
              </a>
              <a  href="/faqsClient"  className="flex items-center hover:text-[#C09200] transition-colors duration-200">
                <span className="text-[#8ca9bb] mr-2"><img src="/share.png" alt="Logo" className="h-8 w-auto" /></span>
                F.A.Q
              </a>
           
          </div>
        </div>
  
        {/* Mobile Logos Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center py-4 border-t border-[#c0c0c0]">
            <p className="text-sm mb-4">Nos services dédiés aux entreprises</p>
            <div className="flex items-center justify-center">
              <img src="/LOGO BLUE.png" alt="Weprint Business Logo" className="h-8 w-auto" />
            </div>
          </div>
  
          {/* Mobile Payment Section */}
          <div className="text-center py-4 border-t border-[#c0c0c0]">
            <p className="text-sm mb-4">Paiement à la livraison (selon conditions)</p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="w-10 h-10 bg-[#e3e8f0] rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <img src="/espece.png" alt="espece" className="h-8 w-auto" />
                </div>
                <span className="text-xs text-[#666666]">Espèces</span>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-[#e3e8f0] rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <img src="/cheque.png" alt="cheque" className="h-8 w-auto" />
                </div>
                <span className="text-xs text-[#666666]">Chèque</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    {/* Bottom Footer */}
    <div className="border-t border-[#c0c0c0] bg-[#eaeaea]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
  
          {/* Copyright and Legal Links */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-[#666666] font-normal">
            
          </div>
  
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="w-8 h-8 bg-[#004466] hover:bg-[#C09200] rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <a
              href="#"
              className="w-8 h-8 bg-[#004466] hover:bg-[#C09200] rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <Instagram className="w-4 h-4 text-white" />
            </a>
            <a
              href="#"
              className="w-8 h-8 bg-[#004466] hover:bg-[#C09200] rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <Linkedin className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  
  </footer>
  
  )
}
