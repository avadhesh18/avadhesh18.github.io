var bmr = '';
// Utility functions [UNIVERSAL]

if(localStorage.getItem('color') == 'dark'){
toggletheme('dark');
}
else {}

function toggletheme(color){
if(color == 'dark'){
	
	document.getElementById('cthemew').innerHTML = '<a onclick="toggletheme(\'light\')" id="themebtn">Light mode</a>';
document.documentElement.style.setProperty('--bodyc', '#111222');
document.documentElement.style.setProperty('--textc', 'white');
document.documentElement.style.setProperty('--linkc', '#d9d983');
document.documentElement.style.setProperty('--greyc', '#222233');
document.documentElement.style.setProperty('--lightc', '#ddd');
localStorage.setItem('color','dark');
}
else {
	
		document.getElementById('cthemew').innerHTML = '<a onclick="toggletheme(\'dark\')" id="themebtn">Dark mode</a>';
document.documentElement.style.setProperty('--bodyc', 'white');
document.documentElement.style.setProperty('--textc', 'black');
document.documentElement.style.setProperty('--linkc', '#27598c');
document.documentElement.style.setProperty('--greyc', '#eee');
document.documentElement.style.setProperty('--lightc', '#444');
localStorage.setItem('color','light');
}
	
}

function toggle(id){
var x = document.getElementsByClassName("show");
for (k = 0; k < x.length; k++) {
if(x[k].id != id) {
  x[k].classList.toggle("hidden");
  x[k].classList.toggle("show");  }
}
document.getElementById(id).classList.toggle("hidden");
document.getElementById(id).classList.toggle("show");
if(id == "subssearch"){
document.getElementById("subssearchi").focus();
}
}
function htmlDecode(input){
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}
function timeago(o){var t=Math.floor((new Date-o)/1e3),a=t/31536e3;return a>1?Math.floor(a)+"y":(a=t/2592e3)>1?Math.floor(a)+"mo":(a=t/86400)>1?Math.floor(a)+"d":(a=t/3600)>1?Math.floor(a)+"h":(a=t/60)>1?Math.floor(a)+"m":Math.floor(t)+"s"}
function addlc(to,data){
addarr = JSON.parse(localStorage.getItem(to) || '[]');
addarr.push(data);
localStorage.setItem(to,JSON.stringify(addarr));
}

function checklc(to,cfor){
chkarr = JSON.parse(localStorage.getItem(to) || '[]');
return chkarr.includes(cfor);

}
function removelc(to,cfor){
addarr = JSON.parse(localStorage.getItem(to) || '[]');
addarr = addarr.filter(function(item) {
    return item !== cfor
})

localStorage.setItem(to,JSON.stringify(addarr));
}

function searchsubs(q,event) {
if(bmr){bmr.abort();}
var xhr = new XMLHttpRequest();
 bmr = xhr;
xhr.onreadystatechange = function()
{
    if (xhr.readyState === 4 && xhr.status == 200)
    {
        subslist = xhr.response;
		fillsubs = '';
		console.log(subslist);
		for (var singlesub in subslist['subreddits'] )   
{
console.log(subslist[singlesub]);
fillsubs += '<a href="subreddit.html?r=' + subslist['subreddits'][singlesub]['name']+'">'+subslist['subreddits'][singlesub]['name']+'</a>';
}
document.getElementById('subslist').innerHTML = fillsubs;
		}
}
xhr.responseType = 'json';
xhr.open('GET', 'https://www.reddit.com//api/subreddit_autocomplete/.json?query='+q+'&include_profiles=false&include_over_18=true', true)
xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xhr.send();
if(q.length > 1){
var key = event.keyCode || event.charCode;
if( key == 13 ) {
if(typeof subslist['subreddits'] !== undefined) {
window.location = 'subreddit.html?r=' + subslist['subreddits'][0]['name']+'';}
}}
}

function unsubscribe(sub){removelc('subs',sub); subbtn = document.getElementById('subbtn');  
 subbtn.setAttribute( "onclick",  'subscribe(\''+sub+'\')' ); subbtn.innerHTML = 'Subscribe';}
function subscribe(sub){addlc('subs',sub);
subbtn = document.getElementById('subbtn');
subbtn.setAttribute( "onclick",  'unsubscribe(\''+sub+'\')' );
 subbtn.innerHTML = 'Unsubscribe';}


