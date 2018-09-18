window.ServerId = ""
window.gameId = "0"
window.matchId = ""
window.roomName = "001"
window.myAvatar = ""
window.myUserName = "testUser"
window.otherUserName = "otherUserName"
window.otherAvatar = ""
window.psuedoRandomSeed = 1;
window.CurrentStatus = false;
window.haveInvite = false;
window.inGame = false;
window.inSearch = false
window.myOpenId = ""
window.otherOpenId = ""

module.exports = {
 
    //psuedoRandomSeed : 10002301087,

    Prime : 50047,

    M : 982451653,
    
    NumberOfDifferences     :   14,
    
    NumberOfBlackAdvisor    :   2,

    NumberOfBlackCannnon    :   2,

    NumberOfBlackElephant   :  2,

    NumberOfBlackGeneral    :   1,

    NumberOfBlackHorse      :     2,

    NumberOfBlackPawn       :      5,

    NumberOfBlackRook       :      2,

    NumberOfRedAdvisor      :     2,

    NumberOfRedBishop       :      2,

    NumberOfRedCannon       :      2,

    NumberOfRedChariot      :     2,

    NumberOfRedHorse        :       2,

    NumberOfRedKing         :        1,

    NumberOfRedSoldier      :     5,


    board_coord : [
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""]
    ],

    pos_coord : [
        [,,,,,,,],
        [,,,,,,,],
        [,,,,,,,],
        [,,,,,,,]
    ],


    Current_piece: "",
    Current_click: "",
    
    Current_piece_attackable: [],
    Current_piece_walkable  : [],

    check : 1,

    XSLOTS : 4,
    YSLOTS : 8,

    checked: false,

    count : 0,
    moveCount: 0,
    

    moveCheck: 0,
    attackCheck: 0,

    CurrentAttackEffect: 0,
    CurrentSelectEffect: 0,

    IsBlack: false,
    
    flipped: 0,
}