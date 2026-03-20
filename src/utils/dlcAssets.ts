// DLC and Overlay Assets for Custom Chess

// Diarrhea Word Set DLC - Maps piece types to the text-based images
// Piece mapping:
// King = Diarrhea, Queen = Religion, Rook = DC comics, 
// Knight = Marvel Comics, Bishop = Capcom, Pawn = Porn

export const DIARRHEA_WORD_SET = {
  wK: require('../../assets/dlc/diarrhea-word-set/King.png'),
  wQ: require('../../assets/dlc/diarrhea-word-set/Queen.png'),
  wR: require('../../assets/dlc/diarrhea-word-set/Rook.png'),
  wB: require('../../assets/dlc/diarrhea-word-set/Bishop.png'),
  wN: require('../../assets/dlc/diarrhea-word-set/Knight.png'),
  wP: require('../../assets/dlc/diarrhea-word-set/Pawn.png'),
  // Black pieces use the same images (text is still visible)
  bK: require('../../assets/dlc/diarrhea-word-set/King.png'),
  bQ: require('../../assets/dlc/diarrhea-word-set/Queen.png'),
  bR: require('../../assets/dlc/diarrhea-word-set/Rook.png'),
  bB: require('../../assets/dlc/diarrhea-word-set/Bishop.png'),
  bN: require('../../assets/dlc/diarrhea-word-set/Knight.png'),
  bP: require('../../assets/dlc/diarrhea-word-set/Pawn.png'),
};

// Overlays - These get overlaid on custom pieces (30% opacity)
export const PIECE_OVERLAYS = {
  K: require('../../assets/overlays/King.png'),
  Q: require('../../assets/overlays/Queen.png'),
  R: require('../../assets/overlays/Rook.png'),
  B: require('../../assets/overlays/Bishop.png'),
  N: require('../../assets/overlays/Knight.png'),
  P: require('../../assets/overlays/Pawn.png'),
};

// Corner Letters - Small letters for the corners of custom pieces
export const CORNER_LETTERS = {
  K: require('../../assets/corner-letters/King.png'),
  Q: require('../../assets/corner-letters/Queen.png'),
  R: require('../../assets/corner-letters/Rook.png'),
  B: require('../../assets/corner-letters/Bishop.png'),
  N: require('../../assets/corner-letters/Knight.png'),
  P: require('../../assets/corner-letters/Pawn.png'),
};

// DLC IDs matching web-store.tsx product IDs
export const DLC_IDS = {
  DIARRHEA_SET: 'diarrhea_set',
  LETTER_OVERLAYS: 'letter_overlays',
  AUTO_OVERLAYS: 'auto_overlays',
  CORNER_LETTERS: 'corner_letters',
};

// Helper function to get piece type from key (e.g., 'wK' -> 'K')
export const getPieceType = (pieceKey: string): string => {
  return pieceKey.charAt(1);
};

// Helper function to check if DLC is purchased
export const isDLCPurchased = async (dlcId: string, purchases: string[]): Promise<boolean> => {
  // Premium unlock includes all DLC
  if (purchases.includes('premium_unlock') || purchases.includes('premium_plus')) {
    return true;
  }
  return purchases.includes(dlcId);
};
