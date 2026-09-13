import React,{useState}from"react";
import{View,Text,TextInput,Pressable,ScrollView,StyleSheet,Alert,ActivityIndicator}from"react-native";
import * as ImagePicker from"expo-image-picker";
import * as DocumentPicker from"expo-document-picker";
import * as Speech from"expo-speech";

const API="https://YOUR-BACKEND.example.com";

export default function App(){
 const[q,setQ]=useState(""); const[answer,setAnswer]=useState(""); const[busy,setBusy]=useState(false);
 const ask=async(text=q)=>{if(!text.trim())return;setBusy(true);setAnswer("");
 try{const f=new FormData();f.append("message",text);const r=await fetch(API+"/chat",{method:"POST",body:f});const j=await r.json();setAnswer(j.answer||"Няма отговор.");}
 catch(e){setAnswer("Не мога да се свържа със сървъра. Провери API адреса в App.js.");}finally{setBusy(false)}};
 const analyze=async(uri,name,type)=>{setBusy(true);setAnswer("");
 try{const f=new FormData();f.append("file",{uri,name,type});f.append("instruction","Обясни това на разбираем български. Кажи какво е, какво трябва да направя и какъв срок има. Не искай пароли или банкови кодове.");const r=await fetch(API+"/analyze",{method:"POST",body:f});const j=await r.json();setAnswer(j.answer||"Няма резултат.");}
 catch(e){setAnswer("Файлът е избран, но API адресът още не е настроен.");}finally{setBusy(false)}};
 const photo=async()=>{const p=await ImagePicker.requestCameraPermissionsAsync();if(!p.granted){Alert.alert("Нужна е камера","Разреши достъп до камерата.");return}const x=await ImagePicker.launchCameraAsync({mediaTypes:["images"],quality:.8});if(!x.canceled){const a=x.assets[0];analyze(a.uri,"photo.jpg","image/jpeg")}};
 const file=async()=>{const x=await DocumentPicker.getDocumentAsync({type:["application/pdf","image/*"]});if(!x.canceled){const a=x.assets[0];analyze(a.uri,a.name,a.mimeType||"application/octet-stream")}};
 const voice=()=>Speech.speak("Какво искаш да направиш?",{language:"bg-BG"});
 const preset=(s)=>{setQ(s);ask(s)};
 return <ScrollView style={s.page} contentContainerStyle={s.body}>
  <View style={s.header}><Text style={s.h1}>Дигитален помощник 🇧🇬</Text><Text style={s.sub}>Не знаеш какво да направиш? Покажи ми.</Text></View>
  <Text style={s.section}>Какво ти трябва?</Text>
  <View style={s.grid}>
   <Btn t="📸 Снимай документ" on={photo}/><Btn t="📄 Качи PDF/снимка" on={file}/>
   <Btn t="🏦 Банка" on={()=>preset("Как да направя безопасно плащане през електронното банкиране?")}/>
   <Btn t="🏛️ НАП" on={()=>preset("Получих документ от НАП. Как да разбера какво се иска от мен?")}/>
   <Btn t="🏥 еЗдраве" on={()=>preset("Как да намеря електронната си рецепта в еЗдраве?")}/>
   <Btn t="🛡️ Измама" on={()=>preset("Как да проверя дали SMS, сайт или съобщение е измама?")}/>
  </View>
  <TextInput value={q} onChangeText={setQ} placeholder="Напиши въпроса си..." multiline style={s.input}/>
  <Btn t="🤖 Попитай помощника" on={()=>ask()} primary/>
  <Btn t="🔊 Прочети отговора" on={()=>answer&&Speech.speak(answer,{language:"bg-BG"})}/>
  {busy&&<ActivityIndicator size="large" color="#2563EB" style={{margin:20}}/>}
  {!!answer&&<View style={s.card}><Text style={s.cardTitle}>Отговор</Text><Text style={s.answer}>{answer}</Text></View>}
  <Pressable onPress={voice} style={s.voice}><Text style={{fontSize:17}}>🎙️ Гласов режим</Text></Pressable>
  <Text style={s.warn}>⚠️ Никога не въвеждай PIN, пароли, CVV, пълни номера на карти или SMS кодове.</Text>
 </ScrollView>
}
function Btn({t,on,primary}){return <Pressable onPress={on} style={[s.btn,primary&&s.primary]}><Text style={[s.btnText,primary&&{color:"#fff"}]}>{t}</Text></Pressable>}
const s=StyleSheet.create({page:{flex:1,backgroundColor:"#F4F7FB"},body:{paddingBottom:30},header:{backgroundColor:"#2563EB",padding:24,paddingTop:55,borderBottomLeftRadius:28,borderBottomRightRadius:28},h1:{fontSize:28,fontWeight:"800",color:"#fff"},sub:{fontSize:16,color:"#fff",marginTop:6},section:{fontSize:21,fontWeight:"700",margin:18},grid:{flexDirection:"row",flexWrap:"wrap",gap:10,paddingHorizontal:16},btn:{backgroundColor:"#fff",borderRadius:18,padding:17,margin:5,elevation:2,flexGrow:1,minWidth:"44%"},primary:{backgroundColor:"#2563EB",marginHorizontal:18},btnText:{fontSize:16,fontWeight:"650"},input:{backgroundColor:"#fff",borderRadius:18,minHeight:100,margin:18,padding:16,fontSize:16,textAlignVertical:"top"},card:{backgroundColor:"#fff",borderRadius:18,margin:18,padding:18},cardTitle:{fontSize:19,fontWeight:"700",marginBottom:8},answer:{fontSize:16,lineHeight:24},voice:{margin:18,padding:18,borderRadius:18,backgroundColor:"#E7EEFF",alignItems:"center"},warn:{margin:18,color:"#555",fontSize:13}})
