const song = WaitingForLove;
// const song = MandameUnAudio;

const drag = () => {
	let moveContainer = false;
	let song = document.querySelector('.karaoke-host').shadowRoot.querySelector('.Song');

	song.addEventListener('mousemove', e => {
		if(moveContainer){
			if(e.clientY > song.offsetHeight/2 && e.clientY < window.innerHeight - song.offsetHeight/2) {
				song.style.top = e.clientY + 'px';
			}
			if(e.clientX > song.offsetWidth/2 && e.clientX < window.innerWidth - song.offsetWidth/2){
				song.style.left = e.clientX + 'px';
			}
		}
	});

	song.addEventListener('mousedown', () => moveContainer = true);
	window.addEventListener('mouseup', () => moveContainer = false);
}

const SongCardStyles = () => {
	return(
		`<style>
			.YTKaraoke-root{
				position:absolute;
				z-index:10000000000;
				top:0px;
				left:0px;
			}
			.Song ::-webkit-scrollbar{
				width: 9px;
				height: 9px;
			}
			.Song ::-webkit-scrollbar-thumb{
				border-radius: 5px;
				border: 2px solid transparent;
				background-color: rgba(0, 0, 0, 0.25);
				background-clip: content-box;
				cursor:pointer;
			}
			.Song{
				border-radius: 16px;
				padding: 24px;
				background-color: rgb(157, 230, 230);
				width: 500px;
				height: 300px;
				position: fixed;
				user-select: none;
				cursor: grab;
				top: 300px;
				left: 300px;
				transform: translate(-50%, -50%);
				font-family: 'Source Sans Pro', sans-serif;
				font-weight: 400;
			}
			.Song:active{
				cursor: grabbing;
			}
			.SongData{
				display: flex;
				flex-direction: column;
				gap: 0 16px;
				align-items: start;
				margin-bottom: 16px;
			}
			.SongData-title{
				margin: 0;
				font-size: 19px;
			}
			.SongData-artists{
				margin: 0;
				font-size: 16px;
			}
			.Lyrics-wrapper{
				display: flex;
				flex-direction: column;
				align-items: center;
				max-height: 21%;
				width: 100%;
				position: relative;
				font-family: 'Source Sans Pro', sans-serif;
				font-weight: 600;
				font-size: 25px;
				overflow: hidden;
				overflow-y: scroll;
				scroll-behavior: smooth;
				padding: 18% 0;
			}
			.Lyrics-line{
				margin-top:30px;
				color: rgba(0, 0, 0, 0.3);;
				text-align: center;
				transition: all .2s linear;
				cursor: pointer;
			}
			.Lyrics-line:hover{
				transform:scale(0.9)
			}
			.Lyrics-middle{
				color: rgba(0, 0, 0, 0.9);
			}
			.Lyrics-isActive{
				color: rgb(0 112 225);
			}
		</style>`
	)
}


const SongCard = (song) => {
	let lCounter = 1, timeLines = '';
	for (const timeLine in song) {
		console.log(timeLine)
		if (Object.hasOwnProperty.call(song, timeLine)) {
			
			if(timeLine != undefined && timeLine != 'totalTime' && timeLine != 'title' && timeLine != 'artists'){
				timeLines += `<div data-time='${timeLine}' class='Lyrics-line Lyrics-line--${lCounter}'>${song[timeLine][1]}</div>`;
				lCounter++;
			}
		}
	}
	return(
 		`<section class="Song">
			<div class="SongData">
				<h2 class="SongData-title">${song.title}</h2>
				<h4 class="SongData-artists">${song.artists}</h4>
			</div>
			<div class="Lyrics-wrapper">${timeLines}</div>
		</section>`
	) 
}

const followTrack = (song) => {
	let currentTime = '', currentLine = 0;

	document.querySelector("video").ontimeupdate = () => {
		currentTime = parseInt(document.querySelector("video").currentTime);
		for (const timeLine in song) {
			if(timeLine != undefined && timeLine != 'totalTime' && timeLine != 'title' && timeLine != 'artists'){
				if (currentTime >= timeLine){
					currentLine = timeLine;
					// console.log(currentTime)
					let selectedLine = document.querySelector('.karaoke-host').shadowRoot.querySelector('.Lyrics-line--' + song[timeLine][0]);
 					selectedLine.classList = `Lyrics-line Lyrics-line--${song[timeLine][0]} Lyrics-middle`;
					selectedLine.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
				} else {
					let selectedLine = document.querySelector('.karaoke-host').shadowRoot.querySelector('.Lyrics-line--' + song[timeLine][0]);
 					selectedLine.classList = `Lyrics-line Lyrics-line--${song[timeLine][0]}`;
				}
			}
		}
		let selectedLine = document.querySelector('.karaoke-host').shadowRoot.querySelector('.Lyrics-line--' + song[currentLine][0]);
 		selectedLine.classList += ` Lyrics-isActive`;
	}
}

const goToSelectTrack = () => {
	const wrapper =  document.querySelector('.karaoke-host').shadowRoot.querySelector('.Lyrics-wrapper');
	wrapper.addEventListener('click', e => {
		if(e.target.className.includes('Lyrics-line')){
			document.querySelector("video").currentTime = e.target.getAttribute('data-time')
		}
	});
}

if(typeof init === 'undefined'){
	const init = () => {
		const hostEle = document.createElement('div');
		hostEle.className = 'karaoke-host';
		document.body.appendChild(hostEle);

		let host = document.querySelector('.karaoke-host');
		let root = host.attachShadow({mode: 'open'});
		let div = document.createElement('div');
		div.className = 'YTKaraoke-root';

		const card = SongCard(song);
		const styles = SongCardStyles();

		const preConnectFont = 
		`<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet">`;

		document.querySelector('head').innerHTML += preConnectFont;

		div.innerHTML = styles+card;
		root.appendChild(div);

		followTrack(song);
		
		goToSelectTrack();

		drag();
	}
	init();
}