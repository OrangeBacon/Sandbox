// self contained self executing function
// except for defining variable to equal function,
// can be removed along with the return value of
// the function without breaking anything.
var main = (function(){
  // utils
  // construct element with given type, content and properties.
  // content can either be a string or a nodelist
  // args is an object where the properties are attribute names
  //  and the values are the value of that attribute.
  function el(type,content,args){
    // create element
    var element = document.createElement(type)
	//append content
	if(typeof content == 'string'){
	  element.innerHTML = content;
	} else {
	  for(var i=0;i<content.length;i++){
	    element.appendChild(content[i])
	  }
	}
	// set attributes to element
	var keys = Object.keys(args);
	for(var i=0;i<keys.length;i++){
	  element.setAttribute(keys[i],args[keys[i]])
	}
	return element;
  }
  
  // add to chat
  var chat = {
    // say message into chat as if said by user.
	// argument: message - string
    say(message){
	  document.getElementById('out').appendChild(
	    el('div',[
		  el('div',message,{'class':'text'})
		],{'class':'message-me'})
	  )
	},
	// say message into chat as if said by another person.
	// both arguments are strings
	hear(from,message){
	  document.getElementById('out').appendChild(
	    el('div',[
		  el('div',from,{'class':'from'}),
		  el('div',message,{'class':'text'})
		],{'class':'message'})
	  )
	}
  }
  
  // functions for the website
  var web = {
  
  }
  
  // main loop
  function main(){
    for(var i=0;i<storyline.length;i++){
	  storyline[i].run()
	}
  }
  
  // the core, tells the program what to do
  var storyline = [
    {run:function(){chat.hear('Mum','Well, as we just moved here perhaps you should check it out, see what the town is like')},delay:0}
    
  ]
  //external hooks, can be safely removed :)
  return {
    utils: {
	  el
	},
	chat,
	web,
	main
  }
})();