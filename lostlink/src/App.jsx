import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RecentItems from "./components/RecentItems";

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <Navbar />

      <Hero />

      <RecentItems />

    </div>
  );
}

export default App;