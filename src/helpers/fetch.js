
const conectar = async (urlApi, method = 'GET', body = {}, token, responseType = 'json'/*comentar pa que sirve responseType*/ ) => {
  try {
    let options = {
      method,
      headers: {},
      credentials: 'include'
    };

    //comentar pa que sirve
    if (responseType !== 'blob') {
      options.headers['Content-Type'] = 'application/json';
    }

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    if (isFormData) {
      if (options.headers && options.headers['Content-Type']) {
        delete options.headers['Content-Type'];
      }
    }

    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      options.body = isFormData ? body : JSON.stringify(body);
    }
    //console.log(options);
    const resp = await fetch(urlApi, options);

    //comentar pa que sirve
    if (!resp.ok) {
      const contentType = resp.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await resp.json().catch(() => null);
        return { ok: false, status: resp.status, body: json };
      }
      const text = await resp.text().catch(() => null);
      return { ok: false, status: resp.status, body: text };
    }

    if (responseType === 'blob') {
      return await resp.blob();
    }

    if (responseType === 'arrayBuffer') {
      return await resp.arrayBuffer();
    }
    //asta qui.
    //console.log(resp);
    const datos = await resp.json();
    //console.log(datos);
    return datos;

  } catch (error) {
    console.log(error);
    return error;
  }
};

export default conectar ;