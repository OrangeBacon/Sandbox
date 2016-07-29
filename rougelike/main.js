var map;
var canvas;
var ctx;
var tilesheetimg;
var sheetlookup = [];
var seed;
var player = [0,0,0,0];
var render = true;
var cycles = 0;
var lastkey = undefined;
function init(){
  canvas = document.getElementById('c');
  ctx = canvas.getContext('2d');
  ctx.font = "30px calibri";
  ctx.fillText("Loading ...",50,50);
  tilesheetimg = document.createElement('img');
  tilesheetimg.src = 'tilesheet.png';
  tilesheetimg.onload = function(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        sheetlookup = JSON.parse(xhr.responseText);
        map = makemap(3,16);
        rendermap(ctx,map);
        window.addEventListener("keydown", function(e){
          if(lastkey==undefined){
            lastkey = e.keyIdentifier;
          }
        },true);
        requestAnimationFrame(tick);
      }
    }
    xhr.open("GET","tiles.json",true)
    xhr.send();
  }
}
function handleKey(key){
  if(key)console.log(key);
  if(key == "Up"){
    if(player[3] == 0){
      if(player[1] !== 0){
        player[1]--;
        player[3] = map[0][0].length-1;
        render = true;
      }
    } else {
      player[3]--;
      render = true;
    }
  } else if(key == "Right"){
    if(player[2] == map[0][0][0].length-1){
      if(player[0] !== map.length-1){
        player[0]++;
        player[2] = 0;
        render = true;
      }
    } else {
      player[2]++;
      render = true;
    }
  } else if(key == "Down"){
    if(player[3] == map[0][0].length-1){
      if(player[1] !== map.length-1){
        player[1]++;
        player[3] = 0;
        render = true;
      }
    } else {
      player[3]++;
      render = true;
    }
  } else if(key == "Left"){
    if(player[2] == 0){
      if(player[0] !== 0){
        player[0]--;
        player[2] = map[0][0].length-1;
        render = true;
      }
    } else {
      player[2]--;
      render = true;
    }
  }
  lastkey = undefined;
}
function tick(){
  if(cycles%10==0){
    if(cycles%60==0){
      render = true;
    }
    handleKey(lastkey);
    if(render){
      rendermap(ctx,map);
      render = false;
    }
  }
  requestAnimationFrame(tick);
  cycles++
}
window.onload = init;
function makemap(mapsize,chunksize){
  seed = [[2,0,4],[3,3,2],[4,2,1]]//randnum(mapsize);
  var map = [];
  var id = 0;
  console.log('seed: ',seed);
  for(var x = 0; x < mapsize; x++){
    map.push([]);48;
    for(var y = 0; y < mapsize; y++){
      map[x][y] = makechunk([seed.get(y).get(x),seed.get(y+1).get(x),seed.get(y).get(x+1),seed.get(y+1).get(x+1)],chunksize);
    id++;
    }
  }
  return map;
}

function makechunk(corners,size){
  var chunk = [];
  for(var i = 0;i < size; i++){
    chunk.push([]);
  }
  left = vals(corners[0],corners[1],size);
  for(var i = 0; i < size; i++){
    chunk[i][0] = left[i];
  }
  right = vals(corners[2],corners[3],size);
  for(var i = 0; i < size; i++){
    chunk[i][size-1] = right[i];
  }
  for(var i = 0; i < size; i++){
    chunk[i] = vals(chunk[i][0],chunk[i][size-1],size);
  }
  return chunk;
}
function mapget(chunkx,chunky,tilex,tiley,map){
  var ret = [];
  var chunk = map[chunkx][chunky];
  function tileget(cx,cy,tx,ty){
    if(tx<0){
    cx-=1;
    tx=chunk.length-1;
  }
  if(ty<0){
    cy-=1;
    ty=chunk.length-1;
  }
  if(cx<0){
    cx=map.length-1;
  }
  if(cy<0){
    cy=map.length-1;
  }
  if(tx>chunk.length-1){
    cx+=1;
    tx=0
  }
  if(ty>chunk.length-1){
    cy+=1;
    ty=0;
  }
  if(cx>map.length-1){
    cx=0;
  }
  if(cy>map.length-1){
    cy=0;
  }
  return map[cy][cx][tx][ty];
  }
  ret.push(tileget(chunkx,chunky,tilex-1,tiley-1,map));
  ret.push(tileget(chunkx,chunky,tilex,tiley-1,map));
  ret.push(tileget(chunkx,chunky,tilex+1,tiley-1,map));
  ret.push(tileget(chunkx,chunky,tilex-1,tiley,map));
  ret.push(tileget(chunkx,chunky,tilex,tiley,map));
  ret.push(tileget(chunkx,chunky,tilex+1,tiley,map));
  ret.push(tileget(chunkx,chunky,tilex-1,tiley+1,map));
  ret.push(tileget(chunkx,chunky,tilex,tiley+1,map));
  ret.push(tileget(chunkx,chunky,tilex+1,tiley+1,map));
  return ret;
}
function tileindexget(arr){
  var index = arr.join('');
  if(sheetlookup[index]!=undefined)return sheetlookup[index];
  else return index;
}
function rendermap(ctx,map){
  var tilexsize = 16;
  var tileysize = 16;
  for(var x = 0; x < map.length; x++){
    for(var y = 0; y < map[x].length; y++){
      renderchunk(ctx,x,y,map,tilexsize,tileysize);
    }
  }
}
function renderchunk(ctx,xpos,ypos,map,tilexsize,tileysize){
  var chunk = map[ypos][xpos];
  // ctx.strokeStyle = 'black';
  // ctx.lineWidth = 3;
  // ctx.strokeRect(xpos*tilexsize*chunk[xpos].length,ypos*tileysize*chunk[ypos].length,tilexsize*chunk[xpos].length,tileysize*chunk[ypos].length);
  for(var x = 0;x < chunk.length; x++){
    for(var y = 0; y < chunk[x].length; y++){
      ctx.drawImage(tilesheetimg,tileindexget(mapget(xpos,ypos,x,y,map))*16,0,16,16,xpos*tilexsize*chunk[xpos].length+x*tilexsize,ypos*tileysize*chunk[ypos].length+y*tileysize,16,16)
      if(player[0]==xpos && player[1]==ypos && player[2]==x && player[3]==y){
        ctx.fillRect(xpos*tilexsize*chunk[xpos].length+x*tilexsize,ypos*tileysize*chunk[ypos].length+y*tileysize,16,16)
      }
      // ctx.lineWidth = 1;
      // ctx.strokeRect(xpos*tilexsize*chunk[xpos].length+x*tilexsize,ypos*tileysize*chunk[ypos].length+y*tileysize,16,16)
      // ctx.fillStyle = 'black';
      // ctx.fillText(chunk[x][y],xpos*tilexsize*chunk[xpos].length+x*tilexsize,(ypos*tileysize*chunk[ypos].length+y*tileysize)+(tileysize/2))
    }
  }
}
function vals(start,end,num){
  var pint = 1/num;
  var out = [];
  for(var i=0;i<num;i++){
    var time = i*pint
    out.push(Math.round((1-time)*start+time*end));
  }
  return out;
}
function randnum(mapsize){
  var num = []
  for(var x=0;x<mapsize;x++){
    num.push([]);
    for(var y=0;y<mapsize;y++){
      num[x].push(Math.round(Math.random()*4));
    }
  }
  return num;
}

Array.prototype.get = function(id){
  while(id >= this.length){
    id-=this.length;
  }
  return this[id];
}