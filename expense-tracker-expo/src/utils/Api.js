import axios from 'axios';

const baseUrl = 'https://expense-tracker-app-gamma-swart.vercel.app/';

const requests = {
  LOGIN_API: 'api/users/login/',
  REGISTER_API: 'api/users/register/',
  DEMO_LOGIN_API: 'api/users/demo/',
  CATEGORIES_API: 'api/categories/',
  TRANSACTIONS_API: '/transactions/',
};

const getService = async (method, token, id = null) => {
  let url = baseUrl.concat(requests[method]);
  if (id !== null) url.concat(id).concat('/');

  console.log({ url });
  console.log({ token });

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: token,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const postService = async (method, token, data, id = null) => {
  let url = baseUrl;

  if (method === 'TRANSACTIONS_API') {
    url = url
      .concat(requests['CATEGORIES_API'])
      .concat(id)
      .concat(requests['TRANSACTIONS_API']);
  } else url = url.concat(requests[method]);

  console.log({ url });
  console.log({ data });
  console.log({ token });

  try {
    const res = await axios.post(url, data, {
      headers: {
        Authorization: token,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    if (method !== 'LOGIN_API' && method !== 'REGISTER_API') return null;
    if (!err.response) return 'Network Error';
    const { error } = err.response.data;
    return { error };
  }
};

const putService = async (method, token, data, categoryId, transactionId) => {
  let url = baseUrl;
  if (method === 'TRANSACTIONS_API') {
    url = url
      .concat(requests['CATEGORIES_API'])
      .concat(categoryId)
      .concat(requests['TRANSACTIONS_API'])
      .concat(transactionId);
  } else url = url.concat(requests[method]).concat(categoryId);

  console.log({ url });
  console.log({ data });
  console.log({ token });

  try {
    const res = await axios.put(url, data, {
      headers: {
        Authorization: token,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteService = async (method, token, categoryId, transactionId) => {
  let url = baseUrl;
  if (method === 'TRANSACTIONS_API') {
    url = url
      .concat(requests['CATEGORIES_API'])
      .concat(categoryId)
      .concat(requests['TRANSACTIONS_API'])
      .concat(transactionId);
  } else url = url.concat(requests[method]).concat(categoryId);

  console.log({ url });
  console.log({ categoryId });
  console.log({ token });

  try {
    const res = await axios.delete(url, {
      headers: {
        Authorization: token,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Add Transaction wrapper
const addTransaction = async (transaction) => {
  const categoryId = transaction.categoryId;
  const data = {
    amount: transaction.amount,
    description: transaction.note || transaction.title,
    date: transaction.date
  };

  const token = ''; // Token should be passed
  return await postService('TRANSACTIONS_API', token, data, categoryId);
};

// Update Transaction wrapper  
const updateTransaction = async (transactionId, transaction) => {
  const categoryId = transaction.categoryId;
  const data = {
    amount: transaction.amount,
    description: transaction.note || transaction.title,
    date: transaction.date
  };

  const token = ''; // Token should be passed
  return await putService('TRANSACTIONS_API', token, data, categoryId, transactionId);
};

export { getService, postService, putService, deleteService, addTransaction, updateTransaction };
