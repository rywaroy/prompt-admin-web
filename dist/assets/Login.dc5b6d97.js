import{c as n,A as U,_ as A,j as $,J as C,k as O,r as S,F as M,a as i,o as q,e as B,w as c,V as y,W as k,u as m,X as N,h as I,Y as E,I as F}from"./index.5d395885.js";var H={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z"}}]},name:"lock",theme:"outlined"},R=H;function x(a){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?Object(arguments[e]):{},r=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable}))),r.forEach(function(o){D(a,o,t[o])})}return a}function D(a,e,t){return e in a?Object.defineProperty(a,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):a[e]=t,a}var g=function(e,t){var r=x({},e,t.attrs);return n(U,x({},r,{icon:R}),null)};g.displayName="LockOutlined";g.inheritAttrs=!1;var J=g,T={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"}}]},name:"user",theme:"outlined"},W=T;function P(a){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?Object(arguments[e]):{},r=Object.keys(t);typeof Object.getOwnPropertySymbols=="function"&&(r=r.concat(Object.getOwnPropertySymbols(t).filter(function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable}))),r.forEach(function(o){X(a,o,t[o])})}return a}function X(a,e,t){return e in a?Object.defineProperty(a,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):a[e]=t,a}var _=function(e,t){var r=P({},e,t.attrs);return n(U,P({},r,{icon:W}),null)};_.displayName="UserOutlined";_.inheritAttrs=!1;var Y=_;const G={class:"login"},Q={__name:"Login",setup(a){const e=$(),t=C(),r=O(!1),o=O(!1),l=S({account:"",password:""}),z=S({account:[{required:!0,message:"\u8BF7\u8F93\u5165\u8D26\u53F7"}],password:[{required:!0,message:"\u8BF7\u8F93\u5165\u5BC6\u7801"}]}),{validate:j,validateInfos:w}=M.useForm(l,z);window.localStorage.getItem("remember")&&(o.value=!0,l.account=window.localStorage.getItem("account"),l.password=window.localStorage.getItem("password"));const b=()=>{r.value||j().then(p=>{r.value=!0,E(p).then(s=>{r.value=!1;const{account:f,admin:u,token:v}=s.data;F().setUserInfo({name:f,permission:u}),window.localStorage.setItem("token",v),o.value?(window.localStorage.setItem("remember",!0),window.localStorage.setItem("account",p.account),window.localStorage.setItem("password",p.password)):(window.localStorage.removeItem("remember"),window.localStorage.removeItem("account"),window.localStorage.removeItem("password")),t.query.redirect?e.push(t.query.redirect):e.push("/")}).catch(()=>{r.value=!1})})};return(p,s)=>{const f=i("a-input"),u=i("a-form-item"),v=i("a-input-password"),h=i("a-checkbox"),L=i("a-button"),V=i("a-form");return q(),B("div",G,[n(V,null,{default:c(()=>[n(u,y(k(m(w).account)),{default:c(()=>[n(f,{value:l.account,"onUpdate:value":s[0]||(s[0]=d=>l.account=d),size:"large",type:"text",placeholder:"\u8D26\u53F7","allow-clear":""},{prefix:c(()=>[n(m(Y))]),_:1},8,["value"])]),_:1},16),n(u,y(k(m(w).password)),{default:c(()=>[n(v,{value:l.password,"onUpdate:value":s[1]||(s[1]=d=>l.password=d),size:"large",placeholder:"\u5BC6\u7801",onKeydown:N(b,["enter"])},{prefix:c(()=>[n(m(J))]),_:1},8,["value","onKeydown"])]),_:1},16),n(u,null,{default:c(()=>[n(h,{checked:o.value,"onUpdate:checked":s[2]||(s[2]=d=>o.value=d),style:{float:"left"}},{default:c(()=>[I("\u8BB0\u4F4F\u5BC6\u7801")]),_:1},8,["checked"])]),_:1}),n(u,{style:{"margin-top":"24px"}},{default:c(()=>[n(L,{size:"large",block:"",type:"primary",class:"login-button",loading:r.value,onClick:b},{default:c(()=>[I(" \u767B\u5F55 ")]),_:1},8,["loading"])]),_:1})]),_:1})])}}};var K=A(Q,[["__scopeId","data-v-c8505e08"]]);export{K as default};
