
function IYYCommon(){this.eventsMap={};};IYYCommon.prototype.addEventListener=function(eventType,listenerFunc){if(this.eventsMap[eventType]==null){this.eventsMap[eventType]=[listenerFunc];}
else{this.eventsMap[eventType].push(listenerFunc);}};IYYCommon.prototype.removeEventListener=function(eventType){if(this.eventsMap[eventType]!=null){this.eventsMap[eventType]=[];}};IYYCommon.prototype.dispatchEvent=function(eventType,eventData){if(this.eventsMap[eventType]==null)return;for(var i=0;i<this.eventsMap[eventType].length;i++){switch(arguments.length){case 1:this.eventsMap[eventType][i]();break;case 2:this.eventsMap[eventType][i](eventData);break;default:}}};var debugMode=false;function IYY(){this.audio=new IYYAudio();this.channel=new IYYChannel();this.cloud=new IYYCloud();this.im=new IYYIM();this.net=new IYYNet();this.user=new IYYUser();var ret=callExternal("IYY_GetVersion();");var ver=new YYVersion();ver.majorVersion=ret.main_version;ver.minorVersion=ret.sub_version;this.version=ver;};IYY.prototype=new IYYCommon();IYY.ACTIVE="YY_ACTIVE";function IYYAudio(){};IYYAudio.prototype=new IYYCommon();IYYAudio.prototype.startRecord=function(fileName){var result;if(arguments.length==0){result=callExternal("IAudio_StartRecord('');");}
else{result=callExternal("IAudio_StartRecord(\""+fileName+"\");");}
return result.ret;};IYYAudio.prototype.stopRecord=function(){var result=callExternal("IAudio_StopRecord();");return result.ret;};IYYAudio.RECORD_ERR="YY_RECORD_ERR";IYYAudio.RECORD_FINISHED="YY_RECORD_FINISHED";function IYYChannel(){this.userListPopMenu=new IYYChannelUserListPopMenu();this.micList=new IYYChannelMicList();this.appMsg=new IYYChannelAppMsg();};IYYChannel.prototype=new IYYCommon();IYYChannel.prototype.getCurrentChannelInfo=function(){var result=callExternal("IChannel_GetCurrentChannelInfo();");if(result.ret==0)
{return parseChannelInfo(result);}
else
{return null;}};IYYChannel.prototype.getCurrentSubChannelInfo=function(){var result=callExternal("IChannel_GetCurrentSubChannelInfo();");if(result.ret==0)
{return parseChannelInfo(result);}
else
{return null;}};IYYChannel.prototype.getChannelInfo=function(cid){var result=callExternal("IChannel_GetChannelInfo("+cid+");");if(result.ret==0)
{return parseChannelInfo(result);}
else
{return null;}};IYYChannel.prototype.getRootChannelId=function(){var result=callExternal("IChannel_GetRootChannelId();");if(result.ret==0)
{return result.long_id;}
else
{return 0;}};IYYChannel.prototype.getSubChannelIds=function(cid){var result=callExternal("IChannel_GetSubChannelIds("+cid+");");if(result.ret==0)
{return result.ids;}
else
{return[];}};IYYChannel.CHANNEL_INFO_CHANGED="YY_CHANNEL_INFO_CHANGED";IYYChannel.FOCUS_CHANNEL_CHANGED="YY_FOCUS_CHANNEL_CHANGED";IYYChannel.SUB_CHANNEL_ADD="YY_SUB_CHANNEL_ADD";IYYChannel.SUB_CHANNEL_DEL="YY_SUB_CHANNEL_DEL";IYYChannel.USER_ENTER_CHANNEL="YY_USER_ENTER_CHANNEL";IYYChannel.USER_LEAVE_CHANNEL="YY_USER_LEAVE_CHANNEL";function IYYChannelAppMsg(){};IYYChannelAppMsg.prototype=new IYYCommon();IYYChannelAppMsg.prototype.sendMsgToSubChannel=function(subChannelId,msg,linkstart,linkend,token){msg=msg.replace(/\"/g,"\\\"");var result=callExternal("IChannelAppMsg_SendMsgToSubChannel("+subChannelId+",\""+msg+"\","+linkstart+","+linkend+","+token+");");return result.ret;};IYYChannelAppMsg.prototype.sendMsgToUsers=function(userList,msg,linkstart,linkend,token){msg=msg.replace(/\"/g,"\\\"");var result=callExternal("IChannelAppMsg_SendMsgToUsers(\"["+userList.toString()+"]\",\""+msg+"\","+linkstart+","+linkend+","+token+");");return result.ret;};IYYChannelAppMsg.APP_LINK_CLICKED="YY_APP_LINK_CLICKED";function IYYChannelMicList(){};IYYChannelMicList.prototype=new IYYCommon();IYYChannelMicList.prototype.getMicList=function(){var result=callExternal("IChannelMicList_GetMicList();");if(result.ret==0)
{return result.mic_list;}
else
{return[];}};IYYChannelMicList.USER_JOIN="YY_USER_JOIN";IYYChannelMicList.USER_LEAVE="YY_USER_LEAVE";IYYChannelMicList.USER_MOVE="YY_USER_MOVE";IYYChannelMicList.CLEAR="YY_USER_CLEAR";function IYYChannelUserListPopMenu(){};IYYChannelUserListPopMenu.prototype=new IYYCommon();IYYChannelUserListPopMenu.prototype.setPopMenu=function(menuText){var result=callExternal("IChannelUserListPopMenu_SetPopMenu(\""+menuText+"\");");return result.ret;};IYYChannelUserListPopMenu.prototype.unSetPopMenu=function(){var result=callExternal("IChannelUserListPopMenu_UnSetPopMenu();");return result.ret;};IYYChannelUserListPopMenu.CLICKED="YY_MENU_CLICKED";function IYYIM(){};IYYIM.prototype=new IYYCommon();IYYIM.prototype.chatTo=function(uid,msg){msg=msg.replace(/\"/g,"\\\"");var result=callExternal("IIM_ChatTo("+uid+",\""+msg+"\");");return result.ret;}
IYYIM.prototype.isFriend=function(uid){var result=callExternal("IIM_IsFriend("+uid+");");return result.is_friend;}
IYYIM.prototype.addFriend=function(uid){var result=callExternal("IIM_AddFriend("+uid+");");return result.ret;}
function IYYCloud(){};IYYCloud.prototype=new IYYCommon();IYYCloud.prototype.addData=function(int1,int2,str){if(arguments.length==0)return;str=str.replace(/\\/g,"\\\\");str=str.replace(/\"/g,"\\\"");switch(arguments.length){case 1:return callExternal("ICloud_AddData(0, 0, \""+arguments[0]+"\");");break;case 2:return callExternal("ICloud_AddData("+arguments[0]+", 0, \""+arguments[1]+"\");");break;case 3:return callExternal("ICloud_AddData("+arguments[0]+", "+arguments[1]+", \""+arguments[2]+"\");");break;default:}};IYYCloud.prototype.updateData=function(int1,int2,str,filter){var filterString="";var sp="";str=str.replace(/\\/g,"\\\\");str=str.replace(/\"/g,"\\\"");for(var i=0;i<filter.length;i++){filterString=filterString+sp+filter[i].toString();sp=",";}
var result=callExternal("ICloud_UpdateData("+int1+","+int2+" ,\""+str+"\", '["+filterString+"]');");return result.ret;};IYYCloud.prototype.deleteData=function(filter){var filterString="";var sp="";for(var i=0;i<filter.length;i++){filterString=filterString+sp+filter[i].toString();sp=",";}
var result=callExternal("ICloud_DeleteData('["+filterString+"]');");return result.ret;};IYYCloud.prototype.queryData=function(filter){var filterString="";var sp="";for(var i=0;i<filter.length;i++){filterString=filterString+sp+filter[i].toString();sp=",";}
var result=callExternal("ICloud_QueryData('["+filterString+"]');");if(result.ret==0)
{return parseCloudDataList(result.data);}
else
{return[]}}
function IYYNet(){};IYYNet.prototype=new IYYCommon();IYYNet.prototype.broadcastSubChannel=function(sub_channel_id,data){var result=callExternal("INet_BroadCastSubChannel("+sub_channel_id+",\""+encodeURI(data)+"\");");return result.ret;};IYYNet.prototype.broadcastAllChannel=function(data){var result=callExternal("INet_BroadCastAllChannel(\""+encodeURI(data)+"\");");return result.ret;};IYYNet.prototype.broadcastToUsers=function(data,u_array){var result=callExternal("INet_BroadCastToUsers(\""+encodeURI(data)+"\", \"["+u_array.toString()+"]\");");return result.ret;};IYYNet.CONNECTED="YY_CONNECTED";IYYNet.CLOSED="YY_CLOSED";IYYNet.RECV="YY_RECV";function IYYUser(){};IYYUser.prototype=new IYYCommon();IYYUser.prototype.getCurrentUserInfo=function(){var result=callExternal("IUser_GetCurrnetUserInfo();");if(result.ret==0)
{return parseUserInfo(result);}
else
{return null;}};IYYUser.prototype.getUserInfo=function(uid){var result=callExternal("IUser_GetUserInfo("+uid+");");if(result.ret==0)
{return parseUserInfo(result);}
else
{return null;}};IYYUser.USER_INFO_CHANGED="YY_USER_INFO_CHANGED";function callExternal(func){try{if(debugMode){var txtConsole=document.getElementById("txtConsole");if(txtConsole!=null)txtConsole.innerText="window.external."+func+"\n"+txtConsole.innerText;}
var retString=eval("window.external."+func);if(debugMode){if(txtConsole!=null)txtConsole.innerText=retString+"\n"+txtConsole.innerText;}
try{var retJson=eval("("+retString+")");}catch(exjson){throw"转json出错"+exjson;}
if(retJson.ret==null)throw"NO_RET";return retJson;}catch(ex){if(debugMode){if(txtConsole!=null)txtConsole.innerText="错误! 原因:"+ex+"\n"+txtConsole.innerText;}
if(ex=="NO_RET")return{ret:-2,msg:"返回信息没有ret属性"};else return{ret:-1,msg:"错误! 原因:"+ex};}}
window["yy"]=new IYY();function YYUserInfo(){this.name="";this.sex=0;this.uid=0;this.imId=0;this.role=0;this.points=0;this.level=0;this.sign="";}
function YYChannelInfo(){this.longId=0;this.shortId=0;this.name="";}
function YYVersion(){this.majorVersion=0;this.minorVersion=0;}
function YYCloudData(){this.uniqueKey="";this.createTime="";this.updateTime="";this.creatorUid=0;this.intValue1=0;this.intValue2=0;this.stringValue="";}
YYCloudData.prototype.toString=function(){var s="{\"uniqueKey\":\""+this.uniqueKey+"\",\"creatorUid\":"+this.creatorUid+",\"createTime\":\""+this.createTime+"\",\"updateTime\":\""+this.updateTime+"\",";s+="\"intValue1\":"+this.intValue1+",\"intValue2\":"+this.intValue2+",\"stringValue\":\""+this.stringValue+"\"}";return s;}
function YYCloudFilter(){this.field=0;this.op=0;this.value=null;this.condition=0;}
YYCloudFilter.EField={NONE:0,UNIQUE_KEY:1,USER_ID:2,EXTERNAL_VALUE1:3,EXTERNAL_VALUE2:4,CREATE_TIME:5,UPDATE_TIME:6};YYCloudFilter.EFilterOperator={NONE:0,EQ:1,GE:2,LE:3,GREATER:4,LESS:5};YYCloudFilter.EFilterCondition={NONE:0,AND:1,OR:2};YYCloudFilter.prototype.toString=function()
{switch(this.field){case YYCloudFilter.EField.EXTERNAL_VALUE1,YYCloudFilter.EField.EXTERNAL_VALUE2:return"{\"field\":"+this.field+",\"op\":"+this.op+",\"value\":"+this.value+",\"condition\":"+this.condition+"}";case YYCloudFilter.EField.UNIQUE_KEY:return"{\"field\":"+this.field+",\"op\":"+this.op+",\"value\":\""+this.value+"\",\"condition\":"+this.condition+"}";default:return"{\"field\":"+this.field+",\"op\":"+this.op+",\"value\":"+this.value+",\"condition\":"+this.condition+"}";}}
function IYY_OnActive(activeCode){yy.dispatchEvent(IYY.Active,{acttiveCode:activeCode});}
function IAudioEvent_OnRecordErr(err_code){yy.audio.dispatchEvent(IYYAudio.RECORD_ERR,{errCode:err_code});}
function IAudioEvent_OnRecordFinished(info){var retJson=eval("("+info+")");yy.audio.dispatchEvent(IYYAudio.RECORD_FINISHED,{result:retJson.result,fileName:retJson.file_name});}
function IChannelEvent_OnFocusChannelChannged(info){var retJson=eval("("+info+")");yy.channel.dispatchEvent(IYYChannel.FOCUS_CHANNEL_CHANGED,{departedId:retJson.departed_id,nowId:retJson.now_id});}
function IChannelEvent_OnChannelInfoChannged(info){var retJson=eval("("+info+")");yy.channel.dispatchEvent(IYYChannel.CHANNEL_INFO_CHANGED,parseChannelInfo(info));}
function IChannelEvent_OnSubChannelDel(cid){yy.channel.dispatchEvent(IYYChannel.SUB_CHANNEL_DEL,{cid:cid});}
function IChannelEvent_OnSubChannelAdd(info){var retJson=eval("("+info+")");yy.channel.dispatchEvent(IYYChannel.SUB_CHANNEL_ADD,{cid:retJson.cid,pcid:retJson.pcid});}
function IChannelEvent_OnUserEnterChannel(info){var retJson=eval("("+info+")");yy.channel.dispatchEvent(IYYChannel.USER_ENTER_CHANNEL,{uid:retJson.uid,cid:retJson.cid});}
function IChannelEvent_OnUserLeaveChannel(info){var retJson=eval("("+info+")");yy.channel.dispatchEvent(IYYChannel.USER_LEAVE_CHANNEL,{uid:retJson.uid,cid:retJson.cid});}
function IChannelUserPopMenuEvent_OnClicked(info){var retJson=eval("("+info+")");yy.channel.userListPopMenu.dispatchEvent(IYYChannelUserListPopMenu.CLICKED,{uid:retJson.uid,cid:retJson.cid});}
function INetEvent_OnConnected(result){yy.net.dispatchEvent(IYYNet.CONNECTED,{result:result});}
function INetEvent_OnClosed(result){yy.net.dispatchEvent(IYYNet.CLOSED,{result:result});}
function INetEvent_OnRecv(data){yy.net.dispatchEvent(IYYNet.RECV,{data:decodeURI(data)});}
function IChannelAppLinkEvent_OnAppLinkClicked(token){yy.channel.appMsg.dispatchEvent(IYYChannelAppMsg.APP_LINK_CLICKED,{token:token});}
function IMicListEvent_OnUserJoin(uid){yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_JOIN,{uid:uid});}
function IMicListEvent_OnUserLeave(uid){yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_LEAVE,{uid:uid});}
function IMicListEvent_OnUserMove(info){var retJson=eval("("+info+")");yy.channel.micList.dispatchEvent(IYYChannelMicList.USER_MOVE,{moveId:retJson.move_id,toAfterId:retJson.to_after_id});}
function IMicListEvent_OnClear(){yy.channel.micList.dispatchEvent(IYYChannelMicList.CLEAR);}
function IUserEvent_OnUserInfoChanged(info){var retJson=eval("("+info+")");yy.user.dispatchEvent(IYYUser.USER_INFO_CHANGED,parseUserInfo(retJson));}
function parseChannelInfo(info){var cinfo=new YYChannelInfo();cinfo.longId=info.long_id;cinfo.shortId=info.short_id;cinfo.name=info.name;return cinfo;}
function parseUserInfo(info){var userInfo=new YYUserInfo();userInfo.uid=info.uid;userInfo.name=info.name;userInfo.imId=info.imid;userInfo.role=info.role;userInfo.points=info.points;userInfo.level=info.level;userInfo.sex=info.sex;userInfo.sign=info.sign;return userInfo;}
function parseCloudDataList(data){var dataArray=[];for(var i=0;i<data.length;i++)
{var dt=new YYCloudData();dt.uniqueKey=data[i].key;dt.createTime=data[i].create_time;dt.updateTime=data[i].update_time;dt.creatorUid=data[i].creator_uid;dt.intValue1=data[i].int1;dt.intValue2=data[i].int2;dt.stringValue=data[i].str;dataArray.push(dt);}
return dataArray;}