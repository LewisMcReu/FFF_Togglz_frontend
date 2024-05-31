import {useContext, useEffect, useState} from "react";
import FlagCanvas from "./FlagCanvas.jsx";
import {UserContext} from "./UserContext.js";
import {Link, useNavigate} from "react-router-dom";
import FeatureFlags, {useFeature} from "./FeatureFlags.js";

export default function MyFlagList() {
    const [flags, setFlags] = useState([]);
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const update_flag = useFeature(FeatureFlags.UPDATE_FLAG);

    useEffect(() => {
        fetch(`http://localhost:8080/flags?user=${user?.name}`).then(response => response.json().then(body => setFlags(body)));
    }, [user]);

    return <>
        <h1 className="text-center">My flags!</h1>
        <button className="m-auto d-block" onClick={() => navigate('/')}>Make a new flag</button>
        <main className="flag-list">{
            flags.map(flag => <div key={flag.id}>
                <FlagCanvas flag={flag}/>
                <p>{flag.name}</p>
                {updateEnabled &&
                    <button onClick={() => {
                        navigate(`/editflag/${flag.id}`)
                    }}>Edit
                    </button>
                }
            </div>)}
        </main>
        <Link to={"/list"}>All flags</Link>
    </>
}