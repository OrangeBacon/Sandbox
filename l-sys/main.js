"use strict";
function ui(){
  var elems = document.querySelectorAll('.branch')
  for(var i=0;i<elems.length;i++){
    if(i==0){
	  elems[i].children[3].children[0].setAttribute('hidden','')
	} else {
	  elems[i].children[3].children[0].removeAttribute('hidden')
	}
  }
}
function add(e){
  e.stopPropagation();
  var elem = document.querySelector('.branch').cloneNode('deep');
  elem.children[1].children[0].value = ''
  var i=0;
  var node = e.target.parentNode.parentNode.nextSibling
  while(node.nodeName == '#text'){
    node = node.nextSibling;
  }
  console.log(elem,node)
  e.target.parentNode.parentNode.parentNode.insertBefore(elem,node)
  var elems = document.querySelectorAll('.branch')
  for(var i=0;i<elems.length;i++){
    elems[i].children[2].children[0].onclick = function(e){add(e)}
	elems[i].children[3].children[0].onclick = function(e){remove(e)}
  }
}
function remove(e){
  e.target.parentNode.parentNode.remove()
}
var w,h,c
function canvas(){
  w = c.width = document.getElementById('out').clientWidth
  h = c.height = document.getElementById('out').clientHeight
  requestAnimationFrame(canvas)
}
var saves = []
function parse(code,b){
  for(var i=0;i<code.length;i++){
    if(code.charAt(i) == 'B'){
	  code = code.split('');
      code[i] = branch(b);
      code = code.join('');
	}
  }
  code = code.split('');
  // if(code.indexOf('B') != -1){
    // console.log(code)
	// code = parse(code.join(''),b+1)
  // }
  console.log(code)
  return code
}
function branch(id){
  return document.querySelectorAll('.branch')[id].childNodes[3].childNodes[0].value || document.querySelector('.leaf').childNodes[3].childNodes[0].value
}
function render(){
  
}
window.onload = function(){
  setInterval(ui,50);
  var elems = document.querySelectorAll('.branch')
  for(var i=0;i<elems.length;i++){
    elems[i].children[2].children[0].addEventListener('click',function(e){add(e)},true)
	elems[i].children[3].children[0].addEventListener('click',function(e){remove(e)},true)
  }
  document.getElementById('start').addEventListener('click',function(){parse(document.getElementById('data-trunk').value,0)})
  c = document.getElementById('canvas')
  requestAnimationFrame(canvas)
}