function postbuilder(post){
returnfpost = '';
timeagoed = timeago(post['created_utc']*1000);
returnfpost +=  '<div class="post" id="'+post['id']+'"><div class="post_author">'+ post['author'] +' &bull; <a target="_blank" href="subreddit.html?r='+post["subreddit"]+'">'+post["subreddit_name_prefixed"]+'</a> &bull; '+timeagoed+'</div><div class="post_link"><a href="comments.html?url=https://www.reddit.com'+ post['permalink']+'">'+post['title']+'</a></div>';
if(post["selftext_html"] != null){
returnfpost += '<div class="postc selftext">'+htmlDecode(post["selftext_html"])+'</div>';
}
urli = post['url_overridden_by_dest'];
if(post['crosspost_parent_list'] != null  || typeof post['crosspost_parent_list'] != "undefined"){
returnfpost += postbuilder(post['crosspost_parent_list'][0]);
}
else {
if(typeof urli != "undefined"){  returnfpost += urlpreview(urli,post); }
if(post['poll_data'] != null){
returnfpost += pollbuilder(post);
}
}

returnfpost += '<div class="post_meta">'+post['score']+' votes &bull; '+post['num_comments']+' comments</div></div>';
return returnfpost;
}
function urlpreview(urli,postjson) {
returnpost = '';	
	if (urli.match(/.(jpg|jpeg|png|gif)$/i))
	{
		returnpost += '<div class="postc singleimage"><img src="'+ urli +'"/></div>';
	}
	else if (urli.match(/www.reddit.com\/gallery/g))
	{
	returnpost += '<div class="postc gallery">';
	for(var singlept in postjson['media_metadata']) {
		singleptlink = postjson['media_metadata'][singlept]['s']['u'];
		if(typeof singleptlink == "undefined"){          singleptlink = postjson['media_metadata'][singlept]['s']['gif'];          }
		else {
		singleptlink = singleptlink.replace("preivew.redd", "i.redd");}
		returnpost +='<img src="'+singleptlink+'" />';
	}
	returnpost += '</div>';
	}
	else if (urli.match(/v.redd.it/g))
	{
	returnpost += '<div class="postc video">';
		if(postjson['secure_media'] != null) {
		vidurl =  postjson['secure_media']['reddit_video']['fallback_url']; 
		returnpost +='<video id="v'+postjson['id']+'" src="'+vidurl+'" poster="'+postjson["thumbnail"]+'" width="100%" height="240" preload="metadata" onplay="playaud(\'a'+postjson['id']+'\')"  onpause="pauseaud(\'a'+postjson['id']+'\')"  onseeking="pauseaud(\'a'+postjson['id']+'\')"  onseeked="seeked(\''+postjson['id']+'\')"   controls> </video><audio src="'+urli+'/DASH_audio.mp4" id="a'+postjson['id']+'" controls></audio>	';
		}
		else {returnpost += 'crosspost';}
	returnpost += '</div>';
	}
	else if (urli.match(/redgifs/g))
	{
	
	returnpost += '<div class="postc video">';
	vidurl = postjson['secure_media']['oembed']['thumbnail_url']; 
	if(typeof vidurl == "undefined"){
		vidurl = urli.replace("redgifs.com/watch/", "redgifs.com/ifr/");
		vidurl = '<iframe src="'+vidurl+'?autoplay=0" class="gifframe"></iframe>';
		returnpost += vidurl;
	}
	else {
		vidurl = vidurl.replace("-mobile.jpg", ".mp4")
		returnpost +='<video src="'+vidurl+'" poster="'+postjson["thumbnail"]+'" width="100%" height="240" preload="metadata" controls> </video>';
	}
	returnpost += '</div>';
	}
	else if (urli.match(/gfycat.com/g)){
	returnpost += '<div class="postc video">';
	if(postjson['secure_media'] == null || typeof postjson['secure_media']['oembed']['thumbnail_url'] == "undefined" ){
		vidurl = urli.replace("gfycat.com/", "gfycat.com/ifr/");
		vidurl = '<iframe src="'+vidurl+'?autoplay=0" class="gifframe"></iframe>';
		returnpost += vidurl;
	}
	else {
		vidurl = postjson['secure_media']['oembed']['thumbnail_url']; 
		vidurl = vidurl.replace("size_restricted.gif", "mobile.mp4")
		returnpost +='<video src="'+vidurl+'" poster="'+postjson["thumbnail"]+'" width="100%" height="240" preload="metadata" controls> </video>';
		}
	returnpost += '</div>';
	}
	else if (urli.match(/i.imgur.com(.*?)gifv/g))
	{
	returnpost += '<div class="postc video">';
	vidurl = urli.replace(".gifv", ".mp4") 
	returnpost +='<video src="'+vidurl+'" poster="'+postjson["thumbnail"]+'" width="100%" height="240" preload="metadata" controls> </video>';
	returnpost += '</div>';
	}
	else {
	thumbnailforit = '';
	if(postjson["thumbnail"].length > 9){
		returnpost += '<a href="'+ urli +'" target="_blank" class="wholethumb"><div class="postc thumblink"><div class="thumb"><img src="'+postjson["thumbnail"]+'"/></div><div class="thumblinklink">'+urli +'</div></div></a>';
	}
	else {
		returnpost += '<div class="postc link"><a href="'+ urli +'" target="_blank">'+thumbnailforit+''+urli +'</a></div>';
	}
	}
	return returnpost;
}
function pollbuilder(postjson) {
	returnpoll = '<div class="poll">';
	for(popt in postjson['poll_data']['options']){
		vote_count = postjson['poll_data']['options'][popt]['vote_count'];
		"undefined"==typeof vote_count&&(vote_count=" ");
		returnpoll += '<div class="polloption"><span class="polloptiontext">'+postjson['poll_data']['options'][popt]['text']+'</span> <span  class="votecount">'+vote_count+'</span>';
		if(vote_count != ' '){
			returnpoll += '<div class="optionmeter" style="width:'+postjson['poll_data']['options'][popt]['vote_count']/postjson['poll_data']['total_vote_count']*100+'%;"></div>';
		}
		returnpoll += '</div>';
	}
	returnpoll += '<div class="totalvotes">Total votes: '+postjson['poll_data']['total_vote_count']+'</div>';
	returnpoll += '</div>';
	return returnpoll;
}
function playaud(id){
document.getElementById(id).play();
}
function pauseaud(id){
document.getElementById(id).pause();
}
function seeked(id){
//document.getElementById(id).pause();
document.getElementById('a'+id).currentTime  = document.getElementById('v'+id).currentTime;
}
