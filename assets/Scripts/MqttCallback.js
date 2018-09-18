var mqtt = require('Mqtt/mqttServer')
var com = require('./Common')

var MqttCallback = cc.Class({
  extends:cc.Component,
  properties:()=>({
    _uiMgr:require('../UIManager')
  }),
  onLoad:function(){
    cc.game.addPersistRootNode(this.node)
    this._uiMgr = this.node.getComponent("UIManager")
  },
  //连接成功
  ConnectSucc: function (obj) {
    myUserName = "testUser" + Math.round(Math.random()*1000)
    mqtt.send(mqtt.ServerTopics.Login, `{\"userName\":\"${myUserName}\"}`)
  },
  //接收消息
  MqttReceive: function (obj) {
    //取出topic
    var topic = obj.destinationName
    //取出payloadString
    var payload = JSON.parse(obj.payloadString)

    switch(topic){
      case mqtt.ServerTopics.GameStart://游戏开始
        roomName = payload.roomName 
        psuedoRandomSeed = payload.seed
        ServerId = payload.serverId
        matchId = payload.matchId
        cc.log(psuedoRandomSeed)
        cc.log(payload)
        mqtt.updateTopic()
        for (let i = 0; i < payload.playerNo.length; i++) {
          if( payload.playerNo[i].user == myUserName){
            myAvatar = payload.playerNo[i].avataurl
          }else{
            otherUserName = payload.playerNo[i].otherUserName
            otherAvatar = payload.playerNo[i].otherAvatar
          }
        }
        for (let i = 0; i < payload.playerNo.length; i++) {
          if (payload.playerNo[i].user == myUserName){
            //cc.log(payload.playerNo[i].number)
            //cc.log(psuedoRandomSeed % 2)
            if (psuedoRandomSeed % 2 == payload.playerNo[i].number - 1){
                CurrentStatus = true;
            }
          }
        }
        //初始化游戏相关布尔值
        //isOlGame = true
        //进入游戏
        
        /*
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
        */
        this._uiMgr.enterGame()
      break
    }
  },
  //断开连接
  ConnectLost: function (obj) {
    console.log(`Mqtt Connect Lost!`)
    console.log(obj)
  }
})


module.exports = MqttCallback