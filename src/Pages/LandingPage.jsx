import { Link } from "react-router-dom";
// import Navbar from "../Components/Navbar";


const LandingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      
      <header className="container mx-auto flex flex-col md:flex-row items-center px-6 py-8">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold">Invest in the Future of Business</h2>
          <p className="mt-4 text-gray-600">
            Connect with entrepreneurs who are building the next big thing. Explore investment opportunities that align with your interests and values.
          </p>
          <div className="mt-6">
            <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded mr-4">
              Explore Projects
            </Link>
            <Link to="/register" className="border border-blue-500 text-blue-500 px-6 py-3 rounded">
              Become an Investor
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0 ">
          <img src="/hero-image.png" alt="Business Meeting" className="rounded-lg shadow-md mt-4" />
        </div>
      </header>

      <section className="container mx-auto mt-12 px-6">
        <h3 className="text-2xl font-bold text-center">Invest in What You Believe In</h3>
        <p className="text-center text-gray-600 mt-2">
          Whether you're an individual investor or an institution, we have investment options to suit your needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {[
            { title: "For Investors", desc: "Discover and invest in innovative companies.", img: "investor.svg" },
            { title: "For Founders", desc: "Raise capital and bring your vision to life.", img: "/founder.svg" },
            { title: "For Accelerators", desc: "Help startups grow with your expertise.", img: "/accelerator.svg" },
            { title: "For Institutions", desc: "Invest in high-potential startups.", img: "/institution.svg" }
          ].map((item, index) => (
            <div key={index} className="p-4 border rounded-lg shadow bg-white">
              <img src={item.img} alt={item.title} className="w-full h-40 object-contain rounded-md" />
              <h4 className="mt-4 text-xl font-bold">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white shadow-md mt-12 py-6">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2025 Investor Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;