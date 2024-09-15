import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { pick } from "lodash";
import { Square } from "chess.js";
import { Piece } from "react-chessboard/dist/chessboard/types";

export interface IHighlightedSquares {
  [square: string]: React.CSSProperties;
}

type TBoard = {
  showPromotionDialog: boolean;
  highlightedSquares: IHighlightedSquares;
  selectedSquare: Square | null;
  selectedPiece: Piece | null;
  promotionSquare: Square | null;
};

type TAction = {
  setShowPromotionDialog: (showPromotionDialog: boolean) => void;
  setHighlightedSquares: (highlightedSquares: IHighlightedSquares) => void;
  setSelectedSquare: (selectedSquare: Square | null) => void;
  setSelectedPiece: (selectedPiece: Piece | null) => void;
  setPromotionSquare: (promotionSquare: Square | null) => void;
};

type TBoardState = TAction & TBoard;

const INITIAL_STATE = {
  showPromotionDialog: false,
  highlightedSquares: {},
  selectedSquare: null,
  selectedPiece: null,
  promotionSquare: null,
};

// Create your store, which includes both state and (optionally) actions
export const useStore = create<TBoardState>((set) => ({
  ...INITIAL_STATE,
  setShowPromotionDialog: (showPromotionDialog: boolean) => {
    set({ showPromotionDialog });
  },
  setHighlightedSquares: (highlightedSquares: IHighlightedSquares) => {
    set({ highlightedSquares });
  },
  setSelectedSquare: (selectedSquare: Square | null) => {
    set({ selectedSquare });
  },
  setSelectedPiece: (selectedPiece: Piece | null) => {
    set({ selectedPiece });
  },
  setPromotionSquare: (promotionSquare: Square | null) => {
    set({ promotionSquare });
  },
}));

export const useBoardStore = (value?: Array<keyof TBoardState>) => {
  return useStore(
    useShallow((state) => {
      if (Array.isArray(value)) {
        return pick(state, value);
      }

      return state;
    })
  );
};
