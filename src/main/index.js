import { app, net, session, BrowserWindow } from 'electron'


app.on('login', (a, b) => {
	console.log('[APP] login', a, b)
})



var a = async () => {
	console.log('ready ELectron', process.versions.electron)
	/*
	 * Switch between a proxy with and without authentication required
	 * to see the described behaviour.
	*/

	let proxy = 'socks5://5.181.254.179:9975'

	let window = new BrowserWindow({ width: 800, height: 800, show: false });
	let ses = session.defaultSession
	// window.webContents.session;

	await ses.setProxy({ proxyRules: proxy })
	

	const url = 'https://2ip.ru'

	const proxySet = await ses.resolveProxy(url)
	console.log('[proxySet] ==>', proxySet )
	if (!proxySet) {
		return;
	}
	const request = net.request({
		// session: ses, 
		url: url,
	});

  session.defaultSession.on('login', (a, b, c) => { console.log('[session.defaultSession] login', a, b, c) })


	request.on('login', (a, b, c) => { console.log('[request] login', a, b, c) })
	request.on('finish', (a) => { console.log('finish', a) })
	request.on('abort', (a) => { console.log('abort ->', a) })
	request.on('error', (err, b) => { console.log('ERR --->', err, '\n\n', b) })
	request.on('close', (a) => { console.log('close ->', a) })
	request.on('response', (response) => {
		console.log('response ==>')
		let body = '';
		response.on('data', (chunk) => { body += chunk; });
		response.on('end', () => console.log('end =>', body));
	});

	request.end();
};

app.on('ready', () =>{

	a().then(e =>
		console.log('[then] ', e)
		).catch(err => {
		console.log('[ERR] ', err)
	})
}
)