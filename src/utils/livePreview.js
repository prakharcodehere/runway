// Compact React Native → DOM shim, embedded directly in the srcdoc.
const RN_SHIM = `
(function(){
  var R = window.React;
  var h = R.createElement;

  function css(rnStyle) {
    if (!rnStyle) return {};
    var st = Object.assign({}, rnStyle);
    if (typeof st.lineHeight === 'number') st.lineHeight = st.lineHeight + 'px';
    if (st.borderWidth != null && !st.borderStyle) st.borderStyle = 'solid';
    if (st.borderTopWidth != null && !st.borderTopStyle) st.borderTopStyle = 'solid';
    if (st.borderBottomWidth != null && !st.borderBottomStyle) st.borderBottomStyle = 'solid';
    if (st.borderLeftWidth != null && !st.borderLeftStyle) st.borderLeftStyle = 'solid';
    if (st.borderRightWidth != null && !st.borderRightStyle) st.borderRightStyle = 'solid';
    if (st.flex === 1 || st.flex === '1') { st.minWidth = st.minWidth || 0; st.minHeight = st.minHeight || 0; }
    return st;
  }

  function s(base, extra) { return css(Object.assign({}, base, extra || {})); }

  function View(p) {
    var st = s({ display:'flex', flexDirection:'column', boxSizing:'border-box', position:'relative' }, p.style);
    return h('div', { style:st, onClick:p.onPress||p.onClick, className:p.className }, p.children);
  }
  function Text(p) {
    var st = s({ fontFamily:'inherit', fontSize:14, boxSizing:'border-box', display:'inline-block', maxWidth:'100%', wordBreak:'break-word', overflowWrap:'break-word', verticalAlign:'top' }, p.style);
    return h('span', { style:st }, p.children);
  }
  function ScrollView(p) {
    var horiz = p.horizontal;
    var st = s({ overflowY:horiz?'hidden':'auto', overflowX:horiz?'auto':'hidden', display:'flex', flexDirection:horiz?'row':'column', boxSizing:'border-box', flex:1, WebkitOverflowScrolling:'touch' }, p.style);
    var inner = s({ display:'flex', flexDirection:horiz?'row':'column', boxSizing:'border-box', minHeight:horiz?undefined:'100%' }, p.contentContainerStyle);
    return h('div', { style:st }, h('div', { style:inner }, p.children));
  }
  function SafeAreaView(p) {
    var st = s({ display:'flex', flexDirection:'column', flex:1, boxSizing:'border-box' }, p.style);
    return h('div', { style:st }, p.children);
  }
  function Pressable(p) {
    var [hov, setHov] = R.useState(false);
    var rawStyle = typeof p.style === 'function' ? p.style({ pressed:false, hovered:hov }) : p.style;
    var st = s({ cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxSizing:'border-box', userSelect:'none', WebkitUserSelect:'none' }, rawStyle);
    return h('div', { style:st, onClick:p.onPress, onMouseEnter:function(){ setHov(true); }, onMouseLeave:function(){ setHov(false); } },
      typeof p.children === 'function' ? p.children({ pressed:false }) : p.children);
  }
  function TouchableOpacity(p) {
    var st = s({ cursor:'pointer', display:'flex', flexDirection:'column', boxSizing:'border-box', opacity:p.disabled?0.4:1 }, p.style);
    return h('div', { style:st, onClick:p.onPress }, p.children);
  }
  function Image(p) {
    var st = s({ objectFit:p.resizeMode||'cover', display:'block', boxSizing:'border-box' }, p.style);
    return h('img', { src:p.source&&p.source.uri||p.source, style:st, alt:'' });
  }
  function TextInput(p) {
    var st = s({ fontFamily:'inherit', boxSizing:'border-box', border:'none', outline:'none', background:'transparent' }, p.style);
    return h('input', { style:st, value:p.value, placeholder:p.placeholder, onChange:function(e){ if(p.onChangeText) p.onChangeText(e.target.value); } });
  }
  function ActivityIndicator(p) {
    var size = p.size==='large'?36:20;
    var color = p.color||'#7cf7c9';
    return h('div', { style:{ width:size, height:size, borderRadius:'50%', border:'3px solid transparent', borderTopColor:color, animation:'rn-spin 0.8s linear infinite' } });
  }
  function FlatList(p) {
    var data = p.data||[];
    var st = s({ overflowY:'auto', display:'flex', flexDirection:p.horizontal?'row':'column', flex:1, boxSizing:'border-box' }, p.style);
    return h('div', { style:st }, data.map(function(item,i){ return p.renderItem({ item:item, index:i, separators:{} }); }));
  }
  function StatusBar() { return null; }
  function KeyboardAvoidingView(p) { return h(View, p, p.children); }
  function Modal(p) { return p.visible ? h('div', { style:{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}, p.children) : null; }

  var StyleSheet = { create:function(s){ return s; }, flatten:function(s){ return Object.assign.apply(Object,[{}].concat(Array.isArray(s)?s:[s])); }, hairlineWidth:1 };
  var Platform = { OS:'web', Version:1, select:function(o){ return o.web||o.default||o.ios||o.android; } };
  var Dimensions = { get:function(dim){ return dim==='window'||dim==='screen'?{ width:window.innerWidth, height:window.innerHeight, scale:1, fontScale:1 }:{}; }, addEventListener:function(){ return { remove:function(){} }; } };
  var Animated = {
    Value:function(v){ this._val=v; this.setValue=function(n){this._val=n;}; },
    View:View, Text:Text,
    createAnimatedComponent:function(C){ return C; },
    timing:function(val,cfg){ return { start:function(cb){ val.setValue(cfg.toValue); if(cb)cb({finished:true}); }, stop:function(){} }; },
    sequence:function(a){ return { start:function(cb){ a.forEach(function(x){x.start&&x.start();}); if(cb)cb({finished:true}); }, stop:function(){} }; },
    parallel:function(a){ return { start:function(cb){ a.forEach(function(x){x.start&&x.start();}); if(cb)cb({finished:true}); }, stop:function(){} }; },
    spring:function(val,cfg){ return { start:function(cb){ val.setValue(cfg.toValue); if(cb)cb({finished:true}); }, stop:function(){} }; },
    loop:function(a){ return a; },
  };
  var Easing = { linear:function(t){return t;}, ease:function(t){return t;}, bezier:function(){return function(t){return t;};}, in:function(e){return e;}, out:function(e){return e;}, inOut:function(e){return e;} };

  window.ReactNativeWeb = {
    View:View, Text:Text, ScrollView:ScrollView, FlatList:FlatList,
    SafeAreaView:SafeAreaView, Pressable:Pressable,
    TouchableOpacity:TouchableOpacity, TouchableHighlight:TouchableOpacity,
    TouchableWithoutFeedback:TouchableOpacity,
    Image:Image, TextInput:TextInput, ActivityIndicator:ActivityIndicator,
    KeyboardAvoidingView:KeyboardAvoidingView, Modal:Modal, StatusBar:StatusBar,
    StyleSheet:StyleSheet, Platform:Platform, Dimensions:Dimensions,
    Animated:Animated, Easing:Easing,
    useWindowDimensions:function(){ return { width:window.innerWidth, height:window.innerHeight, scale:1, fontScale:1 }; },
    useColorScheme:function(){ return 'dark'; },
    Alert:{ alert:function(t,m,b){ window.alert(t+(m?'\\n'+m:'')); if(b&&b[0]&&b[0].onPress)b[0].onPress(); } },
    Linking:{ openURL:function(u){ window.open(u,'_blank'); }, canOpenURL:function(){ return Promise.resolve(true); } },
  };

  var style = document.createElement('style');
  style.textContent = '@keyframes rn-spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
})();
`;

