const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/user/create`,
    verifyAccountInitiate: `${API_BASE_URL}/auth/initiate-email-verification`,
    verifyAccountConfirm: (code: string) =>
      `${API_BASE_URL}/auth/verify-email/${code}`,
    resetPasswordInitiate: `${API_BASE_URL}/auth/initiate-reset-password`,
    resetPasswordConfirm: `${API_BASE_URL}/auth/reset-password`,
  },
  user: {
    me: `${API_BASE_URL}/user/me`,
    all: `${API_BASE_URL}/user/all`,
  },
  parking: {
    all: `${API_BASE_URL}/parking/all`,
    create: `${API_BASE_URL}/parking/create`,
    getById: (id: string) => `${API_BASE_URL}/parking/${id}`,
    update: (id: string) => `${API_BASE_URL}/parking/${id}`,
    delete: (id: string) => `${API_BASE_URL}/parking/${id}`,
  },

    carRecords: {
      all: `${API_BASE_URL}/car-records/all`,
      create: `${API_BASE_URL}/car-records/create`,
      getById: (id: string) => `${API_BASE_URL}/car-records/${id}`,
      update: (id: string) => `${API_BASE_URL}/car-records/${id}`,
      delete: (id: string) => `${API_BASE_URL}/car-records/${id}`,
      exit: (id: string) => `${API_BASE_URL}/car-records/${id}/exit`,
    },
    ticket: {
      all: `${API_BASE_URL}/tickets/all`,
      create: `${API_BASE_URL}/tickets/create`,
      getById: (id: string) => `${API_BASE_URL}/tickets/${id}`,
      delete: (id: string) => `${API_BASE_URL}/tickets/${id}`,
      
    },
  };

 

export default API_ENDPOINTS;
