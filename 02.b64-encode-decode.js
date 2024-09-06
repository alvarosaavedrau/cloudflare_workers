addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = new URL(request.url)
    const params = url.searchParams
    const action = params.get('action')
    const text = params.get('text')

    // Validaciones iniciales
    if (!action || !text) {
        return new Response(`Usage:

  Encode: https://b64.alvarosaavedra.es/?action=encode&text=yourText
  Decode: https://b64.alvarosaavedra.es/?action=decode&text=yourText`, {
            status: 400,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
    }

    if (text.length > 100) {
        return new Response('The text is too long. Limit the input to 100 characters...', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
    }

    if (!['encode', 'decode'].includes(action)) {
        return new Response('Action not supported. Use ?action=encode or ?action=decode', {
            status: 400,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
    }

    try {
        let result;
        if (action === 'encode') {
            try {
                result = btoa(text)
            } catch (e) {
                return new Response('Error when encoding the text: ' + e.message, {
                    status: 400,
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8'
                    }
                })
            }
        } else if (action === 'decode') {
            try {
                result = atob(text)
            } catch (e) {
                return new Response('Error when decoding the text: ' + e.message, {
                    status: 400,
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8'
                    }
                })
            }
        }

        return new Response(result, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
    } catch (error) {
        return new Response('Internal error while processing the request. Try again later', {
            status: 500,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
    }
}