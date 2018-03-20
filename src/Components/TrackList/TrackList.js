import React from 'react';
import Track from '../Track/Track';

class TrackList extends React.Component {
	render() {
		return (
			<div className="TrackList">
				{this.props.tracks ? this.props.tracks.map(track => {
					return <Track key={track.id} track={track} onRemove={this.props.onRemove} onAdd={this.props.onAdd} isRemoval={this.props.isRemoval} />
				}) : <p></p> }
			</div>
		)
	}
}

export default TrackList;
