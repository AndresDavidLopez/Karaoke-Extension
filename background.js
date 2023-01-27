try {
	chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
		if(changeInfo.status == 'complete'){
			chrome.scripting.executeScript({
				files: ['./scripts/WaitingForLove.js','./scripts/MandameUnAudio.js','./scripts/content.js'],
				target: {tabId: tab.id}
			})
		}
	})

} catch (error) {
	console.log(error)
}