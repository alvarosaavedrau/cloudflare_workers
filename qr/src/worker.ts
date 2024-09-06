const qr = require('qr-image');

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (req.method === 'POST') {
			return generateQRCode(req);
		}

		return new Response(landing, {
			headers: {
				'Content-Type': 'text/html',
			},
		});
	},
};

async function generateQRCode(req: Request): Promise<Response> {
    const { text } = await req.json();
    const headers = { 'Content-Type': 'image/png' };
    const qr_png = qr.imageSync(text || 'https://alvarosaavedra.cloud', { type: 'png', size: 10 });
    return new Response(qr_png, { headers });
}


const landing = `
<h1>QR Generator</h1>
<p>Click the below button to generate a new QR code.</p>
<input type="text" id="text" value="https://alvarosaavedra.cloud" style="width: 300px;"></input>
<button onclick="generate()">Generate QR Code</button>
<br>
<img id="qr" src="#" style="width: 300px; height: auto;" />
<script>
	function generate() {
		fetch(window.location.pathname, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text: document.querySelector("#text").value })
		})
		.then(response => response.blob())
		.then(blob => {
			const reader = new FileReader();
			reader.onloadend = function () {
				document.querySelector("#qr").src = reader.result;
			}
			reader.readAsDataURL(blob);
		})
	}
</script>
`;
