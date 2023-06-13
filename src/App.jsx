import DistanceApp from "./components/DistanceApp";
import Header from "./components/Header";

import "./App.css";

function App() {
  return (
    <div className="bg-gray-100 p-6 w-full justify-center items-center gap-10 h-max md:h-screen">
      <Header />
      <DistanceApp />
    </div>
  );
}

export default App;
