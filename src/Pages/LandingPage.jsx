import { Link } from "react-router-dom";

const LandingPage = () => {
  return (

    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-orange-50 to-white-50 font-sans">

      <header className="container flex flex-col md:flex-row items-center mx-14 px-12 py-12">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-5xl font-bold leading-tight text-gray-800"> 
            Invest in the Future of <span className="text-blue-600">Business</span>
          </h2>

          <p className="mt-6 text-lg text-gray-600">
            Connect with entrepreneurs building the next big thing. Explore investment opportunities aligned with your interests and values.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start">
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg mr-4 mb-4 sm:mb-0 transition duration-300">
              Explore Projects
            </Link>
            <Link to="/register" className="border border-blue-600 hover:bg-indigo-100 text-blue-600 px-8 py-3 rounded-lg transition duration-300">
              Become an Investor
            </Link>
          </div>
        </div>

        <div className="md:w-1/2 mt-12 md:mt-0"> 
          <img src="/hero-image.png" alt="Business Meeting" className="w-full md:max-w-md rounded-lg shadow-lg mx-auto md:ml-auto" /> 
        </div>
      </header>

      <section className="container mx-auto mt-16 px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800">Invest in What You Believe In</h3>
        <p className="text-center text-gray-600 mt-4 text-lg">
          Individual or institution, we have investment options for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {[
            { title: "For Investors", desc: "Discover and invest in innovative companies.", img: "investor.svg" },
            { title: "For Founders", desc: "Raise capital and bring your vision to life.", img: "/founder.svg" },
            { title: "For Accelerators", desc: "Help startups grow with your expertise.", img: "/accelerator.svg" },
            { title: "For Institutions", desc: "Invest in high-potential startups.", img: "/institution.svg" }
          ].map((item, index) => (
            <div key={index} className="p-6 border rounded-lg shadow bg-white transform hover:scale-105 transition duration-300">
              <img src={item.img} alt={item.title} className="w-full h-40 object-contain rounded-md mb-4" />
              <h4 className="mt-2 text-xl font-bold text-gray-800">{item.title}</h4>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white shadow-md mt-16 py-8">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2025 Investor Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;