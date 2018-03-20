import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			playlistName: 'New Playlist',
			playlistTracks: [],
			searchResults: []
		};
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
	}
	addTrack(track){
		let trackInPlaylist = false;
		this.state.playlistTracks.forEach(playlistTrack => {
			if (track.id === playlistTrack.id){
				trackInPlaylist = true;
				return;
			}
		});
		if (trackInPlaylist) {
			return;
		} else {
			let playlistTracks = this.state.playlistTracks;
			playlistTracks.push(track);
			this.setState({playlistTracks:playlistTracks});
			return;
		}
	}
	removeTrack(track){
		this.state.playlistTracks.forEach((playlistTrack,playlistTrackIndex) => {
			if (track.id === playlistTrack.id) {
				this.state.playlistTracks.splice(playlistTrackIndex,1);
				this.setState({playlistTracks:this.state.playlistTracks});
				return;
			}
		});
	}
	updatePlaylistName(name){
		this.setState({
			playlistName: name,
		})
	}
	savePlaylist(){
		let trackURIs = this.state.playlistTracks.map(track => {
			return track.uri;
		});
		Spotify.savePlaylist(this.state.playlistName,trackURIs)
		this.setState({
			playlistName: 'New Playlist',
			playlistTracks: [],
			searchResults: []
		})
	}
	search(term){
		let results = Spotify.search(term).then(
			results => {
				this.setState({
					searchResults:results
				})
			}
		);
		return results;
	}
  render() {
    return (
			<div>
			  <h1>Ja<span className="highlight">mmm</span>ing</h1>
			  <div className="App">
					<SearchBar onSearch={this.search}/>
			    <div className="App-playlist">
						<SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
						<Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
			    </div>
			  </div>
			</div>
    );
  }
}

export default App;
