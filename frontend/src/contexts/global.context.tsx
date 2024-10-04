import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { pick } from "lodash";

type TPopup = {
    message: string,
    type: string,
    showPopUp: boolean;
}

type TState = {
    popUpDetails: TPopup
};

type TAction = {
    alertPopUp: (popup: TPopup) => void;
};

const INITIAL_STATE = {
    popUpDetails: {
        message: "",
        type: "info",
        showPopUp: false
    }
};

type TGlobalState = TAction & TState;

export const useStore = create<TGlobalState>((set) => ({
    ...INITIAL_STATE,
    alertPopUp: (popUpDetails: TPopup) => {
        set({popUpDetails })
    }
}));

export const useGlobalStore = (value?: Array<keyof TGlobalState>) => {
  return useStore(
    useShallow((state) => {
      if (Array.isArray(value)) {
        return pick(state, value);
      }

      return state;
    })
  );
};
