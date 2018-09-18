// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var mqtt = require('Mqtt/mqttServer');
var gameUtils = require("gameUtils");
var com = require('./Common');

cc.Class({
    
    extends: cc.Component,

    properties: ()=>({
        _mqttCallback: require('MqttCallback'),


        BlackAdvisor:{
          default: null,
          type: cc.Prefab
        },
        BlackCannon:{
          default: null,
          type: cc.Prefab
        },
        BlackElephant:{
          default: null,
          type: cc.Prefab
        },
        BlackGeneral:{
          default: null,
          type: cc.Prefab
        },
        BlackHorse:{
          default: null,
          type: cc.Prefab
        },
        BlackPawn:{
          default: null,
          type: cc.Prefab
        },
        BlackRook:{
          default: null,
          type: cc.Prefab
        },
        RedAdvisor:{
          default: null,
          type: cc.Prefab
        },
        RedBishop:{
          default: null,
          type: cc.Prefab
        },
        RedCannon:{
          default: null,
          type: cc.Prefab
        },
        RedChariot:{
          default: null,
          type: cc.Prefab
        },
        RedHorse:{
          default: null,
          type: cc.Prefab
        },
        RedKing:{
          default: null,
          type: cc.Prefab
        },
        RedSoldier:{
          default: null,
          type: cc.Prefab
        },
    }),

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        cc.game.addPersistRootNode(this.node)
        this._mqttCallback = this.node.getComponent('MqttCallback')
        this.connectMqtt()
        gameUtils.gameCtrl = this;
    },
    
    connectMqtt: function () {
        mqtt.serverConnect("testUser",
        obj => this._mqttCallback.ConnectSucc(obj),
        obj => this._mqttCallback.MqttReceive(obj),
        obj => this._mqttCallback.ConnectLost(obj)
        )
    },

    searchPlayer: function(){
        mqtt.send(mqtt.ServerTopics.Search, `{"gameid":"${gameId}","mode":"0","searchNumber":"2"}`)
    },

    cancelSearch: function(){
        mqtt.send(mqtt.ServerTopics.CancelSearch, `{"gameid":"${gameId}","mode":"0"}`)
    },

    Flip: function(x,y){
      //cc.log(com.IsBlack)
      var flag = true;
      var tempNode = cc.find("Canvas/board/NewUnknownPiece" + `_${x}_${y}`)
      tempNode.destroy();
      var next = this.nextRandom();

      var tempx = x;
      var tempy = y;
      //cc.log("this is the next", next)
      while (flag){
          switch (next){
              case 0:
              if (com.NumberOfBlackAdvisor - 1 >= 0){
                  com.NumberOfBlackAdvisor -= 1
                  var NewBlackAdvisor = cc.instantiate(this.BlackAdvisor);
                  NewBlackAdvisor.name = "BlackAdvisor" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewBlackAdvisor.name;
                  NewBlackAdvisor.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewBlackAdvisor.parent = tempNode.parent;
                  NewBlackAdvisor.Level = 6;
                  NewBlackAdvisor.Black = true;
                  //cc.log(NewBlackAdvisor.Level);
                  flag = false
                  //console.log("hello");
                  return    
              }
              case 1:
              //cc.log("here we go")
              if (com.NumberOfRedAdvisor - 1 >= 0){
                  com.NumberOfRedAdvisor -= 1
                  var NewRedAdvisor = cc.instantiate(this.RedAdvisor);
                  NewRedAdvisor.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewRedAdvisor.parent = tempNode.parent;
                  NewRedAdvisor.name = "RedAdvisor" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewRedAdvisor.name;
                  flag = false
                  NewRedAdvisor.Level = 6;
                  NewRedAdvisor.Black = false;
                  //console.log("hello");
                  return    
              }
              case 2:
              if (com.NumberOfBlackElephant - 1 >= 0){
                  com.NumberOfBlackElephant -= 1;
                  var NewBlackElephant = cc.instantiate(this.BlackElephant);
                  NewBlackElephant.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewBlackElephant.parent = tempNode.parent;
                  NewBlackElephant.name = "BlackElephant" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewBlackElephant.name;
                  flag = false;
                  NewBlackElephant.Level = 5;
                  NewBlackElephant.Black = true;
                  //console.log("hello");
                  return
              }
              case 3:
              if (com.NumberOfRedBishop - 1 >= 0){
                  com.NumberOfRedBishop -= 1;
                  var NewRedBishop = cc.instantiate(this.RedBishop);
                  NewRedBishop.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewRedBishop.parent = tempNode.parent;
                  NewRedBishop.name = "RedBishop" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewRedBishop.name;
                  flag = false
                  NewRedBishop.Level = 5;
                  NewRedBishop.Black = false;
                  //console.log("hello, bishop");
                  return    
              }
              case 4:
              if (com.NumberOfBlackRook - 1 >= 0){
                  com.NumberOfBlackRook -= 1
                  var NewBlackRook = cc.instantiate(this.BlackRook);
                  NewBlackRook.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewBlackRook.parent = tempNode.parent;
                  NewBlackRook.name = "BlackRook" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewBlackRook.name;
                  flag = false
                  NewBlackRook.Level = 4;
                  NewBlackRook.Black = true;
                  //console.log("hello");
                  return    
              }
              case 5:
              //cc.log("here?")
              if (com.NumberOfRedChariot - 1 >= 0){
                  //cc.log("or here?");
                  com.NumberOfRedChariot -= 1
                  var NewRedChariot = cc.instantiate(this.RedChariot);
                  NewRedChariot.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewRedChariot.parent = tempNode.parent;
                  NewRedChariot.name = "RedChariot" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewRedChariot.name;
                  flag = false
                  NewRedChariot.Level = 4;
                  NewRedChariot.Black = false;
                  //console.log("hello");
                  return    
              }
              case 6:
              //cc.log("or here???")
              if (com.NumberOfBlackHorse - 1 >= 0){
                  com.NumberOfBlackHorse -= 1
                  var NewBlackHorse = cc.instantiate(this.BlackHorse);
                  NewBlackHorse.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewBlackHorse.parent = tempNode.parent;
                  NewBlackHorse.name = "BlackHorse" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewBlackHorse.name;
                  flag = false
                  NewBlackHorse.Level = 3;
                  NewBlackHorse.Black = true;
                  //console.log("hello");
                  return    
              }
              case 7:
              if (com.NumberOfRedHorse - 1 >= 0){
                  com.NumberOfRedHorse -= 1
                  var NewRedHorse = cc.instantiate(this.RedHorse);
                  NewRedHorse.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewRedHorse.parent = tempNode.parent;
                  NewRedHorse.name = "RedHorse" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewRedHorse.name;
                  flag = false
                  NewRedHorse.Level = 3;
                  NewRedHorse.Black = false;
                  //console.log("hello");
                  return    
              }
              case 8:
              if (com.NumberOfBlackCannnon - 1 >= 0){
                  com.NumberOfBlackCannnon -= 1
                  var NewBlackCannon = cc.instantiate(this.BlackCannon);
                  NewBlackCannon.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewBlackCannon.parent = tempNode.parent;
                  NewBlackCannon.name = "BlackCannon" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewBlackCannon.name;
                  flag = false
                  NewBlackCannon.Level = 2;
                  NewBlackCannon.Black = true;
                  //console.log("hello");
                  return    
              }
              case 9:
              if (com.NumberOfRedCannon - 1 >= 0){
                  com.NumberOfRedCannon -= 1
                  var NewRedCannon = cc.instantiate(this.RedCannon);
                  NewRedCannon.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewRedCannon.parent = tempNode.parent;
                  NewRedCannon.name = "RedCannon" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewRedCannon.name;
                  flag = false
                  //console.log("hello");
                  NewRedCannon.Level = 2;
                  NewRedCannon.Black = false;
                  return    
              }
              case 10:
              if (com.NumberOfBlackGeneral - 1 >= 0){
                  com.NumberOfBlackGeneral -= 1
                  var NewBlackGeneral = cc.instantiate(this.BlackGeneral);
                  NewBlackGeneral.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewBlackGeneral.parent = tempNode.parent;
                  NewBlackGeneral.name = "BlackGeneral" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewBlackGeneral.name;
                  flag = false
                  NewBlackGeneral.Level = 7;
                  NewBlackGeneral.Black = true;
                  //console.log("hello");
                  return    
              }
              case 11:
              if (com.NumberOfRedKing - 1 >= 0){
                  com.NumberOfRedKing -= 1
                  var NewRedKing = cc.instantiate(this.RedKing);
                  NewRedKing.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewRedKing.parent = tempNode.parent;
                  NewRedKing.name = "RedKing" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewRedKing.name;
                  flag = false
                  NewRedKing.Level = 7;
                  NewRedKing.Black = false;
                  //console.log("hello");
                  return    
              }
              case 12:
              if (com.NumberOfBlackPawn - 1 >= 0){
                  com.NumberOfBlackPawn -= 1
                  var NewBlackPawn = cc.instantiate(this.BlackPawn);
                  NewBlackPawn.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewBlackPawn.parent = tempNode.parent;
                  NewBlackPawn.name = "BlackPawn" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewBlackPawn.name;
                  flag = false
                  NewBlackPawn.Level = 1;
                  NewBlackPawn.Black = true;
                  //console.log("hello");
                  return    
              }
              case 13:
              if (com.NumberOfRedSoldier - 1 >= 0){
                  com.NumberOfRedSoldier -= 1
                  var NewRedSoldier = cc.instantiate(this.RedSoldier);
                  NewRedSoldier.setPosition(cc.p(tempNode.x, tempNode.y));
                  NewRedSoldier.parent = tempNode.parent;
                  NewRedSoldier.name = "RedSoldier" + tempNode.name.slice(-4);
                  com.board_coord[tempx][tempy] = NewRedSoldier.name;
                  flag = false
                  NewRedSoldier.Level = 1;
                  NewRedSoldier.Black = false;
                  //console.log("hello");
                  return    
              }
          }
          next = 0;
      }
  },


  hash: function(x){
      //cc.log(com.Prime * x)
      //console.log(com.Prime * x % this.NumberOfDifferences)
      return (com.Prime * x % com.M)
  },

  nextRandom: function(){
      //cc.log(com.psuedoRandomSeed)
      //console.log("where are you")
      //console.log("here," , this.psuedoRandomSeed);
      psuedoRandomSeed = this.hash(psuedoRandomSeed);
      //cc.log(com.psuedoRandomSeed);
      //cc.log(com.psuedoRandomSeed % com.NumberOfDifferences);
      return psuedoRandomSeed % com.NumberOfDifferences;
  },

  ToKill: function(curPiece, desPiece){
    var tempCurPiece = cc.find("Canvas/board/" + curPiece)
    var tempDesPiece = cc.find("Canvas/board/" + desPiece)
    tempCurPiece.setPosition(tempDesPiece.x, tempDesPiece.y)
    com.board_coord[tempCurPiece.name.slice(-3,-2)][tempCurPiece.name.slice(-1)] = ""
    tempCurPiece.name = tempCurPiece.name.slice(0, -4) + "_" + tempDesPiece.name.slice(-3,-2) + "_" + tempDesPiece.name.slice(-1)
    com.board_coord[tempDesPiece.name.slice(-3,-2)][tempDesPiece.name.slice(-1)] = tempCurPiece.name
    tempDesPiece.destroy();
    com.Current_piece = ""
  },
  ToDie: function(curPiece, desPiece){
    var tempCurPiece = cc.find("Canvas/board/" + curPiece)
    var tempDesPiece = cc.find("Canvas/board/" + desPiece)
    com.board_coord[desPiece.slice(-3,-2)][desPiece.slice(-1)] = ""
    com.board_coord[curPiece.slice(-3,-2)][curPiece.slice(-1)] = ""
    tempCurPiece.destroy();
    tempDesPiece.destroy();
    com.Current_piece = ""
  },
  ToSacrifice: function(curPiece, desPiece){
    var tempCurPiece = cc.find("Canvas/board/" + curPiece)
    //var tempDesPiece = cc.find("Canvas/board/" + desPiece)
    com.board_coord[curPiece.slice(-3,-2)][curPiece.slice(-1)] = ""
    tempCurPiece.destroy();
    com.Current_piece = ""
  },

  
  Step: function(curPiece, desPos){
    var tempNode = cc.find("Canvas/board/" + curPiece);
    com.board_coord[curPiece.slice(-3,-2)][curPiece.slice(-1)] = "";
    tempNode.setPosition(com.pos_coord[desPos.slice(0,1)][desPos.slice(-1)].x,com.pos_coord[desPos.slice(0,1)][desPos.slice(-1)].y);
    tempNode.name = tempNode.name.slice(0,-4) + "_" + desPos;
    com.board_coord[desPos.slice(0,1)][desPos.slice(-1)] = tempNode.name;
    com.Current_piece = "";
  },

  CannonAttack: function(curPiece, desPiece){
    var tempCurPiece = cc.find("Canvas/board/" + curPiece)
    var tempDesPiece = cc.find("Canvas/board/" + desPiece)
    tempCurPiece.setPosition(tempDesPiece.x, tempDesPiece.y)
    com.board_coord[tempCurPiece.name.slice(-3,-2)][tempCurPiece.name.slice(-1)] = ""
    tempCurPiece.name = tempCurPiece.name.slice(0, -4) + "_" + tempDesPiece.name.slice(-3,-2) + "_" + tempDesPiece.name.slice(-1)
    com.board_coord[tempDesPiece.name.slice(-3,-2)][tempDesPiece.name.slice(-1)] = tempCurPiece.name
    tempDesPiece.destroy();
    com.Current_piece = ""
  },

  SwitchSide: function(){
    CurrentStatus = !CurrentStatus
  },

  firstFlip: function(SeedNumber){
    if (CurrentStatus){
        if ((((com.Prime * psuedoRandomSeed % com.M) % com.NumberOfDifferences) % 2) == 0){
          com.IsBlack = true;
        }
        else{
          com.IsBlack = false;
        }
      }
      else{
        if ((((com.Prime * psuedoRandomSeed % com.M) % com.NumberOfDifferences) % 2) == 1){
          com.IsBlack = true;
        }
        else{
          com.IsBlack = false;
        }
      }
  },



  update: function () {
      //每帧读取FrameList
      this.readFrameList()
    },
    //读取帧信息 
  readFrameList: function () {
      var chatJson = mqtt.FrameChats.pop()
      if (chatJson == undefined || chatJson.length == 0)
        return
      //取出操作信息
      var ChatUser = chatJson.User  //用户名
      var ChatName = chatJson.Name  //操作的名称
      var ChatInstruction = chatJson.Instruction //操作的状态（自定义字段
      //判断用户操作
      //对应处理逻辑
      if (ChatUser == myUserName) {
        switch (ChatName) {
                case 'flip':
                    this.Flip(ChatInstruction[0], ChatInstruction[1])
                    break
                case 'tokill':
                    ChatInstruction = ChatInstruction.split(",")   
                    this.ToKill(ChatInstruction[0],ChatInstruction[1])
                    break
                case 'toDie':
                    ChatInstruction = ChatInstruction.split(",")
                    this.ToDie(ChatInstruction[0],ChatInstruction[1])
                    break
                case 'toSacrifice':
                    ChatInstruction = ChatInstruction.split(",")
                    this.ToSacrifice(ChatInstruction[0],ChatInstruction[1])
                    break
                case 'step':
                    ChatInstruction = ChatInstruction.split(",")
                    this.Step(ChatInstruction[0],ChatInstruction[1])
                    break
                case 'CannonAttack':
                    ChatInstruction = ChatInstruction.split(",")
                    this.CannonAttack(ChatInstruction[0], ChatInstruction[1])
                    break
                case 'firstFlip':
                    this.firstFlip(ChatInstruction[0])
                    this.SwitchSide()
                    break
          }
      } else {
          switch (ChatName) {
                case 'flip':
                    this.Flip(ChatInstruction[0], ChatInstruction[1])
                    break
                case 'tokill':
                    ChatInstruction = ChatInstruction.split(",")   
                    this.ToKill(ChatInstruction[0],ChatInstruction[1])
                    break
                case 'toDie':
                    ChatInstruction = ChatInstruction.split(",")
                    this.ToDie(ChatInstruction[0],ChatInstruction[1])
                    break
                case 'toSacrifice':
                    ChatInstruction = ChatInstruction.split(",")
                    this.ToSacrifice(ChatInstruction[0],ChatInstruction[1])
                    break
                case 'step':
                    ChatInstruction = ChatInstruction.split(",")
                    this.Step(ChatInstruction[0],ChatInstruction[1])
                    break
                case 'CannonAttack':
                    ChatInstruction = ChatInstruction.split(",")
                    this.CannonAttack(ChatInstruction[0], ChatInstruction[1])
                    break
                case 'firstFlip':
                    this.firstFlip(ChatInstruction[0])
                    this.SwitchSide()
                    break
          }
      }
      this.SwitchSide();
      cc.log(com.board_coord)
    },
});