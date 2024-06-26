import './App.css'
import FlagDesigner from "./FlagDesigner.jsx";
import {UserContext} from "./UserContext.js";
import {useEffect, useState} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import FlagList from "./FlagList.jsx";
import MyFlagList from "./MyFlagList.jsx";
import {EditFlag} from "./EditFlag.jsx";
import {FeatureContext, RELEASE_TOGGLE} from "./FeatureFlags.js";
import UnderConstruction from "./UnderConstruction.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <FlagDesigner/>
    },
    {
        path: "/list",
        element: <FlagList/>
    },
    {
        path: "/mylist",
        element: <MyFlagList/>
    },
    {
        path: "/editflag/:id",
        element: <EditFlag/>,
        loader: ({params}) => {
            return fetch(`http://localhost:8080/flags/${params.id}`);
        },

    }
]);

function App() {
    const [features, setFeatures] = useState({})
    const [featuresReady, setFeaturesReady] = useState(false)
    const releaseToggle = features[RELEASE_TOGGLE];
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/actuator/togglz").then(response => response.json().then(body => {
            setFeatures(body.reduce((a, v) => ({...a, [v.name]: v}), {}));
            setFeaturesReady(true);
        }), () => {
            //do nothing but prevent error logging
        });
    }, []);

    return (
        featuresReady ?
            <FeatureContext.Provider value={features}>
                {releaseToggle.enabled ?
                    <UserContext.Provider value={user}>
                        <RouterProvider router={router}/>
                        <select className="form-control" value={user?.name || ""}
                                onChange={event => setUser(getUser(event.target.value))}>
                            <option value="">No user</option>
                            <option value="sheldon">Sheldon</option>
                            <option value="leonard">Leonard</option>
                            <option value="raj">Raj</option>
                            <option value="howard">Howard</option>
                        </select>
                    </UserContext.Provider> :
                    <UnderConstruction/>}
            </FeatureContext.Provider>
            : <></>);
}

function getUser(name) {
    if (name === 'sheldon') {
        return {name, token: 'c2hlbGRvbjpiYXppbmdh'}
    }
    if (name === 'leonard') {
        return {name, token: 'bGVvbmFyZDpiYXppbmdh'}
    }
    if (name === 'raj') {
        return {name, token: 'cmFqOmJhemluZ2E='}
    }
    if (name === 'howard') {
        return {name, token: 'aG93YXJkOmJhemluZ2E='}
    }
}

export default App;
