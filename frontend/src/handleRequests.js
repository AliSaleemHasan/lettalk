const request = {
  getUser: async () => {
    const response = await fetch("/users", {
      method: "GET",
    });
    return response.json();
  },
  login: async (url, password, email) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password, email: email }),
    });
    return response;
  },
  logout: async () => {
    const response = await fetch("/users?logout=true", {
      method: "GET",
    });
    return response.json();
  },
  signup: async (url, username, password, email) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    });
    return response;
  },

  editUserInfo: async (id, settingName, name, updatedInfo) => {
    const response = await fetch(`/users/info/${id}?${settingName}=${name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ info: updatedInfo }),
    });
    return response.json();
  },
  sendMessage: async (id, message, sender) => {
    const response = await fetch(`/chats/${id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, sender }),
    });
    return response.json();
  },

  getChat: async (id) => {
    const response = await fetch(`/chats/${id}`, {
      method: "GET",
    });
    return response.json();
  },
  getAllChats: async (id) => {
    const response = await fetch(`/chats/user/${id}`, {
      method: "GET",
    });
    return response.json();
  },
  searchForUsers: async (query) => {
    const response = await fetch("/users/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    return response.json();
  },
  addChat: async (id, user2) => {
    const response = await fetch(`/chats/user/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user2 }),
    });
    return response.json();
  },
};

export default request;
