/* ===================== Sự kiện (mẫu xAPI) ===================== */
const VERB={answered:'đã trả lời',watched:'đã xem video',studied:'đã học ví dụ',passed:'qua màn',failed:'chưa qua màn',earned:'nhận sao',assigned:'mở buổi',activated:'kích hoạt Toán Jenny',awarded:'được tặng thẻ',purchased:'đã mua'};
export function log(actor,verb,objName,_n,result){
  const who=S.st[actor]?S.st[actor].name:'Giáo viên';
  S.events.push({actor:{name:who,account:{name:actor}},verb:{id:'http://adlnet.gov/expapi/verbs/'+verb,display:{vi:VERB[verb]||verb}},object:{id:'jenny:'+encodeURIComponent(objName),definition:{name:{vi:objName}}},result:result||{},context:{extensions:{'jenny:day':S.day}},timestamp:new Date().toISOString()});
  if(S.events.length>3000)S.events.splice(0,S.events.length-3000);
}
export const evDay=e=>e.context.extensions['jenny:day'];

