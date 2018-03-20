let accessToken = '';
let expiresIn = '';
let clientId = '4d2e00c95d084890aca72613e5112cf0';
let redirectUrl = 'http://dy.surge.sh';

let Spotify = {
	getAccessToken: function(){
		if (accessToken) {
			return accessToken;
		} else {
			try {
				let accessTokenRegex = /access_token=([^&]*)/
				let expiresInRegex = /expires_in=([^&]*)/
				accessToken = window.location.href.match(accessTokenRegex)[1]
				expiresIn = window.location.href.match(expiresInRegex)[1]
				if (accessToken && expiresIn) {
					return accessToken
				} else {
					window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectUrl
				}
			} catch (error) {
				window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectUrl
			}
		}
	},
	search: async function(term){
		this.getAccessToken();
		try {
			let response = await fetch('https://api.spotify.com/v1/search?type=track&q=' + term,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});
			if (response.ok){
				let jsonResponse = await response.json();
				if (jsonResponse.tracks){
					return jsonResponse.tracks.items;
				}
			}
		} catch (error) {
			console.log(error)
		}
	},
	savePlaylist: function(playlistName,trackURIs){
		// make sure we have access token set
		this.getAccessToken();
		// set up headers
		let headers = {
			Authorization: `Bearer ${accessToken}`
		}
		// do a get to access our userID
		fetch('https://api.spotify.com/v1/me',{headers:headers})
			.then(response => response.json())
			.then(jsonResponse => {
				return jsonResponse.id
			})
			.then(userID => {
				// let spotify know we're sending json
				headers['Content-Type'] = 'application/json';
				// set up the post data
				let postData = {
					name: playlistName,
				}
				// do the call
				fetch('https://api.spotify.com/v1/users/' + userID + '/playlists', {
					headers: headers,
					method: 'POST',
					body: JSON.stringify(postData),
				})
					.then(response => response.json())
					.then(jsonResponse => {
						return jsonResponse.id
					})
					.then(playlistID => {
						// get our postData ready to add the tracks
						let postData = {
							uris: trackURIs,
						}
						// do the call
						fetch('https://api.spotify.com/v1/users/' + userID + '/playlists/' + playlistID + '/tracks', {
							headers: headers,
							method: 'POST',
							body: JSON.stringify(postData),
						})
							.then(response => response.json())
							.then(jsonResponse => console.log(jsonResponse));
					});
			});
	}
};

export default Spotify;
