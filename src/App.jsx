import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import NoPage from './pages/NoPage';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        index
                        element={<Home />}
                    ></Route>
                    <Route
                        path='/home'
                        element={<Home />}
                    ></Route>
                    <Route
                        path='/login'
                        element={<Login />}
                    ></Route>
                    <Route
                        path='*'
                        element={<NoPage />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;
