// DLC and Overlay Assets for Custom Chess

// Diarrhea Word Set DLC - Maps piece types to the text-based images
// Piece mapping:
// King = Diarrhea, Queen = Religion, Rook = DC comics, 
// Knight = Marvel Comics, Bishop = Capcom, Pawn = Porn

export const DIARRHEA_WORD_SET = {
  // White pieces
  wK: require('../../assets/dlc/diarrhea-word-set/white/King.png'),
  wQ: require('../../assets/dlc/diarrhea-word-set/white/Queen.png'),
  wR: require('../../assets/dlc/diarrhea-word-set/white/Rook.png'),
  wB: require('../../assets/dlc/diarrhea-word-set/white/Bishop.png'),
  wN: require('../../assets/dlc/diarrhea-word-set/white/Knight.png'),
  wP: require('../../assets/dlc/diarrhea-word-set/white/Pawn.png'),
  // Black pieces
  bK: require('../../assets/dlc/diarrhea-word-set/black/King.png'),
  bQ: require('../../assets/dlc/diarrhea-word-set/black/Queen.png'),
  bR: require('../../assets/dlc/diarrhea-word-set/black/Rook.png'),
  bB: require('../../assets/dlc/diarrhea-word-set/black/Bishop.png'),
  bN: require('../../assets/dlc/diarrhea-word-set/black/Knight.png'),
  bP: require('../../assets/dlc/diarrhea-word-set/black/Pawn.png'),
};

// Overlays - These get overlaid on custom pieces (30% opacity)
// White overlays for black pieces, black overlays for white pieces
export const PIECE_OVERLAYS_WHITE = {
  K: require('../../assets/overlays/white/King.png'),
  Q: require('../../assets/overlays/white/Queen.png'),
  R: require('../../assets/overlays/white/Rook.png'),
  B: require('../../assets/overlays/white/Bishop.png'),
  N: require('../../assets/overlays/white/Knight.png'),
  P: require('../../assets/overlays/white/Pawn.png'),
};

export const PIECE_OVERLAYS_BLACK = {
  K: require('../../assets/overlays/black/King.png'),
  Q: require('../../assets/overlays/black/Queen.png'),
  R: require('../../assets/overlays/black/Rook.png'),
  B: require('../../assets/overlays/black/Bishop.png'),
  N: require('../../assets/overlays/black/Knight.png'),
  P: require('../../assets/overlays/black/Pawn.png'),
};

// Legacy export for backwards compatibility
export const PIECE_OVERLAYS = PIECE_OVERLAYS_WHITE;

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
