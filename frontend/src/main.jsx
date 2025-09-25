import ReactDOM from "react-dom/client"; //ReactDOM helps to renders React components to the browser's DOM
import { BrowserRouter } from "react-router-dom"; //It enables navigation between different components/pages without reloading the browser.
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx"; //Authorization context provider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
