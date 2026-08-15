const getErrorMessage = (err, fallback = 'Xatolik yuz berdi') => {
  const apiMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg;
  if (apiMessage) return apiMessage;

  if (!err.response || err.code === 'ERR_NETWORK') {
    return 'Serverga ulanib bo\'lmadi. API ishga tushirilganini tekshiring.';
  }

  return fallback;
};

export default getErrorMessage;
