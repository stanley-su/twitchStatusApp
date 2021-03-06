"use strict";

const streamers = document.getElementById('streamers'),
	  filters = document.getElementById('filters');

filters.addEventListener('click', function(e) {
	let filter = e.target.id;
	filterUsers(defaultUsers, filter === 'all' ? 'image' : filter);
});

let defaultUsers = [
  {"name": "freecodecamp"},
  {"name": "esl_csgo"},
  {"name": "playoverwatch"},
  {"name": "scream"},
  {"name": "summit1g"},
  {"name": "pashabiceps"},
  {"name": "m0e_tv"},
  {"name": "c9sneaky"}
];

function getData(users, type) {
	users.forEach((user, i) => {
		let url = `https://wind-bow.glitch.me/twitch-api/${type}/${user.name}`;
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				users[i][type] = data;
			}
		});
	});
}

function getTwitchData(users) {
	getData(users, 'users');
	getData(users, 'streams');
	getData(users, 'channels');
	setTimeout(function(){displayUserData(defaultUsers);},3500);
}

function displayUserData(users) {
	streamers.innerHTML = "";
	users.forEach(user => {
		streamers.innerHTML += toHTML(user);
	});
}

function toHTML(user) {
	let streamStatus = (user.streams.stream !== null ? user.streams.stream.channel.status : 'Offline');
	let status = streamStatus === 'Offline' ? 'offline' : 'online';
	let htmlString = `<a href="${user.channels.url}"><div class="streamer"><div class="image ${status}" style="background-image: url('${user.users.logo}');"></div><div class="name ${status}">${user.users['display_name']}</div><div class="status ${status}">${streamStatus}</div></div></a>`
	return htmlString;
}

function removeUser(user) {
	let index = defaultUsers.findIndex(element => element.name === user);
	defaultUsers.splice(index, 1);
	let userElement = streamers.children[index];
	userElement.parentNode.removeChild(userElement);
}

function filterUsers(users, filter) {
	let htmlUsers = streamers.childNodes;
	htmlUsers.forEach(function(curr, i, arr) {
		if (curr.firstChild.firstChild.className.indexOf(filter) === -1) {
			curr.classList.add('hidden');
		} else {
			curr.classList.remove('hidden');
		}
	});
}



getTwitchData(defaultUsers);
console.log(defaultUsers);