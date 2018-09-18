cc.Class({
    extends: cc.Component,

    properties: ()=>({
        _GameControl: require("GameControl"),
        _MatchBtn: cc.Node,
        _start : cc.Node,
        _UnMatchBtn: cc.node,
        _InviteBtn: cc.node,
        _MoreBtn: cc.node,
        _ShareBtn: cc.node,
        _ChampionBtn: cc.node,

        Board:{
            default: null,
            type: cc.Prefab
        },
    }),

    onLoad: function(){
        cc.game.addPersistRootNode(this.node)
        this._start = cc.find("Canvas/Start")
        //this._board = cc.find("Canvas/board")
        //this._board.active = false;

        this._MatchBtn = cc.find("Canvas/Start/MatchBtn")
        this._UnMatchBtn = cc.find("Canvas/Start/UnMatchBtn")
        this._InviteBtn = cc.find("Canvas/Start/InviteBtn")
        this._ShareBtn = cc.find("Canvas/Start/ShareBtn")
        this._ChampionBtn = cc.find("Canvas/Start/ChampionBtn")
        this._MoreBtn = cc.find("Canvas/Start/MoreBtn")

        this._MatchBtn.on(cc.Node.EventType.MOUSE_UP, () => this.MatchBtnClick(), this._MatchBtn)
        this._UnMatchBtn.on(cc.Node.EventType.MOUSE_UP, () => this)

        this._GameControl = this.node.getComponent('GameControl')
    },

    MatchBtnClick: function(){
        this._GameControl.searchPlayer();
        cc.director.preloadScene("Game")
        this._UnMatchBtn.active = true
        this._InviteBtn.active = false
        this._ShareBtn.active = false
        this._ChampionBtn.active = false
        this._MoreBtn.active = false
        this._MatchBtn.active = false
        window.inSearch = true
    },

    UnMatchClick: function(){
        this._GameControl.cancelSearch();
        this._UnMatchBtn.active = false
        this._InviteBtn.active = true
        this._ShareBtn.active = true
        this._ChampionBtn.active = true
        this._MoreBtn.active = true
        this._MatchBtn.active = true
        window.inSearch = false
    },

    enterGame: function(){
        //cc.log("hello")
        //this._board.active = true;
        window.inGame = true
        window.inSearch = false
        cc.director.loadScene("Game")
        /*
        var tempNode = cc.find("Canvas")
        var NewBoard = cc.instantiate(this.Board);
        NewBoard.setPosition(cc.p(tempNode.x, tempNode.y));
        NewBoard.parent = tempNode
        this._start.active = false;
        */
    }
});