// Packages that are handled by the RN shim or built-in — don't load from CDN
const BUILTIN_PKGS = new Set([
  'react', 'React', 'react-dom',
  'react-native', 'react-native-web',
  'expo-status-bar', 'expo-constants', 'expo-font',
  'expo-linear-gradient', 'expo-blur', 'expo-haptics',
]);

export function detectPackages(fileContents) {
  const found = new Set();
  // Match: import X from 'pkg', import { X } from 'pkg', require('pkg')
  const re = /(?:from|require)\s*\(?\s*['"]([^'"./][^'"]*)['"]\s*\)?/g;
  for (const code of Object.values(fileContents)) {
    let m;
    while ((m = re.exec(code)) !== null) {
      const raw = m[1];
      // Handle scoped packages like @tanstack/react-query
      const name = raw.startsWith('@')
        ? raw.split('/').slice(0, 2).join('/')
        : raw.split('/')[0];
      if (!BUILTIN_PKGS.has(name) && !name.startsWith('expo-') && !name.startsWith('@expo/')) {
        found.add(name);
      }
    }
  }
  return [...found];
}

export function generateSrcdoc(files, fileContents, extraPackages = []) {
  const fileMap = {};
  for (const file of files) {
    if (!file.name.endsWith("/.gitkeep")) {
      fileMap[file.name] = fileContents[file.name] ?? file.code ?? "";
    }
  }

  const autoPackages = detectPackages(fileContents);
  const allPackages = [...new Set([...autoPackages, ...extraPackages])];

  const fileMapJson = JSON.stringify(fileMap);
  const allPackagesJson = JSON.stringify(allPackages);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;overflow:hidden}
  #root{height:100%;display:flex;flex-direction:column}
  body{background:#07111f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
  .err{padding:16px;font:11px/1.7 "IBM Plex Mono",monospace;color:#ff8080;background:#0d0000;height:100%;overflow:auto;white-space:pre-wrap}
</style>
</head>
<body>
<div id="root"></div>
<script src="https://unpkg.com/@babel/standalone@7.26.4/babel.min.js"></script>
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script>${RN_SHIM}</script>
<script>
// Catch errors thrown after the initial render (event handlers, effects,
// timers, rejected promises) — without this the preview just goes blank
// with no feedback when a candidate's code throws asynchronously.
window.addEventListener('error', function(e){
  var root=document.getElementById('root');
  if(root) root.innerHTML='<div class="err"><b style="color:#ff9b71">Runtime error</b>\\n'+(e.error&&e.error.message||e.message)+'</div>';
  window.parent.postMessage({ type:'runway-runtime-error', message:(e.error&&e.error.message||e.message) }, '*');
});
window.addEventListener('unhandledrejection', function(e){
  var root=document.getElementById('root');
  var message=(e.reason&&e.reason.message)||String(e.reason);
  if(root) root.innerHTML='<div class="err"><b style="color:#ff9b71">Unhandled promise rejection</b>\\n'+message+'</div>';
  window.parent.postMessage({ type:'runway-runtime-error', message:message }, '*');
});
</script>
<script type="module">
(async function(){
  if(typeof Babel==='undefined'){
    document.getElementById('root').innerHTML='<div class="err">Babel failed to load — check network</div>';
    return;
  }

  // ── Load npm packages from esm.sh ──────────────────────
  var __pkgs = {};
  var pkgNames = ${allPackagesJson};

  if (pkgNames.length > 0) {
    await Promise.all(pkgNames.map(async function(name) {
      try {
        var mod = await import('https://esm.sh/' + name + '?bundle');
        // Build a combined object: spreads named exports + attaches default
        // so both  import axios from 'axios'  and  import { get } from 'lodash'  work
        var combined = {};
        for (var k in mod) { try { combined[k] = mod[k]; } catch(e){} }
        if (mod.default !== undefined) {
          // If default is an object/function, copy its own keys too (lodash pattern)
          if (typeof mod.default === 'object' || typeof mod.default === 'function') {
            try { Object.assign(combined, mod.default); } catch(e){}
          }
          combined['default'] = mod.default;
        }
        combined['__esModule'] = true;
        __pkgs[name] = combined;
        window.parent.postMessage({ type:'runway-pkg', status:'loaded', name:name }, '*');
      } catch(e) {
        window.parent.postMessage({ type:'runway-pkg', status:'error', name:name, error:e.message }, '*');
      }
    }));
  }

  // ── Module registry ─────────────────────────────────────
  var files  = ${fileMapJson};
  var reg    = {};
  var errors = [];

  function req(from, dep) {
    if (dep==='react'||dep==='React') return React;
    if (dep==='react-dom') return ReactDOM;
    if (dep==='react-native'||dep==='react-native-web') return ReactNativeWeb;
    if (dep==='expo-status-bar') return { StatusBar: ReactNativeWeb.StatusBar };
    if (dep.startsWith('expo-')||dep.startsWith('@expo/')) return { default:{}, StatusBar:function(){return null;} };
    // npm package loaded from esm.sh
    if (__pkgs[dep] !== undefined) return __pkgs[dep];
    // Relative file import
    var parts = from.split('/').slice(0,-1);
    dep.split('/').forEach(function(p){
      if(p==='..')parts.pop(); else if(p!=='.')parts.push(p);
    });
    return reg[parts.join('/')]||{};
  }

  // ── Transpile + execute files ───────────────────────────
  var names = Object.keys(files).sort(function(a,b){
    if(a==='App.tsx')return 1; if(b==='App.tsx')return -1;
    return a.localeCompare(b);
  });

  for(var i=0;i<names.length;i++){
    var name=names[i];
    var code=files[name];
    if(!code)continue;
    var id=name.replace(/\\.(tsx?|jsx?)$/,'');

    // Skip non-code files
    if(name.endsWith('.json')){
      try{ reg[id]=JSON.parse(code); }catch(e){}
      continue;
    }
    if(name.endsWith('.md')||name.endsWith('.txt')||name.endsWith('.gitkeep')) continue;

    var isTSX=name.endsWith('.tsx')||name.endsWith('.jsx');
    var isTS=name.endsWith('.ts')||name.endsWith('.tsx');
    var presets=[['env',{modules:'commonjs',targets:{chrome:'90'}}]];
    if(isTSX) presets.unshift(['react',{pragma:'React.createElement',pragmaFrag:'React.Fragment'}]);
    if(isTS)  presets.unshift(['typescript']);

    try{
      var res=Babel.transform(code,{filename:name,presets:presets,sourceType:'module',configFile:false,babelrc:false});
      var fn=new Function('exports','module','require',res.code);
      var exp={};var mod={exports:exp};
      fn(exp,mod,function(dep){return req(id,dep);});
      reg[id]=mod.exports;
    }catch(e){
      errors.push(name+':\\n'+e.message);
    }
  }

  var root=document.getElementById('root');
  if(errors.length>0){
    root.innerHTML='<div class="err"><b style="color:#ff9b71">Compile error</b>\\n\\n'+errors.join('\\n\\n')+'</div>';
    return;
  }

  var AppMod=reg['App']||{};
  var App=AppMod.default||AppMod.App;
  if(!App){
    root.innerHTML='<div class="err">No default export found in App.tsx</div>';
    return;
  }

  try{
    ReactDOM.createRoot(root).render(React.createElement(App));
  }catch(e){
    root.innerHTML='<div class="err"><b style="color:#ff9b71">Runtime error</b>\\n'+e.message+'</div>';
  }
})();
</script>
</body>
</html>`;
}
