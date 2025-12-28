
const conectar = async (urlApi, method = 'GET', body = {}, token) => {
  try {
    let options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
      options.credentials = 'include'
    }

    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      options.body = JSON.stringify(body);
    }

    const resp = await fetch(urlApi, options);
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