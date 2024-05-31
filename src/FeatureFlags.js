import {createContext, useContext} from "react";
import {UserContext} from "./UserContext.js";

export const SAVE_FLAG = "save_flag";
export const LIKE_FLAG = "like_flag";
export const UPDATE_FLAG = "update_flag";
export const CHARGE = "charge_layer";
export const NASA = "nasa_emblem";
export const COLOUR_PICKER = "colour_picker";
export const RELEASE_TOGGLE = "release_toggle";

function splitAndTrim(value) {
    return value.split(",").map(v => v.trim());
}

export const FeatureContext = createContext({});

export const useFeature = (featureName) => {
    const features = useContext(FeatureContext);
    const user = useContext(UserContext);
    const feature = features[featureName];
    if (feature?.enabled) {
        if (feature.strategy === 'username') {
            if (feature.params.users === '*') return true;
            const users = splitAndTrim(feature.params.users)
            return users.includes(user);
        }
        return true;
    }
    return false;
}

export default {
    SAVE_FLAG,
    LIKE_FLAG,
    UPDATE_FLAG,
    CHARGE,
    NASA,
    COLOUR_PICKER,
    RELEASE_TOGGLE
};