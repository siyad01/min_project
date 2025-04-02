
const Footer = () => {
  return (
    <footer className="bg-[#0D3B54] text-[#E0E6E3] py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          {new Date().getFullYear()} No-Due Ceritificater . All Rights Reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <a 
            href="#" 
            className="hover:text-white transition-colors duration-300"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="hover:text-white transition-colors duration-300"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer