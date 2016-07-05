
var express=require('express');
var app=express();
var server=require('http').Server(app);
var mysocket=require('socket.io');
var io=mysocket(server);

var users= {};
var names=[];

app.get('/',function(req,res){
		res.sendFile(__dirname+'/index.html');
});


io.on('connection',function(socket){
	
	console.log('a user connected.');


	socket.on('new user',function(data,callback){
        console.log("Name received");
			if(names.indexOf(data) != -1){
				callback(false);
			}
			else{
				callback(true);
				names.push(data);
                users[socket.id]=data;
                io.sockets.emit('names',names);
			}
			
	});

	socket.on('chat message',function(message){
			if(message){
				io.emit('chat message',users[socket.id]+" :: "+message);
			}
		});

	socket.on('disconnect',function(){
        if(socket.id in users){
            var tmp = users[socket.id];
            names.splice(names.indexOf(users[socket.id]), 1);
            delete users[socket.id];
            io.emit('out', tmp);
            io.emit('names', names);
        }
    })
});

server.listen(8000,function(){
					console.log("listing on port 8000")
				});
