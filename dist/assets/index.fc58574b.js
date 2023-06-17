import{g as F,b as O,u as V,c as A,d as U}from"./index.b7fe3e33.js";import{d as N,r as $,F as j,a as d,o as G,b as B,w as l,c as o,h as _,i as q,m as w,u as h,t as L,k as y,n as M,p as C,e as T,g as R,q as D,M as E}from"./index.5d395885.js";const P=N({name:"UpdateGroup"}),z=Object.assign(P,{props:{visible:Boolean,formState:Object},emits:["update:visible","submit"],setup(s,{emit:v}){const p=s,I={span:4},a={span:14},i=$({name:[{required:!0,message:"\u8BF7\u8F93\u5165\u540D\u79F0"}],orderIndex:[{required:!0,message:"\u8BF7\u8F93\u5165\u6392\u5E8F"}]}),{resetFields:f,validate:g,validateInfos:k}=j.useForm(p.formState,i),x=()=>{v("update:visible",!1)},S=()=>{g().then(()=>{v("submit",L(p.formState))})};return(e,t)=>{const n=d("a-form-item"),u=d("a-input"),c=d("a-input-number"),r=d("a-form"),b=d("a-modal");return G(),B(b,{title:s.formState.id?"\u7F16\u8F91":"\u65B0\u589E",visible:s.visible,onCancel:x,onOk:S},{default:l(()=>[o(r,{"label-col":I,"wrapper-col":a},{default:l(()=>[o(n,{label:"\u7236\u7EA7"},{default:l(()=>[_(q(s.formState.parentName),1)]),_:1}),o(n,w({label:"\u540D\u79F0"},h(k).name),{default:l(()=>[o(u,{value:s.formState.name,"onUpdate:value":t[0]||(t[0]=m=>s.formState.name=m)},null,8,["value"])]),_:1},16),o(n,w({label:"\u6392\u5E8F"},h(k).orderIndex),{default:l(()=>[o(c,{value:s.formState.orderIndex,"onUpdate:value":t[1]||(t[1]=m=>s.formState.orderIndex=m)},null,8,["value"])]),_:1},16)]),_:1})]),_:1},8,["title","visible"])}}}),H={class:"table-page-wrapper"},J={class:"table-page-toolbar"},K=C("div",{class:"table-title"},"\u67E5\u8BE2\u8868\u683C",-1),Q={class:"table-operation"},W=N({name:"Group"}),Z=Object.assign(W,{setup(s){const v=[{title:"\u540D\u79F0",dataIndex:"name"},{title:"\u6392\u5E8F",dataIndex:"orderIndex"},{title:"\u64CD\u4F5C",dataIndex:"action",width:"220px"}],p=y([]);let I;const a=$({}),i=y(!1),f=()=>{F().then(e=>{I=e.data;const t=O(e.data);p.value=t})},g=e=>{a.id=null,a.name="",a.orderIndex=10,e&&(a.parentId=e.id,a.parentName=e.name),i.value=!0},k=e=>{if(a.id=e.id,a.name=e.name,a.orderIndex=e.orderIndex,a.parentId=e.parentId,e.parentId){const t=I.find(n=>n.id===e.parentId);a.parentName=t?t.name:null}i.value=!0},x=e=>{const{id:t,name:n,orderIndex:u,parentId:c}=e;t?V({id:t,name:n,orderIndex:u,parentId:c}).then(r=>{i.value=!1,f()}):A({name:n,orderIndex:u,parentId:c}).then(r=>{i.value=!1,f()})},S=e=>{E.confirm({title:"\u786E\u8BA4\u5220\u9664",content:`\u786E\u8BA4\u5220\u9664\u5206\u7EC4${e.name}\u5417\uFF1F`,onOk(){U({id:e.id}).then(t=>{f()})}})};return M(()=>{f()}),(e,t)=>{const n=d("a-button"),u=d("a-table"),c=d("page-container");return G(),B(c,null,{default:l(()=>[C("div",H,[C("div",J,[K,C("div",Q,[o(n,{type:"primary",onClick:t[0]||(t[0]=r=>g())},{default:l(()=>[_("\u65B0\u5EFA")]),_:1})])]),o(u,{"row-key":"id",loading:e.loading,"data-source":p.value,columns:v,pagination:e.pagination,"row-selection":e.rowSelection,onChange:e.handleTableChange},{bodyCell:l(({column:r,record:b})=>[r.dataIndex==="action"?(G(),T(R,{key:0},[o(n,{type:"link",onClick:m=>g(b)},{default:l(()=>[_("\u65B0\u589E")]),_:2},1032,["onClick"]),o(n,{type:"link",onClick:m=>k(b)},{default:l(()=>[_("\u7F16\u8F91")]),_:2},1032,["onClick"]),o(n,{type:"link",danger:"",onClick:m=>S(b)},{default:l(()=>[_("\u5220\u9664")]),_:2},1032,["onClick"])],64)):D("",!0)]),_:1},8,["loading","data-source","pagination","row-selection","onChange"])]),o(z,{visible:i.value,"onUpdate:visible":t[1]||(t[1]=r=>i.value=r),"form-state":a,onSubmit:x},null,8,["visible","form-state"])]),_:1})}}});export{Z as default};